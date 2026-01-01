import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Question from '@/core/models/Question';

// PATCH /api/admin/questions/[id] - Update question
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const body = await request.json();
        const { id } = params;

        const updateData: any = {};

        if (body.is_verified !== undefined) {
            updateData.is_verified = body.is_verified;
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
