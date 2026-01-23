import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import SprintAttempt from "@/core/models/SprintAttempt";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        const attempts = await SprintAttempt.find({
            userId: authUser.userId,
            status: 'COMPLETED'
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        const history = attempts.map(a => ({
            id: a._id,
            createdAt: a.createdAt, // This is Date object in model, but client expects string
            subject: a.subject,
            score: a.correctCount,
            totalQuestions: a.questionCount,
            accuracy: a.questionCount > 0 ? Math.round((a.correctCount / a.questionCount) * 100) : 0,
            timeTaken: a.totalTimeSpent,
            completed: true
        }));

        return NextResponse.json(history);
    } catch (error) {
        console.error("Sprint history error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
