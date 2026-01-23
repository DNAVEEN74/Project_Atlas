import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import SprintAttempt from '@/core/models/SprintAttempt';
import Question from '@/core/models/Question';

/**
 * GET /api/sprint/[id]/review - Get sprint details with answers for review
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { id: sprintId } = await params;

        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);
        const sprintObjectId = new mongoose.Types.ObjectId(sprintId);

        // Find the sprint
        const sprint = await SprintAttempt.findOne({
            _id: sprintObjectId,
            userId: userObjectId
        }).lean();

        if (!sprint) {
            return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
        }

        // Fetch all questions with their content
        const questions = await Question.find({
            _id: { $in: sprint.questionIds }
        }).select('_id content difficulty source').lean();

        // Create a map for quick lookup
        const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

        // Build the review data
        const reviewData = sprint.questionIds.map((qId: mongoose.Types.ObjectId, index: number) => {
            const question = questionMap.get(qId.toString());
            const answer = sprint.answers.find((a: any) => a.questionId.toString() === qId.toString());

            return {
                index: index + 1,
                questionId: qId.toString(),
                content: question?.content || null,
                difficulty: question?.difficulty || 'MEDIUM',
                source: question?.source || null,
                userAnswer: answer?.selectedOption || null,
                isCorrect: answer?.isCorrect || false,
                timeTaken: answer?.timeTaken || 0,
                wasAttempted: !!answer
            };
        });

        return NextResponse.json({
            success: true,
            sprint: {
                id: sprint._id,
                subject: sprint.subject,
                difficulty: sprint.difficulty,
                topics: sprint.topics,
                totalQuestions: sprint.questionCount,
                correctCount: sprint.correctCount,
                totalTimeSpent: sprint.totalTimeSpent,
                accuracy: sprint.questionCount > 0
                    ? Math.round((sprint.correctCount / sprint.questionCount) * 100)
                    : 0,
                status: sprint.status,
                createdAt: sprint.createdAt
            },
            questions: reviewData
        });

    } catch (error) {
        console.error('Error fetching sprint review:', error);
        return NextResponse.json({ error: 'Failed to fetch sprint review' }, { status: 500 });
    }
}
