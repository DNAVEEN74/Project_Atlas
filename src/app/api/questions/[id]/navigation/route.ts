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
        const difficulty = searchParams.get('difficulty') || null;
        const year = searchParams.get('year') || null;
        const query = searchParams.get('query') || null;

        // Determine if input is a question number (numeric)
        const isNumericId = /^\d+$/.test(id);
        let currentQuestion;

        if (isNumericId) {
            currentQuestion = await Question.findOne({ question_number: parseInt(id) }).lean();
        } else {
            // Fallback to ID lookup
            try {
                currentQuestion = await Question.findById(id).lean();
            } catch {
                // Invalid ObjectId format
                return NextResponse.json({ error: "Invalid Question ID" }, { status: 400 });
            }
        }

        if (!currentQuestion) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Build base query for filtered navigation
        const baseQuery: any = { is_live: true };
        if (section) {
            baseQuery.subject = section;
        }
        if (pattern) {
            baseQuery.pattern = pattern;
        }
        if (difficulty) {
            baseQuery.difficulty = difficulty;
        }
        if (year) {
            baseQuery['source.year'] = parseInt(year);
        }
        if (query) {
            baseQuery.text = { $regex: query, $options: 'i' };
        }

        // Use question_number for ordering if available
        const useQuestionNumber = (currentQuestion as any).question_number != null;
        const currentQNum = (currentQuestion as any).question_number;
        const currentId = (currentQuestion as any)._id;

        let prevQuestion, nextQuestion, totalCount, currentPosition;

        if (useQuestionNumber) {
            // Logic for Question Number based navigation
            prevQuestion = await Question.findOne({
                ...baseQuery,
                question_number: { $lt: currentQNum }
            })
                .sort({ question_number: -1 })
                .select('_id question_number')
                .lean();

            nextQuestion = await Question.findOne({
                ...baseQuery,
                question_number: { $gt: currentQNum }
            })
                .sort({ question_number: 1 })
                .select('_id question_number')
                .lean();

            totalCount = await Question.countDocuments(baseQuery);
            currentPosition = await Question.countDocuments({
                ...baseQuery,
                question_number: { $lte: currentQNum }
            });
        } else {
            // Fallback: _id-based ordering
            prevQuestion = await Question.findOne({
                ...baseQuery,
                _id: { $lt: currentId }
            })
                .sort({ _id: -1 })
                .select('_id question_number')
                .lean();

            nextQuestion = await Question.findOne({
                ...baseQuery,
                _id: { $gt: currentId }
            })
                .sort({ _id: 1 })
                .select('_id question_number')
                .lean();

            totalCount = await Question.countDocuments(baseQuery);
            currentPosition = await Question.countDocuments({
                ...baseQuery,
                _id: { $lte: currentId }
            });
        }

        // helper to get the best ID to return
        const getReturnId = (q: any) => {
            if (!q) return null;
            return q.question_number != null ? q.question_number.toString() : q._id.toString();
        };

        return NextResponse.json({
            data: {
                prevId: getReturnId(prevQuestion),
                nextId: getReturnId(nextQuestion),
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
