
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import User from '@/core/models/User';
import DailyActivity from '@/core/models/DailyActivity';
import Attempt from '@/core/models/Attempt';
import Pattern from '@/core/models/Pattern';

export async function GET(req: NextRequest) {
    try {
        // 1. Authentication
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const userId = authUser.userId;
        const section = req.nextUrl.searchParams.get('section') || 'ALL';

        // 2. Date calculations
        // Get today in YYYY-MM-DD format (local time implied by valid ISO string slicing)
        // ideally we should handle timezones, but for now we follow existing patterns
        const today = new Date().toISOString().split('T')[0];

        // Year ago for heatmap
        const yearAgoDate = new Date();
        yearAgoDate.setDate(yearAgoDate.getDate() - 365);
        const yearAgo = yearAgoDate.toISOString().split('T')[0];

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // 3. Parallel Queries
        const [
            user,
            todayActivity,
            heatmap,
            topicStats,
            recentAttempts,
            difficultyStats,
            patterns
        ] = await Promise.all([

            // 1. User Profile & Stats
            User.findById(userId).select('profile stats preferences config').lean(),

            // 2. Today's Activity
            DailyActivity.findOne({ user_id: userId, date: today }).lean(),

            // 3. Heatmap (365 days) - Fetch all necessary fields for filtering
            DailyActivity.find(
                { user_id: userId, date: { $gte: yearAgo } },
                'date questions_solved quant_solved reasoning_solved'
            ).sort({ date: 1 }).lean(),

            // 4. Topic Accuracy (Aggregation)
            Attempt.aggregate([
                { $match: { user_id: userObjectId } }, // Filter by subject if needed, but we fetch all for now
                {
                    $group: {
                        _id: { pattern: '$pattern', subject: '$subject' },
                        total: { $sum: 1 },
                        correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
                        avg_time: { $avg: '$time_ms' }
                    }
                },
                {
                    $project: {
                        pattern: '$_id.pattern',
                        subject: '$_id.subject',
                        total: 1,
                        correct: 1,
                        accuracy: { $divide: ['$correct', '$total'] },
                        avg_time_ms: '$avg_time'
                    }
                },
                { $sort: { accuracy: 1 } } // Worst topics first
            ]),

            // 5. Recent Attempts (Last 10)
            Attempt.find({ user_id: userId })
                .sort({ created_at: -1 })
                .limit(10)
                .populate('question_id', 'text') // Populate question text
                .lean(),

            // 6. Difficulty Breakdown
            Attempt.aggregate([
                { $match: { user_id: userObjectId } },
                {
                    $group: {
                        _id: { difficulty: '$difficulty', subject: '$subject' },
                        total: { $sum: 1 },
                        correct: { $sum: { $cond: ['$is_correct', 1, 0] } }
                    }
                }
            ]),

            // 7. Pattern Display Names
            Pattern.find({}, 'code name subject').lean()
        ]);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 4. Data Processing

        // Map patterns for easy lookup
        const patternMap = (patterns as any[]).reduce((acc, p) => {
            acc[p.code] = p.name;
            return acc;
        }, {} as Record<string, string>);

        // Process Topic Stats with Display Names
        const processedTopicStats = (topicStats as any[]).map(t => ({
            ...t,
            display_name: patternMap[t.pattern] || formatTopicName(t.pattern)
        }));

        // Process Recent Attempts with Display Names & Question Details (if populated in future)
        // We aren't populating questions here to save time, but we might need it for names if not using pattern
        const processedRecentAttempts = (recentAttempts as any[]).map(a => ({
            ...a,
            display_name: patternMap[a.pattern] || formatTopicName(a.pattern)
        }));

        // Process Difficulty Stats
        // { "EASY": { total: 10, correct: 8, accuracy: 0.8 }, ... }
        const processedDifficultyStats = (difficultyStats as any[]).reduce((acc, d) => {
            const diff = d._id.difficulty;
            if (!acc[diff]) {
                acc[diff] = { total: 0, correct: 0 };
            }
            acc[diff].total += d.total;
            acc[diff].correct += d.correct;
            return acc;
        }, {} as Record<string, { total: number, correct: number }>);

        // Add accuracy to difficulty stats
        Object.keys(processedDifficultyStats).forEach(key => {
            const stat = processedDifficultyStats[key];
            (stat as any).accuracy = stat.total > 0 ? stat.correct / stat.total : 0;
        });


        // 5. Response Construction
        return NextResponse.json({
            success: true,
            dashboard: {
                user,
                daily_progress: {
                    date: today,
                    questions_solved: todayActivity?.questions_solved || 0,
                    year_questions_solved: user.stats.total_solved, // Fallback/Total
                    quant_solved: todayActivity?.quant_solved || 0,
                    reasoning_solved: todayActivity?.reasoning_solved || 0,
                    daily_goal: user.preferences.daily_quant_goal + user.preferences.daily_reasoning_goal, // Combined goal? Or separate.
                    // The doc says "Daily Goal" implies a total. Let's sum them for now.
                    streak: user.stats.current_streak
                },
                heatmap, // Client will filter this based on tab
                topic_stats: processedTopicStats,
                recent_attempts: processedRecentAttempts,
                difficulty_stats: processedDifficultyStats,
                difficulty_stats_raw: difficultyStats // Pass raw array correctly
            }
        });

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

function formatTopicName(slug: string): string {
    return slug.split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}
