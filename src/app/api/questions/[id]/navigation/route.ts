import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Question from "@/core/models/Question";

/**
 * GET /api/questions/[id]/navigation
 * Returns the previous and next question IDs for navigation
 * Supports section filtering (QUANT, REASONING)
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const section = searchParams.get('section') || null;

        // Get the current question to find its position
        const currentQuestion = await Question.findById(id).lean();
        if (!currentQuestion) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Build base query for section filtering
        const baseQuery: any = { is_verified: true };
        if (section) {
            baseQuery['source.section'] = section;
        }

        // Find previous question (created before current, sorted descending)
        const prevQuestion = await Question.findOne({
            ...baseQuery,
            _id: { $lt: id }
        })
            .sort({ _id: -1 })
            .select('_id')
            .lean();

        // Find next question (created after current, sorted ascending)
        const nextQuestion = await Question.findOne({
            ...baseQuery,
            _id: { $gt: id }
        })
            .sort({ _id: 1 })
            .select('_id')
            .lean();

        // Get total count for progress display
        const totalCount = await Question.countDocuments(baseQuery);

        // Get current position (count of questions before this one + 1)
        const currentPosition = await Question.countDocuments({
            ...baseQuery,
            _id: { $lte: id }
        });

        return NextResponse.json({
            data: {
                prevId: prevQuestion ? (prevQuestion as any)._id.toString() : null,
                nextId: nextQuestion ? (nextQuestion as any)._id.toString() : null,
                currentPosition,
                totalCount,
                section: section || 'ALL'
            }
        });
    } catch (error) {
        console.error("Error fetching navigation:", error);
        return NextResponse.json(
            { error: "Failed to fetch navigation" },
            { status: 500 }
        );
    }
}
