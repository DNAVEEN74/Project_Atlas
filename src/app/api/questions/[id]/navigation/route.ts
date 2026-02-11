import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Question from "@/core/models/Question";

/**
 * GET /api/questions/[id]/navigation
 * Returns the previous and next question IDs for navigation
 * Supports section filtering (QUANT, REASONING) and pattern filtering
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
        const pattern = searchParams.get('pattern') || null;

        // Get the current question to find its position
        const currentQuestion = await Question.findById(id).lean();
        if (!currentQuestion) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Build base query for section + pattern filtering
        const baseQuery: any = { is_live: true };
        if (section) {
            baseQuery.subject = section;
        }
        if (pattern) {
            baseQuery.pattern = pattern;
        }

        // If pattern-based navigation is requested and question_number exists,
        // use question_number ordering for deterministic navigation within a pattern
        const useQuestionNumber = pattern && (currentQuestion as any).question_number != null;

        let prevQuestion, nextQuestion, totalCount, currentPosition;

        if (useQuestionNumber) {
            const qNum = (currentQuestion as any).question_number;

            prevQuestion = await Question.findOne({
                ...baseQuery,
                question_number: { $lt: qNum }
            })
                .sort({ question_number: -1 })
                .select('_id')
                .lean();

            nextQuestion = await Question.findOne({
                ...baseQuery,
                question_number: { $gt: qNum }
            })
                .sort({ question_number: 1 })
                .select('_id')
                .lean();

            totalCount = await Question.countDocuments(baseQuery);
            currentPosition = await Question.countDocuments({
                ...baseQuery,
                question_number: { $lte: qNum }
            });
        } else {
            // Fallback: _id-based ordering
            prevQuestion = await Question.findOne({
                ...baseQuery,
                _id: { $lt: id }
            })
                .sort({ _id: -1 })
                .select('_id')
                .lean();

            nextQuestion = await Question.findOne({
                ...baseQuery,
                _id: { $gt: id }
            })
                .sort({ _id: 1 })
                .select('_id')
                .lean();

            totalCount = await Question.countDocuments(baseQuery);
            currentPosition = await Question.countDocuments({
                ...baseQuery,
                _id: { $lte: id }
            });
        }

        return NextResponse.json({
            data: {
                prevId: prevQuestion ? (prevQuestion as any)._id.toString() : null,
                nextId: nextQuestion ? (nextQuestion as any)._id.toString() : null,
                currentPosition,
                totalCount,
                section: section || 'ALL',
                pattern: pattern || null
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
