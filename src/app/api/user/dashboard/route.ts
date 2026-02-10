import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import User from "@/core/models/User";
import DailyActivity from "@/core/models/DailyActivity";
import Attempt from "@/core/models/Attempt";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/user/dashboard
 * Single call: stats + heatmap + recent + topic accuracy
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
        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

        // 1. Fetch User Stats (basic totals) AND Profile
        const user = await User.findById(userObjectId).lean();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 2. Fetch Heatmap (Last 365 days of DailyActivity)
        const oneYearAgo = new Date();
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);
        const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];

        const activities = await DailyActivity.find({
            user_id: userObjectId,
            date: { $gte: oneYearAgoStr }
        }).sort({ date: 1 }).lean();

        // 3. Recent Activity (Last 5 attempts)
        const recentAttempts = await Attempt.find({ user_id: userObjectId })
            .sort({ created_at: -1 })
            .limit(5)
            .populate('question_id', 'text difficulty')
            .lean();

        // 4. Topic Accuracy (Aggregation)
        const topicStats = await Attempt.aggregate([
            { $match: { user_id: userObjectId } },
            {
                $group: {
                    _id: "$pattern",
                    total: { $sum: 1 },
                    correct: { $sum: { $cond: ["$is_correct", 1, 0] } }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 5 } // Top 5 active topics
        ]);

        return NextResponse.json({
            user: {
                name: (user as any).profile.name,
                username: (user as any).profile.username,
                avatar_url: (user as any).profile.avatar_url,
                stats: (user as any).stats,
                preferences: (user as any).preferences
            },
            heatmap: activities.map((a: any) => ({
                date: a.date,
                count: a.questions_solved + a.games_played // Intensity metric
            })),
            recentActivity: recentAttempts.map((a: any) => ({
                id: a._id,
                type: 'ATTEMPT', // could be 'SESSION' or 'GAME' in a unified feed
                title: a.question_id?.text?.substring(0, 50) + "...",
                isCorrect: a.is_correct,
                date: a.created_at
            })),
            topicStats: topicStats.map((t: any) => ({
                pattern: t._id,
                accuracy: Math.round((t.correct / t.total) * 100),
                count: t.total
            }))
        });

    } catch (error) {
        console.error("Get dashboard error:", error);
        return NextResponse.json(
            { error: "Failed to get dashboard data" },
            { status: 500 }
        );
    }
}
