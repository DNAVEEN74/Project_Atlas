
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Session from '@/core/models/Session';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
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

        // SINGLE QUERY - all data is pre-computed!
        const session = await Session.findOne({ _id: id, user_id: user.userId })
            .select('config stats topic_performance completed_at expired status')
            .lean();

        if (!session) {
            return NextResponse.json({ success: false, error: 'Sprint not found' }, { status: 404 });
        }

        // Calculate time analysis
        const timePerQuestion = {
            EASY: 40000,
            MEDIUM: 30000,
            HARD: 25000,
            MIXED: 30000
        };
        const difficultyKey = session.config.difficulty as keyof typeof timePerQuestion;
        const targetTime = timePerQuestion[difficultyKey] || 30000;

        const avgTime = session.stats?.avg_time_ms || 0;

        let recommendation = 'GOOD_PACE';
        if (avgTime < targetTime * 0.7) recommendation = 'SLOW_DOWN';
        else if (avgTime > targetTime * 1.3) recommendation = 'SPEED_UP';

        const summary = {
            session_id: session._id,
            config: session.config,
            stats: session.stats || {
                total_questions: 0, attempted: 0, correct: 0, incorrect: 0, skipped: 0, not_attempted: 0, accuracy: 0, avg_time_ms: 0, total_time_ms: 0
            },
            topic_performance: session.topic_performance || [],
            time_analysis: {
                avg_time_per_question: avgTime,
                target_time_per_question: targetTime,
                speed_multiplier: avgTime > 0 ? Number((targetTime / avgTime).toFixed(2)) : 0,
                recommendation
            },
            completed_at: session.completed_at,
            expired: session.expired,
            status: session.status
        };

        return NextResponse.json({
            success: true,
            summary
        });

    } catch (error) {
        console.error('Error fetching sprint summary:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
