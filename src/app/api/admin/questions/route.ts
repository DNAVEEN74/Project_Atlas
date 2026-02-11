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

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const isLive = searchParams.get('is_live');
        const needsReview = searchParams.get('needs_review');
        const needsImageReview = searchParams.get('needs_image_review');

        const filter: Record<string, unknown> = {};

        if (isLive === 'true') {
            filter.is_live = true;
        } else if (isLive === 'false') {
            filter.is_live = { $ne: true };
        }

        if (needsReview === 'true') {
            filter.needs_review = true;
        } else if (needsReview === 'false') {
            filter.needs_review = { $ne: true };
        }

        if (needsImageReview === 'true') {
            filter.needs_image_review = true;
        } else if (needsImageReview === 'false') {
            filter.needs_image_review = { $ne: true };
        }

        const questions = await Question.find(filter)
            .sort({
                subject: 1,
                pattern: 1,
                question_number: 1,
            })
            .limit(200)
            .lean();

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
