import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Question from "@/core/models/Question";
import Pattern from "@/core/models/Pattern";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        // Force Pattern model registration
        void Pattern;

        const { id } = await params;

        const question = await Question.findById(id)
            .populate("p_id", "name p_code topic subtopic")
            .lean();

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // Format response
        const formattedQuestion = {
            id: (question as any)._id,
            content: {
                text: (question as any).content.text,
                options: (question as any).content.options,
                correct_option_id: (question as any).content.correct_option_id,
                image: (question as any).content.image,
            },
            pattern: (question as any).p_id ? {
                name: (question as any).p_id.name,
                code: (question as any).p_id.p_code,
                topic: (question as any).p_id.topic,
                subtopic: (question as any).p_id.subtopic,
            } : null,
            source: {
                exam: (question as any).source.exam,
                year: (question as any).source.year,
                paper: (question as any).source.paper,
                section: (question as any).source.section,
                question_number: (question as any).source.question_number,
            },
            difficulty: (question as any).difficulty,
            is_verified: (question as any).is_verified,
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
