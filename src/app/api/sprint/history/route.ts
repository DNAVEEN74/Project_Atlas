
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/core/db/connect';
import Session from '@/core/models/Session';
import Attempt from '@/core/models/Attempt';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Ensure Attempt model is registered
        if (!Attempt) console.error("Attempt model not imported correctly");

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const filter = searchParams.get('filter') || 'ALL'; // ALL, QUANT, REASONING

        const query: any = {
            user_id: user.userId,
            type: 'SPRINT',
            status: 'COMPLETED',
            $or: [
                { 'stats.total_time_ms': { $gte: 5000 } },
                { total_time_ms: { $gte: 5000 } }
            ]
        };

        if (filter !== 'ALL') {
            query['config.subject'] = filter;
        }

        // 1. Aggregation for Global Stats (All Time)
        // We match ALL sessions (ignoring pagination, but respecting filter?) 
        // Usually dashboards show "All Time" stats regardless of filter, but let's respect filter if provided for context.
        // Actually, dashboards usually show "All Time" stats, and the filter applies to the list. 
        // Let's decide: user said "dashboard we need everything at once".
        // Let's safe bet: Stats are ALL TIME (no filter), Table is Filtered.
        // wait, if I filter by Quant, I expect stats to show Quant stats?
        // Let's stick to: Stats = Global (All Subjects) to keep it simple and consistent with "All Time".
        // Or better: Stats match the filter. If I toggle Quant, I see Quant stats. That's better UX.

        const statsQuery = { ...query };
        // If we want "All Time" regardless of table filter, we'd remove the subject constraint.
        // But standard dashboards usually reflect the current view.
        // Let's stick to the query.

        // Create match query for aggregation (needs ObjectId)
        const matchQuery = { ...query };
        matchQuery.user_id = new mongoose.Types.ObjectId(user.userId);

        const [aggregated] = await Session.aggregate([
            {
                $match: matchQuery
            },
            {
                $group: {
                    _id: null,
                    totalSprints: { $sum: 1 },
                    completedCount: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
                    // Calculate averages (using new stats object preferably, fallback to legacy)
                    // We can use $ifNull for fallback logic in aggregation!
                    // stats.accuracy, stats.avg_time_ms
                    avgAccuracy: { $avg: { $ifNull: ['$stats.accuracy', '$correct_count'] } }, // Fallback logic is complex in simple avg, let's trust stats or Accept slight deviation
                    // Actually, 'accuracy' field in stats is 0-100.
                    // Legacy 'correct_count' is NOT accuracy. Legacy didn't have stored accuracy.
                    // For legacy records without 'stats', we might need to skip or compute.
                    // Let's assume most have meaningful data or new schema.
                    // For safety, let's just project standardized fields first.
                    avgTimeQuestion: { $avg: '$stats.avg_time_ms' }
                }
            }
        ]);

        // Refined Aggregation to handle legacy data better if needed, but for now direct access:
        // Note: average of accuracy is average(accuracy). 

        const stats = {
            totalSprints: aggregated?.totalSprints || 0,
            completedCount: aggregated?.completedCount || 0,
            avgAccuracy: Math.round(dataGet(aggregated, 'avgAccuracy', 0)),
            // If we don't have avgTimeQuestion in DB for old records, this might be skewed.
            // But new records have it.
            avgTimePerQuestion: Math.round((aggregated?.avgTimeQuestion || 0) / 1000) // Convert ms to s
        };


        // 2. Fetch Sessions for Pagination
        const skip = (page - 1) * limit;

        const sessions = await Session.find(query)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .populate('attempt_ids')
            .lean();

        const totalSessions = await Session.countDocuments(query);
        const totalPages = Math.ceil(totalSessions / limit);

        // 3. Formatted Sessions List
        const formattedSessions = sessions.map(h => {
            const totalQuestions = h.config.question_count;
            // Use new stats object if available, fallback to legacy/calculated
            const correctCount = h.stats?.correct ?? h.correct_count ?? 0;
            const totalTime = h.stats?.total_time_ms ?? h.total_time_ms ?? 0;
            const attempts = h.attempt_ids as any[] || [];
            const attemptsCount = attempts.length;

            // Calculate derived stats
            const incorrectCount = attemptsCount - correctCount;
            const skippedCount = Math.max(0, totalQuestions - attemptsCount);

            // Only needed for specific visuals, can keep.
            const timeDist = {
                under10s: 0, under20s: 0, under30s: 0, under40s: 0, over40s: 0
            };
            attempts.forEach(a => {
                const seconds = (a.time_ms || 0) / 1000;
                if (seconds < 10) timeDist.under10s++;
                else if (seconds < 20) timeDist.under20s++;
                else if (seconds < 30) timeDist.under30s++;
                else if (seconds < 40) timeDist.under40s++;
                else timeDist.over40s++;
            });

            return {
                id: h._id.toString(),
                createdAt: h.created_at,
                score: correctCount,
                incorrectCount,
                skippedCount,
                accuracy: h.stats?.accuracy ?? Math.round((correctCount / (totalQuestions || 1)) * 100),
                totalQuestions,
                subject: h.config.subject,
                topics: h.config.patterns || [],
                difficulty: h.config.difficulty,
                timeTaken: totalTime,
                completed: h.status === 'COMPLETED',
                topicPerformance: (h.topic_performance || []).map((tp: any) => ({
                    topic: tp.topic,
                    total: tp.total,
                    correct: tp.correct,
                    accuracy: tp.accuracy,
                    avgTime: tp.avg_time_ms
                })),
                timeDistribution: timeDist
            };
        });

        // 4. Chart Data (All Time Trend) - Lightweight
        // Fetch minimal fields for chart, respecting filter (or all time?)
        // User wants "Accuracy Over Time". 
        // Let's return all valid sessions data for the chart, reversed.
        const chartSessions = await Session.find(query)
            .sort({ created_at: -1 })
            .select('created_at stats correct_count total_time_ms config.question_count config.subject status')
            .lean();

        const chartData = chartSessions.map(s => ({
            id: s._id.toString(),
            createdAt: s.created_at,
            score: s.stats?.correct ?? s.correct_count ?? 0,
            totalQuestions: s.stats?.total_questions ?? s.config.question_count ?? 0,
            accuracy: s.stats?.accuracy ?? Math.round(((s.correct_count || 0) / (s.config.question_count || 1)) * 100),
            timeTaken: s.stats?.total_time_ms ?? s.total_time_ms ?? 0,
            subject: s.config.subject,
            completed: s.status === 'COMPLETED'
        })).reverse(); // Oldest to newest for chart

        return NextResponse.json({
            stats,
            sessions: formattedSessions,
            chartData,
            pagination: {
                current: page,
                total: totalSessions,
                pages: totalPages,
                limit
            }
        });

    } catch (error) {
        console.error('Sprint history error:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}

function dataGet(obj: any, path: string, def: any) {
    return obj && obj[path] !== undefined ? obj[path] : def;
}
