
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import Session from "@/core/models/Session";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { id: sessionId } = await params;

        // Fetch session to get total questions and time
        const session = await Session.findById(sessionId);
        if (!session) {
            return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
        }

        // 1. Compute overall stats (1 aggregation)
        // We exclude skipped from "attempted" (answered) count if we want strictly answered,
        // or we track them as "interactions".
        // Let's explicitly count: Answered, Skipped, Correct, Time.
        const [overallStats] = await Attempt.aggregate([
            { $match: { session_id: new mongoose.Types.ObjectId(sessionId) } },
            {
                $group: {
                    _id: null,
                    total_interactions: { $sum: 1 },
                    total_answered: { $sum: { $cond: [{ $eq: ['$selected_option', 'SKIPPED'] }, 0, 1] } },
                    total_skipped: { $sum: { $cond: [{ $eq: ['$selected_option', 'SKIPPED'] }, 1, 0] } },
                    total_correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
                    total_time: { $sum: '$time_ms' }
                }
            }
        ]);

        const statsData = overallStats || {
            total_interactions: 0,
            total_answered: 0,
            total_skipped: 0,
            total_correct: 0,
            total_time: 0
        };

        // not_attempted = total_questions - total_interactions
        const totalQuestions = session.question_ids.length;
        const not_attempted = totalQuestions - statsData.total_interactions;

        // 2. Compute topic-wise performance (1 aggregation)
        const topicPerformance = await Attempt.aggregate([
            { $match: { session_id: new mongoose.Types.ObjectId(sessionId) } },
            {
                $group: {
                    _id: '$pattern',
                    total: { $sum: 1 }, // Total interactions (including skipped)
                    answered: { $sum: { $cond: [{ $eq: ['$selected_option', 'SKIPPED'] }, 0, 1] } },
                    correct: { $sum: { $cond: ['$is_correct', 1, 0] } },
                    skipped: { $sum: { $cond: [{ $eq: ['$selected_option', 'SKIPPED'] }, 1, 0] } },
                    total_time: { $sum: '$time_ms' }
                }
            },
            {
                $project: {
                    _id: 0,
                    topic: '$_id',
                    total: 1,
                    correct: 1,
                    // Incorrect is Answered - Correct (don't count skipped as incorrect here? Or do?)
                    // Usually Incorrect = Answered - Correct.
                    // Skipped is separate.
                    incorrect: { $subtract: ['$answered', '$correct'] },
                    skipped: 1,
                    // Accuracy = Correct / Total (including skipped)
                    accuracy: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $multiply: [{ $divide: ['$correct', '$total'] }, 100] },
                            0
                        ]
                    },
                    avg_time_ms: {
                        $cond: [
                            { $gt: ['$total', 0] },
                            { $divide: ['$total_time', '$total'] },
                            0
                        ]
                    }
                }
            }
        ]);

        // 3. Store ALL computed data in Session (1 write)
        await Session.updateOne(
            { _id: sessionId },
            {
                $set: {
                    status: 'COMPLETED',
                    completed_at: new Date(),
                    stats: {
                        total_questions: totalQuestions,
                        attempted: statsData.total_answered, // "Attempted" usually means Answered in stats cards
                        correct: statsData.total_correct,
                        incorrect: statsData.total_answered - statsData.total_correct,
                        skipped: statsData.total_skipped,
                        not_attempted: not_attempted,
                        accuracy: statsData.total_interactions > 0
                            ? Math.round((statsData.total_correct / statsData.total_interactions) * 100)
                            : 0,
                        avg_time_ms: statsData.total_interactions > 0
                            ? Math.round(statsData.total_time / statsData.total_interactions)
                            : 0,
                        total_time_ms: statsData.total_time
                    },
                    topic_performance: topicPerformance
                }
            }
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error completing sprint:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
