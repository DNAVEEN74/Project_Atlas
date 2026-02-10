import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import GameScore from "@/core/models/GameScore";
import DailyActivity from "@/core/models/DailyActivity";
import { getCurrentUser } from "@/lib/auth";

/**
 * POST /api/games/score - Save game result
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

        const body = await req.json();
        const {
            gameId,
            score,
            totalQuestions,
            correctAnswers,
            timeSeconds,
            difficulty
        } = body;

        if (!gameId || score === undefined) {
            return NextResponse.json(
                { error: "Invalid game data" },
                { status: 400 }
            );
        }

        await dbConnect();
        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

        // Save Score
        const gameScore = await GameScore.create({
            user_id: userObjectId,
            game_id: gameId,
            score,
            total_questions: totalQuestions || 0,
            correct_answers: correctAnswers || 0,
            time_seconds: timeSeconds || 0,
            difficulty: difficulty || 'MEDIUM'
        });

        // Update DailyActivity
        const today = new Date().toISOString().split('T')[0];

        await DailyActivity.findOneAndUpdate(
            { user_id: userObjectId, date: today },
            {
                $inc: {
                    games_played: 1,
                    // Optionally track time spent in games if desired, but schema has `time_spent_ms` usually for questions?
                    // Let's add it if we want total app time.
                    time_spent_ms: (timeSeconds || 0) * 1000
                },
                $setOnInsert: {
                    questions_solved: 0,
                    questions_correct: 0,
                    sessions_completed: 0
                }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            id: gameScore._id
        });

    } catch (error) {
        console.error("Save game score error:", error);
        return NextResponse.json(
            { error: "Failed to save score" },
            { status: 500 }
        );
    }
}
