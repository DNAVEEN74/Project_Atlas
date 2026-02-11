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
        const { id } = await params;  // Await params in Next.js 13+

        console.log('[API] Updating question:', id);

        const updateData: any = {};

        if (body.is_verified !== undefined) {
            updateData.is_verified = body.is_verified;
        }

        // Handle direct content.image update
        if (body['content.image'] !== undefined) {
            updateData['content.image'] = body['content.image'];
        }

        // Handle direct content.options update
        if (body['content.options'] !== undefined) {
            updateData['content.options'] = body['content.options'];
        }

        if (body.content) {
            updateData.content = body.content;
            // Increment version on content updates
            updateData.$inc = { version: 1 };
        }

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
