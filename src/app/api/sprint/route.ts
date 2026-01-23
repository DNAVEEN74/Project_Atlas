import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import Question from '@/core/models/Question';
import Pattern from '@/core/models/Pattern';
import SprintAttempt from '@/core/models/SprintAttempt';

// Timer constants (milliseconds per question based on difficulty)
// Must match DIFFICULTY_CONFIG in sprint/page.tsx
const TIME_PER_QUESTION = {
    EASY: 40000,    // 40s per question
    MEDIUM: 30000,  // 30s per question
    HARD: 25000     // 25s per question
};

/**
 * GET /api/sprint - Start a new sprint or get active sprint
 * Query params: subject, topics (comma-separated), difficulty, count
 */
export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        void Pattern; // Force model registration

        const searchParams = req.nextUrl.searchParams;
        const subject = searchParams.get('subject') as 'QUANT' | 'REASONING';
        const topicsParam = searchParams.get('topics');
        const difficulty = searchParams.get('difficulty') as 'EASY' | 'MEDIUM' | 'HARD';
        const count = parseInt(searchParams.get('count') || '10');

        // Validate required params
        if (!subject || !difficulty || !topicsParam) {
            return NextResponse.json(
                { error: 'Missing required parameters: subject, topics, difficulty' },
                { status: 400 }
            );
        }

        const topics = topicsParam.split(',').filter(t => t.trim());
        if (topics.length === 0) {
            return NextResponse.json(
                { error: 'At least one topic must be selected' },
                { status: 400 }
            );
        }

        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

        // Check for existing active sprint and abandon it
        // This ensures new configuration is always used
        const activeSprint = await SprintAttempt.findOne({
            userId: userObjectId,
            status: 'IN_PROGRESS'
        });

        if (activeSprint) {
            // Abandon the old sprint so we can start fresh
            activeSprint.status = 'ABANDONED';
            await activeSprint.save();
        }

        // Build filter for questions
        const filter: Record<string, unknown> = {
            is_verified: true,
            'source.section': subject,
            difficulty: difficulty
        };

        // Only filter by patterns if not using "ALL" topic
        if (!topics.includes('ALL')) {
            // Get pattern IDs for selected topics (Topic names match Pattern names or Codes)
            // The frontend sends topic codes (e.g., "PERCENTAGE", "PROFIT_LOSS")
            // We need to match these to Pattern `p_code` usually, or `name`.

            // NOTE: The `code` from frontend effectively maps to `p_code` in Pattern model.

            const patterns = await Pattern.find({
                p_code: { $in: topics }
            }).select('_id').lean();

            const patternIds = patterns.map(p => p._id);

            // If patterns found, filter by them
            // If no patterns found for the topics (should behave as if no questions found for those topics?)
            if (patternIds.length > 0) {
                filter.p_id = { $in: patternIds };
            } else {
                // Optimization: If specific topics requested but no matching patterns found, return empty early
                // unless "topics" param might contain direct pattern names?
                // Let's safe-guard: if no pattern IDs found but topics were provided,
                // it implies we shouldn't find any questions.
                // (Unless the 'topic' field on Question directly stores these strings? 
                //  But looking at the schema, `pattern` is usually the link).
                // However, let's just let it run. If p_id is expected, query will return nothing.

                // Force empty result if patterns required but none found
                return NextResponse.json({
                    success: false,
                    error: `No patterns found for topics: ${topics.join(', ')}`,
                    available: 0,
                    requested: count
                }, { status: 400 });
            }
        }

        // Fetch questions with shuffle
        const allQuestions = await Question.find(filter)
            .select('_id content difficulty')
            .limit(count * 5) // Fetch more for better randomness
            .lean();

        if (allQuestions.length < count) {
            return NextResponse.json({
                success: false,
                error: 'Not enough questions in selected topics. Please modify selection.',
                available: allQuestions.length,
                requested: count
            }, { status: 400 });
        }

        // Shuffle and select
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const selectedQuestions = shuffled.slice(0, count);
        const questionIds = selectedQuestions.map(q => q._id);

        // Calculate total time allowed
        const totalTimeAllowed = count * TIME_PER_QUESTION[difficulty];
        const today = new Date().toISOString().split('T')[0];

        // Create new sprint
        const sprint = await SprintAttempt.create({
            userId: userObjectId,
            date: today,
            subject,
            topics,
            difficulty,
            questionCount: count,
            questionIds,
            answers: [],
            correctCount: 0,
            totalTimeSpent: 0,
            totalTimeAllowed,
            status: 'IN_PROGRESS',
            currentIndex: 0
        });

        return NextResponse.json({
            success: true,
            resuming: false,
            sprintId: sprint._id,
            questions: selectedQuestions,
            currentIndex: 0,
            totalTimeAllowed,
            timeSpent: 0,
            subject,
            difficulty,
            topics
        });

    } catch (error) {
        console.error('Error starting sprint:', error);
        return NextResponse.json({ error: 'Failed to start sprint' }, { status: 500 });
    }
}

