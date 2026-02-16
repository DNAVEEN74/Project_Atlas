import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import User from "@/core/models/User";
import DailyActivity from "@/core/models/DailyActivity";
import Attempt from "@/core/models/Attempt";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/user/dashboard
 * Single call: stats + heatmap + recent + topic accuracy + daily goal progress
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

        // 1. Fetch User
        const user = await User.findById(userObjectId).lean();
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userAny = user as any;

        // 2. Today's daily activity (for daily goal progress)
        const todayStr = new Date().toISOString().split('T')[0];
        const todayActivity = await DailyActivity.findOne({
            user_id: userObjectId,
            date: todayStr
        }).lean();

        // 3. Recent Activity (Last 10 attempts)
        const recentAttempts = await Attempt.find({ user_id: userObjectId })
            .sort({ created_at: -1 })
            .limit(10)
            .populate('question_id', 'text difficulty subject pattern')
            .lean();

        // 4. Topic Accuracy (Top 5 active topics)
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
            { $limit: 5 }
        ]);

        return NextResponse.json({
            success: true,
            dailyProgress: {
                quantSolved: (todayActivity as any)?.quant_solved || 0,
                reasoningSolved: (todayActivity as any)?.reasoning_solved || 0,
                quantGoal: userAny.preferences?.daily_quant_goal || 5,
                reasoningGoal: userAny.preferences?.daily_reasoning_goal || 5,
                totalToday: (todayActivity as any)?.questions_solved || 0,
                correctToday: (todayActivity as any)?.questions_correct || 0,
            },
            recentActivity: recentAttempts.map((a: any) => ({
                id: a._id,
                questionId: a.question_id?._id,
                questionText: a.question_id?.text || 'Unknown Question',
                difficulty: a.question_id?.difficulty || a.difficulty,
                subject: a.question_id?.subject || a.subject,
                isCorrect: a.is_correct,
                timeMs: a.time_ms,
                createdAt: a.created_at
            })),
            topicStats: topicStats.map((t: any) => ({
                pattern: t._id,
                accuracy: Math.round((t.correct / t.total) * 100),
                count: t.total
            })),
            targetExam: userAny.target_exam,
        });

    } catch (error) {
        console.error("Get dashboard error:", error);
        return NextResponse.json(
            { error: "Failed to get dashboard data" },
            { status: 500 }
        );
    }
}
