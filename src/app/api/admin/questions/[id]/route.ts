import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Question from '@/core/models/Question';
import { requireAdmin } from '@/lib/auth';

// PATCH /api/admin/questions/[id] - Update question
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Admin role check
        const { error: authError } = await requireAdmin();
        if (authError) return authError;

        await dbConnect();

        const body = await request.json();
        const { id } = await params;

        const updateData: any = {};

        // Boolean flags
        if (body.is_live !== undefined) updateData.is_live = body.is_live;
        if (body.needs_review !== undefined) updateData.needs_review = body.needs_review;
        if (body.needs_image_review !== undefined) updateData.needs_image_review = body.needs_image_review;

        // Flat question fields
        if (body.text !== undefined) updateData.text = body.text;
        if (body.image !== undefined) updateData.image = body.image;
        if (body.options !== undefined) updateData.options = body.options;
        if (body.correct_option !== undefined) updateData.correct_option = body.correct_option;
        if (body.solution !== undefined) updateData.solution = body.solution;
        if (body.subject !== undefined) updateData.subject = body.subject;
        if (body.pattern !== undefined) updateData.pattern = body.pattern;
        if (body.difficulty !== undefined) updateData.difficulty = body.difficulty;

        const question = await Question.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!question) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        return NextResponse.json({ question });
    } catch (error) {
        console.error('Error updating question:', error);
        return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
    }
}