/**
 * POST /api/sprint - Submit answer for current question
 * Body: { sprintId, questionId, selectedOption, timeTaken }
 */
export async function POST(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { sprintId, questionId, selectedOption, timeTaken } = body;

        if (!sprintId || !questionId || !selectedOption) {
            return NextResponse.json(
                { error: 'Missing required fields: sprintId, questionId, selectedOption' },
                { status: 400 }
            );
        }

        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);
        const sprintObjectId = new mongoose.Types.ObjectId(sprintId);
        const questionObjectId = new mongoose.Types.ObjectId(questionId);

        // Find the sprint
        const sprint = await SprintAttempt.findOne({
            _id: sprintObjectId,
            userId: userObjectId,
            status: 'IN_PROGRESS'
        });

        if (!sprint) {
            return NextResponse.json({ error: 'Sprint not found or already completed' }, { status: 404 });
        }

        // Get the question to check correct answer
        const question = await Question.findById(questionId).select('content').lean();
        if (!question) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        const isCorrect = (question as any).content.correct_option_id === selectedOption;

        // Check if already answered
        const alreadyAnswered = sprint.answers.some(
            a => a.questionId.toString() === questionId
        );

        if (!alreadyAnswered) {
            sprint.answers.push({
                questionId: questionObjectId,
                selectedOption,
                isCorrect,
                timeTaken: timeTaken || 0
            });

            if (isCorrect) {
                sprint.correctCount += 1;
            }
            sprint.totalTimeSpent += (timeTaken || 0);
            sprint.currentIndex = sprint.answers.length;
        }

        // Check if sprint is complete
        const isComplete = sprint.answers.length >= sprint.questionCount;
        if (isComplete) {
            sprint.status = 'COMPLETED';
        }

        await sprint.save();

        return NextResponse.json({
            success: true,
            isCorrect,
            isComplete,
            currentIndex: sprint.currentIndex,
            correctCount: sprint.correctCount,
            totalAnswered: sprint.answers.length
        });

    } catch (error) {
        console.error('Error submitting answer:', error);
        return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 });
    }
}

/**
 * PUT /api/sprint - Complete or abandon sprint
 * Body: { sprintId, action: 'complete' | 'abandon', totalTimeSpent? }
 */
export async function PUT(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { sprintId, action, totalTimeSpent } = body;

        if (!sprintId || !action) {
            return NextResponse.json(
                { error: 'Missing required fields: sprintId, action' },
                { status: 400 }
            );
        }

        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);
        const sprintObjectId = new mongoose.Types.ObjectId(sprintId);

        const sprint = await SprintAttempt.findOne({
            _id: sprintObjectId,
            userId: userObjectId
        });

        if (!sprint) {
            return NextResponse.json({ error: 'Sprint not found' }, { status: 404 });
        }

        if (action === 'complete' || action === 'abandon') {
            sprint.status = action === 'complete' ? 'COMPLETED' : 'ABANDONED';
            if (totalTimeSpent !== undefined) {
                sprint.totalTimeSpent = totalTimeSpent;
            }
            await sprint.save();
        }

        return NextResponse.json({
            success: true,
            sprintId: sprint._id,
            status: sprint.status,
            correctCount: sprint.correctCount,
            totalQuestions: sprint.questionCount,
            totalTimeSpent: sprint.totalTimeSpent,
            accuracy: sprint.questionCount > 0
                ? Math.round((sprint.correctCount / sprint.questionCount) * 100)
                : 0
        });

    } catch (error) {
        console.error('Error updating sprint:', error);
        return NextResponse.json({ error: 'Failed to update sprint' }, { status: 500 });
    }
}
