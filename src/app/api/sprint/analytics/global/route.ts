import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import Session from "@/core/models/Session";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const userId = new mongoose.Types.ObjectId(user.userId);

        // Find invalid sessions to exclude
        const invalidSessions = await Session.find({
            user_id: userId,
            type: 'SPRINT',
            $or: [
                { status: { $ne: 'COMPLETED' } },
                { 'stats.total_time_ms': { $lt: 5000 } },
                { total_time_ms: { $lt: 5000 } }
            ]
        }).select('_id').lean();

        const invalidSessionIds = invalidSessions.map(s => s._id);

        // 1. Fetch Aggregations
        const [topicPerformanceCount] = await Promise.all([
            Attempt.aggregate([
                {
                    $match: {
                        user_id: userId,
                        session_id: { $nin: invalidSessionIds }
                    }
                },
                {
                    $group: {
                        _id: { pattern: '$pattern', subject: '$subject', difficulty: '$difficulty' },
                        total: { $sum: 1 },
                        correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
                        avg_time: { $avg: '$time_ms' }
                    }
                }
            ])
            // We can add Session aggregations later if needed for consistency. 
            // Attempt aggregation gives us enough for Matrix, Red Zone, Readiness, and Difficulty.
        ]);

        // Manual grouping by pattern to merge difficulties
        const patternMap = new Map();

        topicPerformanceCount.forEach((topic: any) => {
            const { pattern, subject, difficulty } = topic._id;

            if (!patternMap.has(pattern)) {
                patternMap.set(pattern, {
                    pattern,
                    subject,
                    total: 0,
                    correct: 0,
                    total_time: 0, // for weighted average
                    by_difficulty: {
                        EASY: { total: 0, correct: 0 },
                        MEDIUM: { total: 0, correct: 0 },
                        HARD: { total: 0, correct: 0 },
                    }
                });
            }

            const stats = patternMap.get(pattern);
            stats.total += topic.total;
            stats.correct += topic.correct;
            stats.total_time += (topic.avg_time * topic.total);

            if (difficulty && stats.by_difficulty[difficulty]) {
                stats.by_difficulty[difficulty].total += topic.total;
                stats.by_difficulty[difficulty].correct += topic.correct;
            }
        });

        const aggregatedTopics = Array.from(patternMap.values()).map(p => ({
            ...p,
            accuracy: p.total > 0 ? p.correct / p.total : 0,
            avg_time: p.total > 0 ? p.total_time / p.total : 0
        }));

        // --- Computations ---

        const TARGET_TIME_MS = 36000;

        // 1. Efficiency Matrix (Require at least 5 attempts for meaningful insight)
        const efficiency_matrix = aggregatedTopics
            .filter(t => t.total >= 5)
            .map(topic => {
                const isFast = topic.avg_time <= TARGET_TIME_MS;
                const isAccurate = topic.accuracy >= 0.65;

                let category = 'NEEDS_REVIEW';
                let message = `${topic.pattern} needs concept review. ${Math.round(topic.accuracy * 100)}% accuracy at ${Math.round(topic.avg_time / 1000)}s suggests gaps.`;

                if (isFast && isAccurate) {
                    category = 'MASTERED';
                    message = `Strong in ${topic.pattern}. ${Math.round(topic.accuracy * 100)}% accuracy at ${Math.round(topic.avg_time / 1000)}s avg.`;
                } else if (isFast && !isAccurate) {
                    category = 'CARELESS';
                    message = `You answer ${topic.pattern} in ${Math.round(topic.avg_time / 1000)}s but only ${Math.round(topic.accuracy * 100)}% correct. Slow down.`;
                } else if (!isFast && isAccurate) {
                    category = 'NEEDS_SPEED';
                    message = `${Math.round(topic.accuracy * 100)}% accuracy in ${topic.pattern} is great, but ${Math.round(topic.avg_time / 1000)}s per question is too slow.`;
                }

                return {
                    pattern: topic.pattern,
                    subject: topic.subject,
                    accuracy: Math.round(topic.accuracy * 100),
                    avg_time_s: Math.round(topic.avg_time / 1000),
                    attempts: topic.total,
                    category,
                    message
                };
            });

        // 2. Red Zone Topics (Weakest areas with enough data)
        const red_zone_topics = aggregatedTopics
            .filter(t => t.total >= 5 && t.accuracy < 0.5)
            .sort((a, b) => a.accuracy - b.accuracy) // lowest accuracy first
            .slice(0, 3)
            .map(t => ({
                pattern: t.pattern,
                subject: t.subject,
                accuracy: Math.round(t.accuracy * 100),
                attempts: t.total
            }));

        // 3. Exam Readiness (Required at least 3 attempts to establish baseline)
        const exam_readiness = aggregatedTopics
            .filter(t => t.total >= 3)
            .map(topic => {
                const accuracyScore = topic.accuracy * 100;
                // Speed Score: 100 if at target time. Drops linearly to 0 at double target time.
                const speedRatio = topic.avg_time / TARGET_TIME_MS;
                const speedScore = Math.max(0, 1 - Math.max(0, speedRatio - 1)) * 100;

                // 60% accuracy, 40% speed
                const finalScore = Math.round((accuracyScore * 0.6) + (Math.min(speedScore, 100) * 0.4));

                let label = 'Critical ⚠️';
                if (finalScore >= 80) label = 'Exam Ready ✓';
                else if (finalScore >= 60) label = 'Almost There';
                else if (finalScore >= 40) label = 'Improving';
                else if (finalScore >= 20) label = 'Needs Work';

                return {
                    pattern: topic.pattern,
                    subject: topic.subject,
                    score: finalScore,
                    attempts: topic.total,
                    label
                };
            }).sort((a, b) => b.score - a.score); // Highest first

        // 4. Difficulty Progression
        const difficulty_progression: any[] = [];
        aggregatedTopics.forEach(topic => {
            const med = topic.by_difficulty['MEDIUM'];
            if (med.total >= 5) {
                const medAcc = med.correct / med.total;
                if (medAcc >= 0.8) {
                    difficulty_progression.push({
                        pattern: topic.pattern,
                        recommendation: 'LEVEL_UP',
                        message: `You're crushing Medium ${topic.pattern} (${Math.round(medAcc * 100)}%). Ready for Hard.`
                    });
                } else if (medAcc <= 0.4) {
                    difficulty_progression.push({
                        pattern: topic.pattern,
                        recommendation: 'LEVEL_DOWN',
                        message: `Medium ${topic.pattern} is tough right now (${Math.round(medAcc * 100)}%). Drop to Easy to build basics.`
                    });
                }
            }
        });

        // 5. Topic Correlation
        const topic_correlation: any[] = [];
        const patternPerformance: Record<string, { accuracy: number, total: number, subject: string }> = {};

        aggregatedTopics.forEach(t => {
            patternPerformance[t.pattern] = { accuracy: t.accuracy, total: t.total, subject: t.subject };
        });

        const correlationRules = [
            { strong: 'Percentage', weak: 'Profit and Loss', message: "P&L builds on Percentage concepts. Your Percentage is strong ({strongAcc}%), so the {weak} gap ({weakAcc}%) is likely about problem patterns, not math ability." },
            { strong: 'Ratio and Proportion', weak: 'Mixture and Alligation', message: "Mixtures rely on Ratio concepts. You're great at Ratios ({strongAcc}%), so focus on the specific Mixture setup steps to improve your {weakAcc}%." },
            { strong: 'Time and Work', weak: 'Pipes and Cistern', message: "Pipes & Cisterns is identical math to Time & Work. Just remember leaks are negative work! Transfer your {strongAcc}% T&W skill to fix your {weakAcc}% P&C score." }
        ];

        correlationRules.forEach(rule => {
            const strongPerf = patternPerformance[rule.strong];
            const weakPerf = patternPerformance[rule.weak];

            if (strongPerf && weakPerf && strongPerf.total >= 3 && weakPerf.total >= 3) {
                if (strongPerf.accuracy >= 0.7 && weakPerf.accuracy <= 0.4) {
                    topic_correlation.push({
                        topic: rule.weak,
                        related_topic: rule.strong,
                        subject: strongPerf.subject,
                        message: rule.message
                            .replace('{strongAcc}', Math.round(strongPerf.accuracy * 100).toString())
                            .replace('{weak}', rule.weak)
                            .replace('{weakAcc}', Math.round(weakPerf.accuracy * 100).toString())
                    });
                }
            }
        });

        // 6. Consistency Score
        const validSessions = await Session.find({
            user_id: userId,
            type: 'SPRINT',
            status: 'COMPLETED',
            _id: { $nin: invalidSessionIds }
        }).sort({ created_at: 1 }).select('topic_performance config').lean();

        const topicHistory: Record<string, { accuracy: number, subject: string }[]> = {};

        validSessions.forEach(session => {
            if (session.topic_performance) {
                session.topic_performance.forEach((tp: any) => {
                    if (tp.total > 0) {
                        if (!topicHistory[tp.topic]) topicHistory[tp.topic] = [];
                        topicHistory[tp.topic].push({ accuracy: tp.accuracy, subject: session.config.subject });
                    }
                });
            }
        });

        const consistency_alerts: any[] = [];
        Object.entries(topicHistory).forEach(([topic, history]) => {
            if (history.length >= 4) {
                const accuracies = history.map(h => h.accuracy);
                // Calculate max-min difference
                const max = Math.max(...accuracies);
                const min = Math.min(...accuracies);
                const spread = max - min; // eg 0.8 - 0.2 = 0.6
                if (spread >= 0.5) { // 50% spread
                    consistency_alerts.push({
                        topic,
                        subject: history[0].subject,
                        spread: Math.round(spread * 100),
                        history: accuracies.map(a => Math.round(a * 100)),
                        message: `Your ${topic} scores vary wildly (${Math.round(min * 100)}%-${Math.round(max * 100)}%). This suggests careless errors under pressure, not a concept gap.`
                    });
                }
            }
        });

        return NextResponse.json({
            success: true,
            analytics: {
                efficiency_matrix,
                red_zone_topics,
                exam_readiness,
                difficulty_progression,
                topic_correlation,
                consistency_alerts
            }
        });

    } catch (error) {
        console.error("Error fetching global analytics:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
