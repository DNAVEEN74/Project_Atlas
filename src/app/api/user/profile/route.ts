import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import User from "@/core/models/User";
import { getCurrentUser } from "@/lib/auth";

/**
 * PUT /api/user/profile
 * Update name, avatar, daily_goal
 */
export async function PUT(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name, daily_goal, avatar_url } = body;

        await dbConnect();

        const updateData: any = {};

        if (name) updateData['profile.name'] = name;
        if (avatar_url !== undefined) updateData['profile.avatar_url'] = avatar_url;
        if (daily_goal) updateData['preferences.daily_goal'] = daily_goal;

        const user = await User.findByIdAndUpdate(
            authUser.userId,
            { $set: updateData },
            { new: true }
        ).select('profile preferences config');

        return NextResponse.json({
            success: true,
            user: {
                name: (user as any).profile.name,
                avatar_url: (user as any).profile.avatar_url,
                daily_goal: (user as any).preferences.daily_goal
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
