
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Session from '@/core/models/Session';
import Attempt from '@/core/models/Attempt';
import Question from '@/core/models/Question';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { sprintId, subject, difficulty, topics, totalQuestions, correctCount, timeSpent, status, questionIds, attempts } = body;

        console.log('Saving sprint with attempts:', { questionIds: questionIds?.length, attempts: attempts ? Object.keys(attempts).length : 0 });

        // Create a new Session document
        const newSession = await Session.create({
            user_id: user.userId,
            type: 'SPRINT',
            config: {
                subject,
                patterns: topics || [],
                difficulty,
                question_count: totalQuestions,
                time_limit_ms: 0, // Not tracked in current implementation
            },
            question_ids: questionIds || [],
            attempt_ids: [], // Will populate after creating attempts
            correct_count: correctCount || 0,
            total_time_ms: timeSpent || 0,
            status: status || 'COMPLETED',
            started_at: new Date(Date.now() - (timeSpent || 0)),
            completed_at: new Date()
        });

        // Create Attempt documents for each question
        const attemptIds = [];
        if (attempts && questionIds) {
            for (const questionId of questionIds) {
                const attemptData = attempts[questionId];

                // Fetch question details for denormalization
                const question = await Question.findById(questionId).lean();
                if (!question) continue;

                // Create attempt (even for skipped questions)
                const attempt = await Attempt.create({
                    user_id: user.userId,
                    question_id: questionId,
                    session_id: newSession._id,
                    selected_option: attemptData?.selectedOption || 'SKIPPED',
                    is_correct: attemptData?.isCorrect || false,
                    time_ms: attemptData?.timeMs || 0,
                    subject: question.subject,
                    pattern: (question as any).topic || (question as any).pattern || 'Unknown',
                    difficulty: question.difficulty
                });

                attemptIds.push(attempt._id);
            }
        }

        // Update session with attempt IDs
        newSession.attempt_ids = attemptIds;
        await newSession.save();

        console.log(`Sprint saved successfully: ${newSession._id}, ${attemptIds.length} attempts created`);

        return NextResponse.json({ success: true, sessionId: newSession._id });

    } catch (error) {
        console.error('Error saving sprint:', error);
        return NextResponse.json({ success: false, error: 'Failed to save sprint' }, { status: 500 });
    }
}
