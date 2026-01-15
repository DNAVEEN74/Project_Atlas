import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import Attempt from '@/core/models/Attempt';

export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const result = searchParams.get('result'); // 'correct' | 'wrong'
        const topic = searchParams.get('topic');
        const difficulty = searchParams.get('difficulty');

        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = { u_id: authUser.userId };

        if (result === 'correct') {
            filter.is_correct = true;
        } else if (result === 'wrong') {
            filter.is_correct = false;
        }

        // For topic/difficulty, we'll need to populate and filter (more complex)
        // For now, basic implementation

        const [attempts, total] = await Promise.all([
            Attempt.find(filter)
                .populate({
                    path: 'q_id',
                    select: 'content.text difficulty source pattern',
                    populate: {
                        path: 'p_id',
                        select: 'name p_code'
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Attempt.countDocuments(filter)
        ]);

        // Post-filter by topic/difficulty if needed
        let filtered = attempts;
        if (topic || difficulty) {
            filtered = attempts.filter((attempt: any) => {
                if (!attempt.q_id) return false;
                if (topic && attempt.q_id.pattern?.topic !== topic) return false;
                if (difficulty && attempt.q_id.difficulty !== difficulty) return false;
                return true;
            });
        }

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: filtered,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}
