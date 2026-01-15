import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import User from "@/core/models/User";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/user/progress
 * Returns user's progress including:
 * - Question IDs by status (solved correctly, solved wrongly, bookmarked)
 * - Stats by section
 * - Overall progress
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
        const section = searchParams.get('section'); // Optional: QUANT or REASONING

        // Get all user's attempts with question sections
        const attempts = await Attempt.aggregate([
            { $match: { u_id: authUser.userId } },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'q_id',
                    foreignField: '_id',
                    as: 'question'
                }
            },
            { $unwind: '$question' },
            ...(section ? [{ $match: { 'question.source.section': section } }] : []),
            {
                $group: {
                    _id: '$q_id',
                    is_correct: { $last: '$is_correct' }, // Last attempt result
                    attempts_count: { $sum: 1 },
                    section: { $first: '$question.source.section' }
                }
            }
        ]);

        // Categorize questions
        const solvedCorrect: string[] = [];
        const solvedWrong: string[] = [];
        const attempted: string[] = [];

        for (const attempt of attempts) {
            const qId = attempt._id.toString();
            attempted.push(qId);
            if (attempt.is_correct) {
                solvedCorrect.push(qId);
            } else {
                solvedWrong.push(qId);
            }
        }

        // Get user's bookmarks and heatmap for calendar
        const user = await User.findById(authUser.userId).select('bookmarks dash.heatmap').lean();
        const bookmarks = ((user as any)?.bookmarks || []).map((b: any) => b.toString());

        // Extract activity dates for current month
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const activityDates = ((user as any)?.dash?.heatmap || [])
            .filter((h: any) => h.date.startsWith(currentMonth))
            .map((h: any) => h.date);

        // Calculate section-wise stats
        const stats = {
            totalAttempted: attempted.length,
            totalCorrect: solvedCorrect.length,
            totalWrong: solvedWrong.length,
            accuracy: attempted.length > 0
                ? Math.round((solvedCorrect.length / attempted.length) * 100)
                : 0,
            bookmarkedCount: bookmarks.length,
        };

        return NextResponse.json({
            data: {
                solvedCorrect,
                solvedWrong,
                bookmarks,
                activityDates,
                stats,
            },
        });
    } catch (error) {
        console.error("Get progress error:", error);
        return NextResponse.json(
            { error: "Failed to get progress" },
            { status: 500 }
        );
    }
}
