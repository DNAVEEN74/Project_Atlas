import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import GameScore from "@/core/models/GameScore";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/games/stats - History + best scores per game
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

        // 1. Get recent history
        const recentFn = GameScore.find({ user_id: authUser.userId })
            .sort({ created_at: -1 })
            .limit(10)
            .lean();

        // 2. Get best scores per game
        const bestFn = GameScore.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(authUser.userId) } },
            { $sort: { score: -1 } },
            {
                $group: {
                    _id: "$game_id",
                    bestScore: { $first: "$score" },
                    bestDate: { $first: "$created_at" },
                    totalPlayed: { $sum: 1 }
                }
            }
        ]);

        const [recent, best] = await Promise.all([recentFn, bestFn]);

        return NextResponse.json({
            recent: recent.map((r: any) => ({
                id: r._id,
                gameId: r.game_id,
                score: r.score,
                date: r.created_at,
                difficulty: r.difficulty
            })),
            best: best.map((b: any) => ({
                gameId: b._id,
                highScore: b.bestScore,
                date: b.bestDate,
                totalPlayed: b.totalPlayed
            }))
        });

    } catch (error) {
        console.error("Get game stats error:", error);
        return NextResponse.json(
            { error: "Failed to get game stats" },
            { status: 500 }
        );
    }
}
