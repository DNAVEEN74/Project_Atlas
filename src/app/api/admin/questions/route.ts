import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Question from '@/core/models/Question';
import { requireAdmin } from '@/lib/auth';

// GET /api/admin/questions - List questions with filters
export async function GET(request: NextRequest) {
    try {
        // Admin role check
        const { error: authError } = await requireAdmin();
        if (authError) return authError;

        console.log('[API] Connecting to database...');
        await dbConnect();
        console.log('[API] Connected successfully');

        const { searchParams } = new URL(request.url);
        const verified = searchParams.get('verified');
        const needsReview = searchParams.get('needs_review');
        const batch = searchParams.get('batch');

        const filter: Record<string, unknown> = {};

        if (verified === 'true') {
            filter.is_verified = true;
        } else if (verified === 'false') {
            filter.is_verified = { $ne: true };
        }

        if (needsReview === 'true') {
            filter.needs_image_review = true;
        } else if (needsReview === 'false') {
            filter.needs_image_review = { $ne: true };
        }

        if (batch) {
            filter.import_batch = batch;
        }

        console.log('[API] Filter:', JSON.stringify(filter));

        const questions = await Question.find(filter)
            .sort({
                'source.file_name': 1,      // Group by PDF file
                'source.section': 1,         // Then by section (QUANT/REASONING)
                'source.question_number': 1  // Then by question number
            })
            .limit(200)  // Increased limit for full PDF review
            .lean();

        console.log('[API] Found', questions.length, 'questions');

        return NextResponse.json({ questions });
    } catch (error) {
        console.error('[API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to fetch questions', details: errorMessage },
            { status: 500 }
        );
    }
}
