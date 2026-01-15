import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import Question from "@/core/models/Question";
import User from "@/core/models/User";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/user/progress
 * Returns user's progress including:
 * - Question IDs by status (solved correctly, solved wrongly, bookmarked)
 * - Stats by section and difficulty
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

        // Convert userId string to ObjectId for aggregation
        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

        // Get all user's attempts with question details (section + difficulty)
        const attempts = await Attempt.aggregate([
            { $match: { u_id: userObjectId } },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'q_id',
                    foreignField: '_id',
                    as: 'question'
                }
            },
            { $unwind: '$question' },
            // Only include verified questions
            { $match: { 'question.is_verified': true } },
            ...(section ? [{ $match: { 'question.source.section': section } }] : []),
            {
                $group: {
                    _id: '$q_id',
                    is_correct: { $last: '$is_correct' },
                    attempts_count: { $sum: 1 },
                    section: { $first: '$question.source.section' },
                    difficulty: { $first: '$question.difficulty' }
                }
            }
        ]);

        // Categorize questions by status and difficulty
        const solvedCorrect: string[] = [];
        const solvedWrong: string[] = [];
        const attempted: string[] = [];

        const difficultyBreakdown = {
            EASY: { solved: 0, wrong: 0 },
            MEDIUM: { solved: 0, wrong: 0 },
            HARD: { solved: 0, wrong: 0 }
        };

        for (const attempt of attempts) {
            const qId = attempt._id.toString();
            const difficulty = attempt.difficulty as 'EASY' | 'MEDIUM' | 'HARD';
            attempted.push(qId);

            if (attempt.is_correct) {
                solvedCorrect.push(qId);
                if (difficultyBreakdown[difficulty]) {
                    difficultyBreakdown[difficulty].solved += 1;
                }
            } else {
                solvedWrong.push(qId);
                if (difficultyBreakdown[difficulty]) {
                    difficultyBreakdown[difficulty].wrong += 1;
                }
            }
        }

        // Get total verified questions count by difficulty (for progress bars)
        const sectionFilter = section ? { 'source.section': section } : {};
        const totalQuestions = await Question.aggregate([
            { $match: { is_verified: true, ...sectionFilter } },
            {
                $group: {
                    _id: '$difficulty',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalsByDifficulty = {
            EASY: 0,
            MEDIUM: 0,
            HARD: 0,
            ALL: 0
        };

        for (const t of totalQuestions) {
            if (t._id && totalsByDifficulty.hasOwnProperty(t._id)) {
                totalsByDifficulty[t._id as 'EASY' | 'MEDIUM' | 'HARD'] = t.count;
                totalsByDifficulty.ALL += t.count;
            }
        }

        // Get user's bookmarks and heatmap
        const user = await User.findById(authUser.userId).select('bookmarks dash.heatmap').lean();
        const bookmarks = ((user as any)?.bookmarks || []).map((b: any) => b.toString());

        const currentMonth = new Date().toISOString().slice(0, 7);
        const activityDates = ((user as any)?.dash?.heatmap || [])
            .filter((h: any) => h.date.startsWith(currentMonth))
            .map((h: any) => h.date);

        // Calculate stats
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
                difficultyBreakdown,
                totalsByDifficulty,
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
