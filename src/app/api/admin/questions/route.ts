import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Question from '@/core/models/Question';

// GET /api/admin/questions - List questions with filters
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const verified = searchParams.get('verified');
        const batch = searchParams.get('batch');

        const filter: any = {};

        if (verified === 'true') {
            filter.is_verified = true;
        } else if (verified === 'false') {
            filter.is_verified = { $ne: true }; // null or false
        }

        if (batch) {
            filter.import_batch = batch;
        }

        const questions = await Question.find(filter)
            .sort({ 'metadata.question_number': 1 })
            .limit(100);

        return NextResponse.json({ questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}
