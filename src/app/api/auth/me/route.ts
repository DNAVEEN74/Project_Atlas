import { NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import User from "@/core/models/User";
import { getCurrentUser } from "@/lib/auth";
import { validateUserStreak } from "@/lib/streak";

export async function GET() {
    try {
        const authUser = await getCurrentUser();

        if (!authUser) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        await dbConnect();

        const user = await User.findById(authUser.userId);

        if (user) {
            // Validate streak on every profile fetch
            const streakUpdated = validateUserStreak(user);
            if (streakUpdated) {
                await user.save();
            }
        }

        // Convert to plain object for response
        const userLean = user ? user.toObject() : null;

        if (!userLean) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: (userLean as any)._id,
                email: (userLean as any).email,
                name: (userLean as any).profile?.name,
                targetExam: (userLean as any).target?.exam,
                targetYear: (userLean as any).target?.year,
                totalSolved: (userLean as any).dash?.total_solved || 0,
                totalCorrect: (userLean as any).dash?.total_correct || 0,
                streak: (userLean as any).dash?.streak || 0,
                maxStreak: (userLean as any).dash?.max_streak || 0,
                lastActive: (userLean as any).dash?.last_active,
                bookmarks: (userLean as any).bookmarks || [],
                heatmap: (userLean as any).dash?.heatmap || [],
                avatar_url: (userLean as any).profile?.avatar_url,
                dailyQuantGoal: (userLean as any).preferences?.daily_quant_goal || 5,
                dailyReasoningGoal: (userLean as any).preferences?.daily_reasoning_goal || 5,
            },
        });
    } catch (error) {
        console.error("Get user error:", error);
        return NextResponse.json(
            { error: "Failed to get user" },
            { status: 500 }
        );
    }
}
