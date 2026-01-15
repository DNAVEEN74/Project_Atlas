import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import Question from "@/core/models/Question";
import User from "@/core/models/User";
import { getCurrentUser } from "@/lib/auth";

/**
 * POST /api/attempts - Record a new attempt
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

        const body = await req.json();
        const { questionId, optionSelected, timeMs } = body;

        if (!questionId || !optionSelected) {
            return NextResponse.json(
                { error: "questionId and optionSelected are required" },
                { status: 400 }
            );
        }

        // Get question to check correct answer
        const question = await Question.findById(questionId).lean();
        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        const is_correct = (question as any).content.correct_option_id === optionSelected;

        // Convert userId to ObjectId for MongoDB queries
        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

        // IMPORTANT: Check if question was already solved BEFORE creating the new attempt
        // This prevents the bug where the newly created attempt is found by the query
        const alreadySolvedCorrectly = await Attempt.exists({
            u_id: userObjectId,
            q_id: questionId,
            is_correct: true,
        });

        // Use upsert to update existing attempt or create new one
        const attempt = await Attempt.findOneAndUpdate(
            {
                u_id: userObjectId,
                q_id: questionId,
            },
            {
                u_id: userObjectId,
                q_id: questionId,
                p_id: (question as any).p_id || null,
                is_correct,
                t_ms: timeMs || 0,
                option_selected: optionSelected,
            },
            {
                new: true,
                upsert: true,
            }
        );

        // Update user dashboard stats
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const user = await User.findById(authUser.userId);
        if (user) {
            // "Total Solved" = Unique questions solved correctly (LeetCode style)
            // Only increment if:
            // 1. This attempt is correct AND
            // 2. User has never solved this question correctly before
            if (is_correct && !alreadySolvedCorrectly) {
                user.dash.total_solved += 1;
                user.dash.total_correct += 1;
            }
            // Note: If user solved it wrong before and now correct -> increment (first correct solve)
            // If user solved it correct before and now correct again -> no increment (already counted)

            user.dash.last_active = new Date();

            // Update heatmap (tracks all submissions for activity visualization)
            const existingDayIndex = user.dash.heatmap.findIndex(h => h.date === today);
            const hadActivityToday = existingDayIndex >= 0;

            if (hadActivityToday) {
                user.dash.heatmap[existingDayIndex].count += 1;
                const count = user.dash.heatmap[existingDayIndex].count;
                // Intensity levels: 1-2: 1, 3-5: 2, 6-10: 3, 11+: 4
                user.dash.heatmap[existingDayIndex].intensity =
                    count >= 10 ? 4 : count >= 5 ? 3 : count >= 3 ? 2 : 1;
            } else {
                user.dash.heatmap.push({
                    date: today,
                    count: 1,
                    intensity: 1,
                });
            }

            // Update streak (only on first activity of the day)
            if (!hadActivityToday) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                const hadActivityYesterday = user.dash.heatmap.some(h => h.date === yesterdayStr);

                if (hadActivityYesterday) {
                    // Continue streak
                    user.dash.streak += 1;
                } else {
                    // Check if streak was broken (more than 1 day gap)
                    // Reset to 1 for starting a new streak today
                    user.dash.streak = 1;
                }
            }
            // If already had activity today, streak is already correct

            await user.save();
        }

        return NextResponse.json({
            success: true,
            attempt: {
                id: attempt._id,
                is_correct,
                correct_option: (question as any).content.correct_option_id,
            },
        });
    } catch (error) {
        console.error("Create attempt error:", error);
        return NextResponse.json(
            { error: "Failed to record attempt" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/attempts - Get user's attempts (with optional filters)
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
        const questionId = searchParams.get('questionId');
        const limit = parseInt(searchParams.get('limit') || '50');

        const query: any = { u_id: authUser.userId };
        if (questionId) {
            query.q_id = questionId;
        }

        const attempts = await Attempt.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('q_id', 'content.text difficulty source') // Populate question details
            .lean();

        return NextResponse.json({
            data: attempts.map((a: any) => ({
                id: a._id,
                questionId: a.q_id?._id,
                questionTitle: a.q_id?.content?.text || 'Unknown Question',
                difficulty: a.q_id?.difficulty,
                isCorrect: a.is_correct,
                optionSelected: a.option_selected,
                timeMs: a.t_ms,
                createdAt: a.createdAt,
            })),
        });
    } catch (error) {
        console.error("Get attempts error:", error);
        return NextResponse.json(
            { error: "Failed to get attempts" },
            { status: 500 }
        );
    }
}
