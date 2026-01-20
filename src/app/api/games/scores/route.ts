
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from "@/core/db/connect";
import User from '@/core/models/User';

export async function GET(req: NextRequest) {
    try {
        const token = await getCurrentUser();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(token.userId).select('games');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Convert games array to a map for easy lookup on frontend
        const scoresMap: Record<string, number> = {};
        user.games.forEach(g => {
            scoresMap[g.gameId] = g.bestScore;
        });

        return NextResponse.json({
            success: true,
            data: scoresMap
        });

    } catch (error) {
        console.error('Fetch scores error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
