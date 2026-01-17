import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import Question from '@/core/models/Question';
import Attempt from '@/core/models/Attempt';
import User from '@/core/models/User';
import DailyPracticeSession from '@/core/models/DailyPracticeSession';

/**
 * GET /api/quick-practice - Get or create today's practice session
 */
export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const section = (searchParams.get('section') || 'QUANT') as 'QUANT' | 'REASONING';
        const topic = searchParams.get('topic');

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);

        // Check for existing session today
        let session = await DailyPracticeSession.findOne({
            u_id: userObjectId,
            date: today,
            section: section
        });

        if (session) {
            // Session exists - check if complete
            if (session.is_complete) {
                return NextResponse.json({
                    success: true,
                    completed: true,
                    message: "You've already completed today's practice for this section!",
                    session: {
                        total: session.question_ids.length,
                        answered: session.answered_ids.length
                    }
                });
            }

            // Session in progress - return for resumption
            const nextQuestionIndex = session.answered_ids.length;
            const nextQuestionId = session.question_ids[nextQuestionIndex]?.toString();

            return NextResponse.json({
                success: true,
                resuming: true,
                questionIds: session.question_ids.map(id => id.toString()),
                currentIndex: nextQuestionIndex,
                nextQuestionId,
                section,
                answered: session.answered_ids.length,
                total: session.question_ids.length
            });
        }

        // No session - create new one
        // Get user's daily goal for this section
        const user = await User.findById(authUser.userId).lean();
        const limit = section === 'QUANT'
            ? (user as any)?.preferences?.daily_quant_goal || 5
            : (user as any)?.preferences?.daily_reasoning_goal || 5;

        // Get all question IDs the user has already attempted
        const attemptedQuestions = await Attempt.find({
            u_id: userObjectId
        }).distinct('q_id');

        // Build filter
        const filter: any = {
            is_verified: true,
            'source.section': section,
            _id: { $nin: attemptedQuestions }
        };

        if (topic && topic !== 'All') {
            filter['pattern.topic'] = topic;
        }

        // Fetch unattempted questions
        const questions = await Question.find(filter)
            .select('_id')
            .limit(limit * 3) // Get more than needed for shuffling
            .lean();

        if (questions.length === 0) {
            return NextResponse.json({
                success: true,
                questionIds: [],
                message: 'No unattempted questions found in this category'
            });
        }

        // Shuffle and take requested limit
        const shuffled = questions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(limit, questions.length));
        const questionIds = selected.map(q => q._id);

        // Create new session
        session = await DailyPracticeSession.create({
            u_id: userObjectId,
            date: today,
            section: section,
            question_ids: questionIds,
            answered_ids: [],
            is_complete: false
        });

        return NextResponse.json({
            success: true,
            resuming: false,
            questionIds: questionIds.map(id => id.toString()),
            currentIndex: 0,
            nextQuestionId: questionIds[0]?.toString(),
            section,
            topic: topic || 'All',
            answered: 0,
            total: questionIds.length
        });
    } catch (error) {
        console.error('Error fetching quick practice questions:', error);
        return NextResponse.json({ error: 'Failed to fetch practice questions' }, { status: 500 });
    }
}

/**
 * POST /api/quick-practice - Mark a question as answered in today's session
 */
export async function POST(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { questionId, section } = body;

        if (!questionId || !section) {
            return NextResponse.json({ error: 'questionId and section required' }, { status: 400 });
        }

        const today = new Date().toISOString().split('T')[0];
        const userObjectId = new mongoose.Types.ObjectId(authUser.userId);
        const questionObjectId = new mongoose.Types.ObjectId(questionId);

        // Find today's session
        const session = await DailyPracticeSession.findOne({
            u_id: userObjectId,
            date: today,
            section: section
        });

        if (!session) {
            return NextResponse.json({ error: 'No active session found' }, { status: 404 });
        }

        // Check if already answered
        if (!session.answered_ids.some(id => id.toString() === questionId)) {
            session.answered_ids.push(questionObjectId);
        }

        // Check if session is now complete
        if (session.answered_ids.length >= session.question_ids.length) {
            session.is_complete = true;
        }

        await session.save();

        // Determine next question
        const nextIndex = session.answered_ids.length;
        const nextQuestionId = session.is_complete
            ? null
            : session.question_ids[nextIndex]?.toString();

        return NextResponse.json({
            success: true,
            isComplete: session.is_complete,
            answered: session.answered_ids.length,
            total: session.question_ids.length,
            nextQuestionId,
            nextIndex
        });
    } catch (error) {
        console.error('Error updating practice session:', error);
        return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
    }
}
