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

        // Server-side timer validation for sprint sessions
        if (sessionId) {
            const session = await Session.findById(sessionId).lean();
            if (session) {
                if ((session as any).status !== 'IN_PROGRESS') {
                    return NextResponse.json(
                        { error: "Session is no longer active" },
                        { status: 400 }
                    );
                }
                const timeLimitMs = (session as any).config?.time_limit_ms;
                const startedAt = (session as any).started_at || (session as any).created_at;
                if (timeLimitMs && startedAt) {
                    const elapsed = Date.now() - new Date(startedAt).getTime();
                    // Allow 5s grace period for network latency
                    if (elapsed > timeLimitMs + 5000) {
                        // Auto-abandon the expired session
                        await Session.findByIdAndUpdate(sessionId, {
                            $set: { status: 'ABANDONED', completed_at: new Date() }
                        });
                        return NextResponse.json(
                            { error: "Session time has expired" },
                            { status: 400 }
                        );
                    }
                }
            }
        }

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
        // Use local date instead of UTC to avoid timezone issues
        const now = new Date();
        const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000))
            .toISOString()
            .split('T')[0]; // YYYY-MM-DD in local timezone

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
                // Calculate yesterday in local timezone
                const yesterdayDate = new Date();
                yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                const yesterdayStr = new Date(yesterdayDate.getTime() - (yesterdayDate.getTimezoneOffset() * 60000))
                    .toISOString()
                    .split('T')[0];

                if (lastDate === yesterdayStr) {
                    // Continue streak - last activity was yesterday
                    userUpdate.$inc = {
                        ...(userUpdate.$inc || {}),
                        'stats.current_streak': 1
                    };
                    // Update max streak if current becomes greater
                    const newStreak = (user.stats?.current_streak || 0) + 1;
                    if (newStreak > (user.stats?.max_streak || 0)) {
                        userUpdate.$set['stats.max_streak'] = newStreak;
                    }
                } else {
                    // Streak broken - reset to 1
                    userUpdate.$set['stats.current_streak'] = 1;
                }
            }
            // If lastDate === today, don't update streak (already counted for today)
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
