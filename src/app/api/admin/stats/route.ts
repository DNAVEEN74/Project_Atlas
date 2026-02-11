import { NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Question from '@/core/models/Question';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
    try {
        const { error: authError } = await requireAdmin();
        if (authError) return authError;

        await dbConnect();

        const [total, live, needsReview, needsImageReview] = await Promise.all([
            Question.countDocuments({}),
            Question.countDocuments({ is_live: true }),
            Question.countDocuments({ needs_review: true }),
            Question.countDocuments({ needs_image_review: true }),
        ]);

        return NextResponse.json({
            total,
            verified: live,
            unverified: total - live,
            needImages: needsImageReview,
            needsReview,
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
