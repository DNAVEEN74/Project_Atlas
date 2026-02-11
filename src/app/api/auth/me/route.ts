import { NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import User from "@/core/models/User";
import { getCurrentUser } from "@/lib/auth";
import { validateUserStreak } from "@/lib/streak";

import DailyActivity from "@/core/models/DailyActivity";

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

        // Fetch last 365 days of activity for heatmap
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const dateString = oneYearAgo.toISOString().split('T')[0];

        const dailyActivities = await DailyActivity.find({
            user_id: authUser.userId,
            date: { $gte: dateString }
        }).sort({ date: 1 }).lean();


        if (user) {
            let userModified = false;

            // Validate streak on every profile fetch
            const streakUpdated = validateUserStreak(user);
            if (streakUpdated) userModified = true;

            // Backfill username if missing (Lazy Migration)
            if (!user.profile?.username) {
                const baseUsername = user.email.split('@')[0];
                const uniqueSuffix = Math.floor(Math.random() * 10000);
                if (!user.profile) user.profile = { name: 'User' } as any;
                user.profile.username = `${baseUsername}${uniqueSuffix}`;
                userModified = true;
            }

            if (userModified) {
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
                username: (userLean as any).profile?.username,
                avatar_url: (userLean as any).profile?.avatar_url,

                // Computed Heatmap from DailyActivity
                heatmap: dailyActivities.map(activity => {
                    const count = activity.questions_solved;
                    let intensity = 0;
                    if (count > 0) intensity = 1;
                    if (count > 2) intensity = 2;
                    if (count > 4) intensity = 3;
                    if (count >= 10) intensity = 4;

                    return {
                        date: activity.date,
                        count: count,
                        intensity: intensity
                    };
                }),

                // Stats
                totalSolved: (userLean as any).stats?.total_solved || 0,
                totalCorrect: (userLean as any).stats?.total_correct || 0,
                streak: (userLean as any).stats?.current_streak || 0,
                maxStreak: (userLean as any).stats?.max_streak || 0,
                lastActive: (userLean as any).stats?.last_active_date,

                // Config/Prefs
                dailyQuantGoal: (userLean as any).preferences?.daily_quant_goal || 5,
                dailyReasoningGoal: (userLean as any).preferences?.daily_reasoning_goal || 5,
                isPremium: (userLean as any).config?.is_premium,
                targetExam: (userLean as any).target_exam
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
