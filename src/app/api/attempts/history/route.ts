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
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const attempts = await Attempt.find({ user_id: authUser.userId })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(limit)
            .populate('question_id', 'text difficulty source content.text') // Populate question details
            .lean();

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
        });
    } catch (error) {
        console.error("Get attempts history error:", error);
        return NextResponse.json(
            { error: "Failed to get attempts" },
            { status: 500 }
        );
    }
}
