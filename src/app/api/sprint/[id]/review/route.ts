
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Session from "@/core/models/Session";
import Question from "@/core/models/Question";
import Attempt from "@/core/models/Attempt"; // Ensure Attempt is registered
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
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get('filter') || 'ALL'; // ALL, CORRECT, INCORRECT, SKIPPED, NOT_ATTEMPTED

        // 1. Fetch Session (lightweight)
        const session = await Session.findOne({ _id: sessionId, user_id: user.userId })
            .select('question_status question_ids')
            .lean();

        if (!session) {
            return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
        }

        // 2. Fetch All Questions
        const questions = await Question.find({ _id: { $in: session.question_ids } }).lean();

        // 3. Merge Data
        const questionsMap = new Map(questions.map(q => [q._id.toString(), q]));

        let reviewQuestions = session.question_status.map((statusItem: any) => {
            const q = questionsMap.get(statusItem.question_id.toString());
            if (!q) return null;

            return {
                question_id: q._id,
                order: statusItem.order,
                text: q.text,
                options: q.options || [], // Assuming options are in question
                correct_option: q.correct_option,
                explanation: q.solution,

                // Status info
                status: statusItem.status, // CORRECT, INCORRECT, SKIPPED, NOT_ATTEMPTED
                user_selected: statusItem.attempt_id ? null : null, // We need selected option!
                // Wait, question_status doesn't store selected_option directly.
                // It stores attempt_id.
                // If I want selected_option, I need to fetch Attempts OR store it in question_status.
                // Storing it in question_status would be faster (denormalization).
                // Currently schema has: status, time_ms, attempt_id.
                // The Session model I updated DOES NOT have selected_option in question_status.
                // So I definitely need to fetch Attempts if I want to show what user selected!

                attempt_id: statusItem.attempt_id,
                time_ms: statusItem.time_ms
            };
        }).filter(item => item !== null);

        // Problem: I need 'selected_option' for review.
        // Option A: Fetch all attempts for this session.
        // Option B: Query `Attempt` based on attempt_ids.
        // Option B is cleaner.

        // Let's fetch attempts.
        const attempts = await Attempt.find({ session_id: sessionId }).lean();
        const attemptsMap = new Map(attempts.map(a => [a._id.toString(), a]));

        // Merge attempt data
        reviewQuestions = reviewQuestions.map((item: any) => {
            let selected = null;
            if (item.attempt_id && attemptsMap.has(item.attempt_id.toString())) {
                const att = attemptsMap.get(item.attempt_id.toString());
                selected = (att as any).selected_option;
            }
            return { ...item, selected_option: selected };
        });

        // 4. Filtering
        if (filter !== 'ALL') {
            reviewQuestions = reviewQuestions.filter((q: any) => q.status === filter);
        }

        return NextResponse.json({
            success: true,
            review: {
                session_id: sessionId,
                total_questions: reviewQuestions.length,
                questions: reviewQuestions
            }
        });

    } catch (error) {
        console.error("Error fetching sprint review:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
