import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/attempts/history - Get user's attempts
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
        const subject = searchParams.get('subject');
        const pattern = searchParams.get('pattern');
        const difficulty = searchParams.get('difficulty');
        const status = searchParams.get('status'); // correct, wrong

        // Build Query
        const query: any = { user_id: authUser.userId };

        if (subject && subject !== 'all') {
            query.subject = subject;
        }

        if (pattern && pattern !== 'all') {
            query.pattern = pattern;
        }

        if (difficulty && difficulty !== 'all') {
            query.difficulty = difficulty;
        }

        if (status) {
            if (status === 'correct') {
                query.is_correct = true;
            } else if (status === 'wrong') {
                query.is_correct = false;
            }
        }

        const [attempts, total] = await Promise.all([
            Attempt.find(query)
                .sort({ created_at: -1 })
                .skip(offset)
                .limit(limit)
                .populate('question_id', 'text difficulty source subject pattern')
                .lean(),
            Attempt.countDocuments(query)
        ]);

        return NextResponse.json({
            data: attempts.map((a: any) => ({
                id: a._id,
                questionId: a.question_id?._id,
                questionTitle: a.question_id?.text || 'Unknown Question',
                difficulty: a.difficulty,
                isCorrect: a.is_correct,
                optionSelected: a.selected_option,
                timeMs: a.time_ms,
                createdAt: a.created_at,
                subject: a.subject,
                pattern: a.pattern
            })),
            pagination: {
                total,
                page: Math.floor(offset / limit) + 1,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get attempts history error:", error);
        return NextResponse.json(
            { error: "Failed to get attempts" },
            { status: 500 }
        );
    }
}
