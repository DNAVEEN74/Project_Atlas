import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Question from "@/core/models/Question";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;

        const question = await Question.findById(id).lean();

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        const q = question as any;

        // Format response using the new flat schema
        const formattedQuestion = {
            id: q._id,
            text: q.text,
            image: q.image || null,
            options: q.options, // [{ id: "A", text: "...", image?: "..." }, ...]
            correct_option: q.correct_option, // "A", "B", "C", or "D"
            solution: q.solution || null,
            pattern: q.pattern || null, // string like "percentage"
            subject: q.subject, // "QUANT" or "REASONING"
            difficulty: q.difficulty,
            source: {
                exam: q.source?.exam || "SSC CGL",
                year: q.source?.year,
                shift: q.source?.shift || null,
            },
            stats: {
                attempt_count: q.stats?.attempt_count || 0,
                accuracy_rate: q.stats?.accuracy_rate || 0,
                avg_time_ms: q.stats?.avg_time_ms || 0,
            },
            is_live: q.is_live,
        };

        return NextResponse.json({ data: formattedQuestion });
    } catch (error) {
        console.error("Error fetching question:", error);
        return NextResponse.json(
            { error: "Failed to fetch question" },
            { status: 500 }
        );
    }
}
