import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import Question from '@/core/models/Question';
import Attempt from '@/core/models/Attempt';

export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const section = searchParams.get('section') || 'QUANT';
        const topic = searchParams.get('topic');
        const limit = parseInt(searchParams.get('limit') || '5');

        // Get all question IDs the user has already attempted
        const attemptedQuestions = await Attempt.find({
            u_id: authUser.userId
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
        const questionIds = selected.map(q => q._id.toString());

        return NextResponse.json({
            success: true,
            questionIds,
            section,
            topic: topic || 'All'
        });
    } catch (error) {
        console.error('Error fetching quick practice questions:', error);
        return NextResponse.json({ error: 'Failed to fetch practice questions' }, { status: 500 });
    }
}
