import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Session from "@/core/models/Session";
import Question from "@/core/models/Question";
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

        // Check for existing in-progress sessions and auto-abandon expired ones
        const existingSessions = await Session.find({
            user_id: new mongoose.Types.ObjectId(authUser.userId),
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
        if (!config || !config.subject || !config.question_count) {
            return NextResponse.json(
                { error: "Invalid session configuration" },
                { status: 400 }
            );
        }

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

        const questionIds = questions.map(q => q._id);

        if (questionIds.length === 0) {
            return NextResponse.json(
                { error: "No questions found matching criteria" },
                { status: 404 }
            );
        }

        // Create Session
        const session = await Session.create({
            user_id: new mongoose.Types.ObjectId(authUser.userId),
            type,
            config: {
                subject: config.subject,
                patterns: config.patterns || [],
                difficulty: config.difficulty || 'MIXED',
                question_count: config.question_count,
                time_limit_ms: config.time_limit_ms || 0
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
