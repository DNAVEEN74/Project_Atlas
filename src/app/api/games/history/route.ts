import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from "@/core/db/connect";
import GameAttempt from '@/core/models/GameAttempt';
import { GAMES } from '@/components/games/games-config';

export async function GET(req: NextRequest) {
    try {
        const token = await getCurrentUser();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const skip = (page - 1) * limit;

        await dbConnect();

        // Build query
        const query: any = { userId: token.userId };
        if (category && category !== 'ALL') query.category = category.toUpperCase();
        if (difficulty && difficulty !== 'ALL') query.difficulty = difficulty.toUpperCase();

        const attempts = await GameAttempt.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await GameAttempt.countDocuments(query);

        // Enrich with game metadata (names, colors)
        const enrichedAttempts = attempts.map(attempt => {
            const config = GAMES.find(g => g.id === attempt.gameId);
            return {
                ...attempt,
                gameName: config?.name || attempt.gameId,
                color: config?.color
            };
        });

        return NextResponse.json({
            success: true,
            data: enrichedAttempts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Fetch history error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
