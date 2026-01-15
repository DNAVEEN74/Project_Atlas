import { NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import User from "@/core/models/User";
import { getCurrentUser } from "@/lib/auth";

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

        const user = await User.findById(authUser.userId)
            .select('-password_hash')
            .lean();

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: (user as any)._id,
                email: (user as any).email,
                name: (user as any).profile?.name,
                targetExam: (user as any).target?.exam,
                targetYear: (user as any).target?.year,
                totalSolved: (user as any).dash?.total_solved || 0,
                totalCorrect: (user as any).dash?.total_correct || 0,
                streak: (user as any).dash?.streak || 0,
                lastActive: (user as any).dash?.last_active,
                bookmarks: (user as any).bookmarks || [],
                heatmap: (user as any).dash?.heatmap || [],
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
