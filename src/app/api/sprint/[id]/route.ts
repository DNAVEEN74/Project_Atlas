
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Session from "@/core/models/Session";
import Question from "@/core/models/Question";
import Attempt from "@/core/models/Attempt";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id: sessionId } = await params;

        // Fetch Session
        const session = await Session.findOne({ _id: sessionId, user_id: user.userId })
            .select('config status current_index started_at question_ids question_status attempt_ids expired type')
            .lean();

        if (!session) {
            return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
        }

        // Fetch Questions
        const questions = await Question.find({ _id: { $in: session.question_ids } })
            .select('text options correct_option difficulty subject pattern is_live question_number')
            .lean();

        // Sort questions to match the order in session.question_ids
        // question_ids in session preserves the randomized order
        const questionsMap = new Map(questions.map(q => [q._id.toString(), q]));
        const orderedQuestions = session.question_ids
            .map((id: any) => questionsMap.get(id.toString()))
            .filter((q): q is any => !!q) // Type guard
            .map(q => ({
                ...q,
                id: q._id,
                _id: undefined // Cleanup for cleaner frontend usage
            }));

        // Fetch Attempts (for restoring selection state if needed)
        const attempts = await Attempt.find({ session_id: sessionId })
            .select('question_id selected_option is_correct time_ms')
            .lean();

        return NextResponse.json({
            success: true,
            session: {
                ...session,
                questions: orderedQuestions, // Populate questions in order
                attempts
            }
        });

    } catch (error) {
        console.error("Error fetching sprint session:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
