import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import Question from "@/core/models/Question";
import User from "@/core/models/User";
import DailyActivity from "@/core/models/DailyActivity";
import Session from "@/core/models/Session";
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
        const { questionId, optionSelected, timeMs, sessionId } = body;

        if (!questionId || !optionSelected) {
            return NextResponse.json(
                { error: "questionId and optionSelected are required" },
                { status: 400 }
            );
        }

        // Get question to check correct answer and get denormalized data
        const question = await Question.findById(questionId).lean();
        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        const is_correct = (question as any).correct_option === optionSelected;
        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

        // Create the Attempt record
        const attempt = await Attempt.create({
            user_id: userObjectId,
            question_id: questionId,
            session_id: sessionId || null,
            selected_option: optionSelected,
            is_correct,
            time_ms: timeMs || 0,
            subject: (question as any).subject,
            pattern: (question as any).pattern,
            difficulty: (question as any).difficulty,
        });

        // Update Session if applicable
        if (sessionId) {
            await Session.findByIdAndUpdate(sessionId, {
                $push: { attempt_ids: attempt._id },
                $inc: {
                    correct_count: is_correct ? 1 : 0,
                    total_time_ms: timeMs || 0
                }
            });
        }

        // Update DailyActivity
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        await DailyActivity.findOneAndUpdate(
            { user_id: userObjectId, date: today },
            {
                $inc: {
                    questions_solved: 1,
                    questions_correct: is_correct ? 1 : 0,
                    time_spent_ms: timeMs || 0,
                    quant_solved: (question as any).subject === 'QUANT' && is_correct ? 1 : 0,
                    reasoning_solved: (question as any).subject === 'REASONING' && is_correct ? 1 : 0,
                },
                $setOnInsert: {
                    games_played: 0,
                    sessions_completed: 0
                }
            },
            { upsert: true, new: true }
        );

        // Update User stats (User.stats)
        const alreadySolved = await Attempt.exists({
            user_id: userObjectId,
            question_id: questionId,
            is_correct: true,
            _id: { $ne: attempt._id } // exclude current
        });

        const userUpdate: any = {
            $set: { 'stats.last_active_date': today }
        };

        if (is_correct && !alreadySolved) {
            userUpdate.$inc = {
                'stats.total_solved': 1,
                'stats.total_correct': 1
            };
        } else if (is_correct) {
            userUpdate.$inc = {
                'stats.total_correct': 1
            };
        }

        // Streak logic
        const user = await User.findById(authUser.userId);
        if (user) {
            const lastDate = user.stats?.last_active_date;

            if (lastDate !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastDate === yesterdayStr) {
                    userUpdate.$inc = {
                        ...(userUpdate.$inc || {}),
                        'stats.current_streak': 1
                    };
                } else {
                    userUpdate.$set['stats.current_streak'] = 1;
                }
            }
        }

        await User.findByIdAndUpdate(authUser.userId, userUpdate);

        return NextResponse.json({
            success: true,
            attempt: {
                id: attempt._id,
                is_correct,
                correct_option: (question as any).correct_option,
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
