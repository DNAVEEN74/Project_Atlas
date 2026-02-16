import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Session from '@/core/models/Session';
import { getCurrentUser } from '@/lib/auth';
import { DIFFICULTY_CONFIG } from '@/lib/sprint-config';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ success: false, error: 'Invalid Sprint ID' }, { status: 400 });
        }

        // Fetch the original sprint session
        const originalSession = await Session.findOne({
            _id: id,
            user_id: user.userId
        }).lean();

        if (!originalSession) {
            return NextResponse.json({ success: false, error: 'Sprint not found' }, { status: 404 });
        }

        // Extract configuration and question IDs from the original session
        const { config, question_ids } = originalSession;

        if (!question_ids || question_ids.length === 0) {
            return NextResponse.json({ success: false, error: 'No questions found in original sprint' }, { status: 404 });
        }

        // Calculate total time based on original configuration
        const timePerQ = DIFFICULTY_CONFIG[config.difficulty as keyof typeof DIFFICULTY_CONFIG]?.timePerQ || 60;
        const totalTimeAllowed = question_ids.length * timePerQ * 1000; // in ms

        // Create a new session ID for the retry
        const sessionId = `sprint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Convert ObjectIds to strings
        const questionIds = question_ids.map((qId: any) => qId.toString());

        return NextResponse.json({
            success: true,
            sessionId,
            questionIds,
            totalTimeAllowed,
            subject: config.subject,
            difficulty: config.difficulty
        });

    } catch (error) {
        console.error('Error retrying sprint:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
