
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
            .select('config stats topic_performance expired status question_status question_ids')
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
                image: q.image,
                options: q.options || [],
                correct_option: q.correct_option,
                solution: q.solution,
                difficulty: q.difficulty,
                pattern: q.pattern,
                subject: q.subject,

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

        // --- Calculate Single-Sprint Insights ---

        // 1. Negative Marking & Skip Optimization
        const totalQs = reviewQuestions.length;
        const correctCount = reviewQuestions.filter((q: any) => q.status === 'CORRECT').length;
        const wrongCount = reviewQuestions.filter((q: any) => q.status === 'INCORRECT').length;

        const actualMarks = (correctCount * 2) - (wrongCount * 0.5);
        const maxMarks = totalQs * 2;

        // Find slowest wrong answers
        const wrongQuestions = reviewQuestions
            .filter((q: any) => q.status === 'INCORRECT')
            .sort((a: any, b: any) => (b.time_ms || 0) - (a.time_ms || 0)); // Slowest first

        const skipCount = Math.ceil(wrongQuestions.length / 2); // simulate skipping half of the wrong ones
        const savedTimeMs = wrongQuestions.slice(0, skipCount).reduce((sum: number, q: any) => sum + (q.time_ms || 0), 0);

        const optimizedWrong = wrongCount - skipCount;
        const optimizedMarks = (correctCount * 2) - (optimizedWrong * 0.5);
        const optimizedMax = (totalQs - skipCount) * 2;

        const negative_marking = {
            actual_marks: actualMarks,
            max_marks: maxMarks,
            optimized_marks: optimizedMarks,
            optimized_max: optimizedMax,
            skip_count: skipCount,
            saved_time_ms: savedTimeMs
        };

        // 2. Time Distribution Histogram
        const distribution = {
            under_20: { count: 0, correct: 0 },
            btn_20_40: { count: 0, correct: 0 },
            btn_40_60: { count: 0, correct: 0 },
            over_60: { count: 0, correct: 0 }
        };

        reviewQuestions.forEach((q: any) => {
            const time = q.time_ms || 0;
            const isCorrect = q.status === 'CORRECT';

            if (time < 20000) {
                distribution.under_20.count++;
                if (isCorrect) distribution.under_20.correct++;
            } else if (time < 40000) {
                distribution.btn_20_40.count++;
                if (isCorrect) distribution.btn_20_40.correct++;
            } else if (time < 60000) {
                distribution.btn_40_60.count++;
                if (isCorrect) distribution.btn_40_60.correct++;
            } else {
                distribution.over_60.count++;
                if (isCorrect) distribution.over_60.correct++;
            }
        });

        // 3. Fatigue Detection
        let fatigue = null;
        if (reviewQuestions.length >= 6) {
            const sortedByOrder = [...reviewQuestions].sort((a: any, b: any) => a.order - b.order);
            const midpoint = Math.floor(sortedByOrder.length / 2);
            const firstHalf = sortedByOrder.slice(0, midpoint);
            const secondHalf = sortedByOrder.slice(midpoint);

            const firstAcc = firstHalf.length > 0 ? firstHalf.filter((q: any) => q.status === 'CORRECT').length / firstHalf.length : 0;
            const secondAcc = secondHalf.length > 0 ? secondHalf.filter((q: any) => q.status === 'CORRECT').length / secondHalf.length : 0;

            const drop = firstAcc - secondAcc;
            fatigue = {
                detected: drop >= 0.15, // 15% drop or more
                first_half_accuracy: firstAcc,
                second_half_accuracy: secondAcc,
                drop_percent: drop
            };
        }

        const single_sprint_insights = {
            negative_marking,
            time_distribution: distribution,
            fatigue
        };

        return NextResponse.json({
            success: true,
            review: {
                session_id: sessionId,
                total_questions: reviewQuestions.length,
                config: session.config,
                stats: session.stats || {
                    total_questions: 0, attempted: 0, correct: 0, incorrect: 0, skipped: 0, not_attempted: 0, accuracy: 0, avg_time_ms: 0, total_time_ms: 0
                },
                topic_performance: session.topic_performance || [],
                expired: session.expired,
                status: session.status,
                insights: single_sprint_insights,
                questions: reviewQuestions
            }
        });

    } catch (error) {
        console.error("Error fetching sprint review:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
