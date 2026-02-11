import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import mongoose from "mongoose";

// Lightweight schema for exam interest tracking
const ExamRequestSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, lowercase: true, trim: true },
        exam_name: { type: String, required: true },
        full_name: { type: String },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

const ExamRequest =
    mongoose.models.ExamRequest || mongoose.model('ExamRequest', ExamRequestSchema);

/**
 * POST /api/exam-request - Record interest in a non-supported exam
 */
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email, examName, fullName } = body;

        if (!email || !examName) {
            return NextResponse.json(
                { error: "email and examName are required" },
                { status: 400 }
            );
        }

        await ExamRequest.create({
            email: email.toLowerCase(),
            exam_name: examName,
            full_name: fullName || undefined,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Exam request error:", error);
        return NextResponse.json(
            { error: "Failed to record exam request" },
            { status: 500 }
        );
    }
}
