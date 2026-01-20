import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import QuestionReport from '@/core/models/QuestionReport';

export async function POST(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();
        const { questionId, reason, description } = body;

        if (!questionId || !reason) {
            return NextResponse.json({ error: 'Question ID and reason are required' }, { status: 400 });
        }

        const report = await QuestionReport.create({
            u_id: new mongoose.Types.ObjectId(authUser.userId),
            q_id: new mongoose.Types.ObjectId(questionId),
            reason,
            description,
            status: 'PENDING'
        });

        return NextResponse.json({ success: true, report });

    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
    }
}
