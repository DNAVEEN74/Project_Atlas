
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import Question from "@/core/models/Question";
import Session from "@/core/models/Session";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
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
        const body = await req.json();
        const { question_id, question_order, selected_option, time_ms } = body;

        if (!question_id || !selected_option) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Fetch question to check correctness
        const question = await Question.findById(question_id).lean();
        if (!question) {
            return NextResponse.json({ success: false, error: "Question not found" }, { status: 404 });
        }

        const is_correct = (question as any).correct_option === selected_option;

        // 1. Create attempt
        const attempt = await Attempt.create({
            user_id: user.userId,
            session_id: sessionId,
            question_id,
            selected_option,
            is_correct,
            time_ms: time_ms || 0,
            subject: (question as any).subject,
            pattern: (question as any).pattern || 'Unknown',
            difficulty: (question as any).difficulty
        });

        // 2. Update session (single atomic operation)
        await Session.updateOne(
            { _id: sessionId },
            {
                $push: { attempt_ids: attempt._id },
                $inc: {
                    correct_count: is_correct ? 1 : 0,
                    total_time_ms: time_ms || 0
                },
                $set: {
                    current_index: question_order, // Track progress
                    'question_status.$[elem].status': is_correct ? 'CORRECT' : 'INCORRECT',
                    'question_status.$[elem].attempt_id': attempt._id,
                    'question_status.$[elem].time_ms': time_ms || 0
                }
            },
            {
                arrayFilters: [{ 'elem.question_id': new mongoose.Types.ObjectId(question_id) }]
            }
        );

        return NextResponse.json({
            success: true,
            is_correct,
            attempt_id: attempt._id
        });

    } catch (error) {
        console.error("Error submitting attempt:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
