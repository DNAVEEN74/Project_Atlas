import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/attempts/filters - Get available filters (subjects, patterns) based on user's history
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

        // Get distinct subjects and patterns from attempts
        const [subjects, patterns] = await Promise.all([
            Attempt.distinct('subject', { user_id: authUser.userId }),
            Attempt.distinct('pattern', { user_id: authUser.userId })
        ]);

        return NextResponse.json({
            data: {
                subjects: subjects.filter(Boolean).sort(),
                patterns: patterns.filter(Boolean).sort()
            }
        });
    } catch (error) {
        console.error("Get attempts filters error:", error);
        return NextResponse.json(
            { error: "Failed to get filters" },
            { status: 500 }
        );
    }
}
