import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import User from '@/core/models/User';
import DailyActivity from '@/core/models/DailyActivity';
import Attempt from '@/core/models/Attempt';
import Pattern from '@/core/models/Pattern';
import Session from '@/core/models/Session';

export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const userId = authUser.userId;
        const section = req.nextUrl.searchParams.get('section') || 'ALL';

        const today = new Date().toISOString().split('T')[0];
        const yearAgoDate = new Date();
        yearAgoDate.setDate(yearAgoDate.getDate() - 365);
        const yearAgo = yearAgoDate.toISOString().split('T')[0];

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const attemptMatch: any = { user_id: userObjectId };
        const sessionMatch: any = { user_id: userObjectId };

        if (section === 'QUANT' || section === 'REASONING') {
            attemptMatch.subject = section;
            sessionMatch['config.subject'] = section;
        }

        const [
            user,
            todayActivity,
            heatmap,
            topicStats,
            recentAttempts,
            difficultyStats,
            patterns,
            sessionsCount
        ] = await Promise.all([
            // 1. User Profile & Stats
            User.findById(userId).select('profile stats preferences config').lean(),

            // 2. Today's Activity
            DailyActivity.findOne({ user_id: userId, date: today }).lean(),

            // 3. Heatmap (365 days)
            DailyActivity.find(
                { user_id: userId, date: { $gte: yearAgo } },
                'date questions_solved quant_solved reasoning_solved'
            ).sort({ date: 1 }).lean(),

            // 4. Topic Accuracy (Aggregation)
            Attempt.aggregate([
                { $match: attemptMatch },
                {
                    $group: {
                        _id: { pattern: '$pattern', subject: '$subject' },
                        total: { $sum: 1 },
                        correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
                        avg_time: { $avg: '$time_ms' },
                        last_attempted: { $max: '$created_at' }
                    }
                },
                {
                    $project: {
                        pattern: '$_id.pattern',
                        subject: '$_id.subject',
                        total: 1,
                        correct: 1,
                        accuracy: { $divide: ['$correct', '$total'] },
                        avg_time_ms: '$avg_time',
                        last_attempted: 1
                    }
                },
                { $sort: { accuracy: 1 } } // Worst topics first for direct UI mapping
            ]),

            // 5. Recent Attempts (Last 15)
            Attempt.find(attemptMatch)
                .sort({ created_at: -1 })
                .limit(15)
                .populate('question_id', 'text')
                .lean(),

            // 6. Difficulty Breakdown
            Attempt.aggregate([
                { $match: attemptMatch },
                {
                    $group: {
                        _id: { difficulty: '$difficulty', subject: '$subject' },
                        total: { $sum: 1 },
                        correct: { $sum: { $cond: ['$is_correct', 1, 0] } }
                    }
                }
            ]),

            // 7. Pattern Display Names
            Pattern.find({}, 'code name subject').lean(),

            // 8. Session / Sprint Discipline
            Session.aggregate([
                { $match: sessionMatch },
                {
                    $group: {
                        _id: '$status', // 'COMPLETED' or 'ABANDONED' or 'IN_PROGRESS'
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // --- PREMIUM PRO ENGINE AGGREGATIONS ---
        let premium_insights = null;
        if (user.config?.is_premium) {
            const [premiumAttempts, premiumSessions] = await Promise.all([
                // 1. Time-Drain Scatter Plot (Last 500 attempts)
                Attempt.find(attemptMatch)
                    .select('time_ms difficulty is_correct pattern created_at')
                    .sort({ created_at: -1 })
                    .limit(500)
                    .lean(),
                
                // 2. Fatigue Curve (Last 10 completed Sprints)
                Session.find({ ...sessionMatch, status: 'COMPLETED', type: 'SPRINT' })
                    .select('question_status started_at')
                    .sort({ started_at: -1 })
                    .limit(10)
                    .lean()
            ]);

            // Clean the data payload
            const mappedAttempts = premiumAttempts.map(a => ({
                time_ms: a.time_ms,
                difficulty: a.difficulty,
                is_correct: a.is_correct,
                pattern: a.pattern,
                created_at: a.created_at
            }));

            premium_insights = {
                recent_raw_attempts: mappedAttempts,
                recent_fatigue_sessions: premiumSessions
            };
        }

        // --- DATA PROCESSING ---

        // Map patterns for easy lookup
        const patternMap = (patterns as any[]).reduce((acc, p) => {
            acc[p.code] = p.name;
            return acc;
        }, {} as Record<string, string>);

        // Process Topic Stats with Display Names & Pacing Matrix
        // Target: 36s (36000ms), 65% Accuracy (0.65)
        const processedTopicStats = (topicStats as any[]).map(t => {
            const isFast = t.avg_time_ms <= 36000;
            const isAccurate = t.accuracy > 0.65;
            let pacing_category = 'NEEDS_REVIEW';
            if (isFast && isAccurate) pacing_category = 'MASTERED';
            else if (!isFast && isAccurate) pacing_category = 'NEEDS_SPEED';
            else if (isFast && !isAccurate) pacing_category = 'CARELESS_ERRORS';

            return {
                ...t,
                display_name: patternMap[t.pattern] || t.pattern.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                pacing_category
            };
        });

        // Process Recent Attempts with Display Names
        const processedRecentAttempts = (recentAttempts as any[]).map(a => ({
            ...a,
            display_name: patternMap[a.pattern] || a.pattern.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        }));

        // Process Difficulty Stats
        const processedDifficultyStats = (difficultyStats as any[]).reduce((acc, d) => {
            const diff = d._id.difficulty || 'MEDIUM';
            if (!acc[diff]) {
                acc[diff] = { total: 0, correct: 0 };
            }
            acc[diff].total += d.total;
            acc[diff].correct += d.correct;
            return acc;
        }, {} as Record<string, { total: number, correct: number, accuracy?: number }>);

        ['EASY', 'MEDIUM', 'HARD'].forEach(lvl => {
            if (!processedDifficultyStats[lvl]) processedDifficultyStats[lvl] = { total: 0, correct: 0, accuracy: 0 };
            else processedDifficultyStats[lvl].accuracy = processedDifficultyStats[lvl].total > 0 ? processedDifficultyStats[lvl].correct / processedDifficultyStats[lvl].total : 0;
        });

        // Calculate Sprint Discipline
        let totalSessions = 0;
        let completedSessions = 0;
        (sessionsCount as any[]).forEach(s => {
            totalSessions += s.count;
            if (s._id === 'COMPLETED') completedSessions += s.count;
        });
        const sprint_discipline = totalSessions > 0 ? completedSessions / totalSessions : 0; // 0 fallback is safer for Division-by-Zero

        // Overall calculations
        const difficultyValues = Object.values(processedDifficultyStats) as { total: number, correct: number }[];
        const totalSolved: number = difficultyValues.reduce((acc, d) => acc + d.total, 0);
        const totalCorrect: number = difficultyValues.reduce((acc, d) => acc + d.correct, 0);
        const overallAccuracy: number = totalSolved > 0 ? totalCorrect / totalSolved : 0;

        let totalTimeMs = 0;
        let attemptCountWithTime = 0;
        (topicStats as any[]).forEach(t => {
            if (t.avg_time_ms) {
                totalTimeMs += (t.avg_time_ms * t.total);
                attemptCountWithTime += t.total;
            }
        });
        const overallAvgTimeMs = attemptCountWithTime > 0 ? totalTimeMs / attemptCountWithTime : 0;

        // Overall stats object
        const overall_stats = {
            accuracy: overallAccuracy,
            avg_time_ms: overallAvgTimeMs,
            total_solved: totalSolved,
            total_correct: totalCorrect,
            streak: user.stats.current_streak,
            max_streak: user.stats.max_streak
        };

        // --- RESPONSE CONSTRUCTION ---
        return NextResponse.json({
            success: true,
            dashboard: {
                user: {
                    profile: user.profile,
                    preferences: user.preferences,
                    config: user.config,
                },
                daily_progress: {
                    date: today,
                    questions_solved: todayActivity?.questions_solved || 0,
                    year_questions_solved: user.stats.total_solved,
                    quant_solved: todayActivity?.quant_solved || 0,
                    reasoning_solved: todayActivity?.reasoning_solved || 0,
                    quant_goal: user.preferences?.daily_quant_goal || 10,
                    reasoning_goal: user.preferences?.daily_reasoning_goal || 10,
                    daily_goal: (user.preferences?.daily_quant_goal || 10) + (user.preferences?.daily_reasoning_goal || 10),
                    streak: user.stats.current_streak,
                    max_streak: user.stats.max_streak
                },
                overall_stats,
                heatmap,
                topic_stats: processedTopicStats,
                recent_attempts: processedRecentAttempts,
                difficulty_stats: processedDifficultyStats,
                advanced_insights: {
                    sprint_discipline,
                    completed_sessions: completedSessions,
                    total_sessions: totalSessions,
                    pro_engine: premium_insights
                }
            }
        });

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
