import { NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import ExamRequest from '@/core/models/ExamRequest';

export async function POST(req: Request) {
    try {
        const { email, examName, fullName } = await req.json();

        if (!email || !examName) {
            return NextResponse.json(
                { error: 'Email and exam name are required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if request already exists for this email and exam to prevent duplicates
        // We can just create a new one, or update the existing one. Let's just create a new one for now to track demand volume.
        // Or maybe returning success if it exists is better UX.

        // Creating a new entry to track interest volume over time
        await ExamRequest.create({
            email,
            examName,
            fullName
        });

        return NextResponse.json({ success: true, message: 'Request received' });
    } catch (error) {
        console.error('Exam request error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
