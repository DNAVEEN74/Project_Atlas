import Link from "next/link";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Session from "@/core/models/Session";
import Question from "@/core/models/Question";
import User from "@/core/models/User";
import DailyActivity from "@/core/models/DailyActivity";
import Attempt from "@/core/models/Attempt";
import Pattern from "@/core/models/Pattern";
import { getCurrentUser } from "@/lib/auth";

/**
 * POST /api/sessions - Create a new sprint/practice session
 */
export async function POST(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();
        const userId = authUser.userId;

        // Check for existing in-progress sessions and auto-abandon expired ones
        const existingSessions = await Session.find({
            user_id: new mongoose.Types.ObjectId(userId),
            status: 'IN_PROGRESS'
        });

        for (const existing of existingSessions) {
            const timeLimitMs = existing.config?.time_limit_ms;
            const startedAt = existing.started_at || existing.created_at;
            if (timeLimitMs && startedAt) {
                const elapsed = Date.now() - new Date(startedAt).getTime();
                if (elapsed > timeLimitMs) {
                    await Session.findByIdAndUpdate(existing._id, {
                        $set: { status: 'ABANDONED', completed_at: new Date() }
                    });
                }
            }
        }

        const body = await req.json();
        const {
            type = 'SPRINT',
            config
        } = body;

        // Config validation
        if (type !== 'QUICK_PRACTICE' && (!config || !config.subject || !config.question_count)) {
            return NextResponse.json(
                { error: "Invalid session configuration" },
                { status: 400 }
            );
        }

        let questionIds: mongoose.Types.ObjectId[] = [];
        let finalConfig = { ...config };

        if (type === 'QUICK_PRACTICE') {
            // Intelligent Question Selection
            const today = new Date().toISOString().split('T')[0];

            // 1. Calculate count needed
            const [user, dailyActivity] = await Promise.all([
                User.findById(userId).select('preferences').lean(),
                DailyActivity.findOne({ user_id: userId, date: today }).lean()
            ]);

            // Determine subject focus based on request or default to MIXED/User preference
            // For now, let's assume we want a mix if not specified, but the dashboard might pass a subject
            const subject = config?.subject || 'QUANT'; // Default to Quant for now if missing, or handle both.
            // Actually, Quick Practice often targets a specific needed area or mixed.
            // Let's support an optional subject in body, else try to balance.

            const dailyGoal = (user?.preferences?.daily_quant_goal || 5) + (user?.preferences?.daily_reasoning_goal || 5);
            const todaySolved = dailyActivity?.questions_solved || 0;
            let countNeeded = Math.max(5, dailyGoal - todaySolved);
            if (countNeeded > 20) countNeeded = 20; // Cap at 20 for a session

            // Override if client explicitly requested a count
            if (config?.question_count) {
                countNeeded = config.question_count;
            }

            finalConfig.question_count = countNeeded;
            finalConfig.subject = subject; // Force subject if derived
            finalConfig.difficulty = 'MIXED'; // Always mixed for quick practice
            finalConfig.patterns = []; // We determine these

            // 2. Find Weak Areas (< 60% accuracy)
            const topicStats = await Attempt.aggregate([
                { $match: { user_id: new mongoose.Types.ObjectId(userId), subject } },
                {
                    $group: {
                        _id: '$pattern',
                        total: { $sum: 1 },
                        correct: { $sum: { $cond: ['$is_correct', 1, 0] } }
                    }
                },
                {
                    $project: {
                        pattern: '$_id',
                        accuracy: { $divide: ['$correct', '$total'] },
                        total: 1
                    }
                },
                { $match: { accuracy: { $lt: 0.6 }, total: { $gte: 3 } } }
            ]);
            const weakPatterns = topicStats.map((t: any) => t.pattern);

            // 3. Find Stale Topics (Not practiced in 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const recentPatterns = await Attempt.distinct('pattern', {
                user_id: userId,
                subject,
                created_at: { $gte: sevenDaysAgo }
            });
            const allPatterns = await Pattern.find({ subject }).distinct('code');
            const stalePatterns = allPatterns.filter((p: any) => !recentPatterns.includes(p));

            // 4. Select Questions
            const weakCount = Math.floor(countNeeded * 0.5);
            const staleCount = Math.floor(countNeeded * 0.3);
            const randomCount = countNeeded - weakCount - staleCount;

            const [weakQs, staleQs, randomQs] = await Promise.all([
                // Weak
                weakPatterns.length > 0 ? Question.aggregate([
                    { $match: { is_live: true, subject, pattern: { $in: weakPatterns } } },
                    { $sample: { size: weakCount } },
                    { $project: { _id: 1 } }
                ]) : [],
                // Stale
                stalePatterns.length > 0 ? Question.aggregate([
                    { $match: { is_live: true, subject, pattern: { $in: stalePatterns } } },
                    { $sample: { size: staleCount } },
                    { $project: { _id: 1 } }
                ]) : [],
                // Random
                Question.aggregate([
                    { $match: { is_live: true, subject } },
                    { $sample: { size: randomCount + (weakPatterns.length === 0 ? weakCount : 0) + (stalePatterns.length === 0 ? staleCount : 0) } }, // Fallback if others empty
                    { $project: { _id: 1 } }
                ])
            ]);

            // Deduplicate IDs just in case
            const allIds = [...weakQs, ...staleQs, ...randomQs].map(q => q._id.toString());
            const uniqueIds = Array.from(new Set(allIds)).map(id => new mongoose.Types.ObjectId(id));

            // If we still don't have enough (e.g. no weak patterns), fill with random
            if (uniqueIds.length < countNeeded) {
                const remainder = countNeeded - uniqueIds.length;
                const extraQs = await Question.aggregate([
                    { $match: { is_live: true, subject, _id: { $nin: uniqueIds } } },
                    { $sample: { size: remainder } },
                    { $project: { _id: 1 } }
                ]);
                uniqueIds.push(...extraQs.map((q: any) => q._id));
            }

            questionIds = uniqueIds;
            finalConfig.patterns = [...new Set([...weakPatterns, ...stalePatterns])]; // Store what we targeted

        } else {
            // STANDARD SPRINT LOGIC
            // Fetch questions based on config
            const questionFilter: any = {
                is_live: true,
                subject: config.subject,
            };

            if (config.difficulty && config.difficulty !== 'MIXED') {
                questionFilter.difficulty = config.difficulty;
            }

            if (config.patterns && config.patterns.length > 0) {
                questionFilter.pattern = { $in: config.patterns };
            }

            // Randomly select questions
            // Note: For large collections, $sample is efficient.
            const questions = await Question.aggregate([
                { $match: questionFilter },
                { $sample: { size: config.question_count } },
                { $project: { _id: 1 } } // We only need IDs initially
            ]);

            questionIds = questions.map((q: any) => q._id);
        }

        if (questionIds.length === 0) {
            return NextResponse.json(
                { error: "No questions found matching criteria" },
                { status: 404 }
            );
        }

        // Create Session
        const session = await Session.create({
            user_id: new mongoose.Types.ObjectId(userId),
            type,
            config: {
                subject: finalConfig.subject,
                patterns: finalConfig.patterns || [],
                difficulty: finalConfig.difficulty || 'MIXED',
                question_count: finalConfig.question_count,
                time_limit_ms: finalConfig.time_limit_ms || 0
            },
            question_ids: questionIds,
            status: 'IN_PROGRESS',
            current_index: 0
        });

        // Fetch full question details to return to client (client stores in zustand)
        // We re-fetch to get them in a consistent Mongoose document format if needed, 
        // or just use the aggregation if we projected more fields. 
        // Let's populate.
        const populatedSession = await Session.findById(session._id).populate('question_ids');

        return NextResponse.json({
            success: true,
            session: populatedSession
        });

    } catch (error) {
        console.error("Create session error:", error);
        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/sessions/history - Get past sessions
 */
export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');

        const query: any = { user_id: authUser.userId };
        if (status) {
            query.status = status;
        }

        const sessions = await Session.find(query)
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit)
            .populate(status === 'IN_PROGRESS' ? 'question_ids' : '')
            .lean();

        // Auto-abandon expired in-progress sessions before returning
        const now = Date.now();
        const result = sessions.map((s: any) => {
            if (s.status === 'IN_PROGRESS' && s.config?.time_limit_ms) {
                const startedAt = s.started_at || s.created_at;
                const elapsed = now - new Date(startedAt).getTime();
                if (elapsed > s.config.time_limit_ms) {
                    // Mark as abandoned (async, fire-and-forget)
                    Session.findByIdAndUpdate(s._id, {
                        $set: { status: 'ABANDONED', completed_at: new Date() }
                    }).exec();
                    return { ...s, status: 'ABANDONED' };
                }
            }
            return s;
        });

        return NextResponse.json({
            data: result
        });
    } catch (error) {
        console.error("Get sessions error:", error);
        return NextResponse.json(
            { error: "Failed to get sessions" },
            { status: 500 }
        );
    }
}
