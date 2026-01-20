
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from "@/core/db/connect";
import User from '@/core/models/User';
import GameAttempt from '@/core/models/GameAttempt';

export async function POST(req: NextRequest) {
    try {
        const token = await getCurrentUser();
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { gameId, score, category, difficulty, metrics } = await req.json();

        if (!gameId || typeof score !== 'number') {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(token.userId);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 1. Log the individual attempt (Architecture refinement)
        try {
            await GameAttempt.create({
                userId: user._id,
                gameId,
                category: category || 'QUANT',
                score,
                difficulty: difficulty || 'MEDIUM',
                metrics: metrics || {
                    totalQuestions: 10,
                    correctAnswers: Math.round(score / 20), // fallback estimation if missing
                    timeTaken: 0
                }
            });
        } catch (err) {
            console.error('Failed to log game attempt:', err);
            // Non-blocking for the summary update
        }

        // 2. Update summary in User model (Legacy/Performance lookup)
        const gameIndex = user.games.findIndex(g => g.gameId === gameId);

        let isNewBest = false;
        let bestScore = score;

        if (gameIndex > -1) {
            // Update existing
            const existing = user.games[gameIndex];
            existing.attempts += 1;
            existing.lastPlayed = new Date();

            if (score > existing.bestScore) {
                existing.bestScore = score;
                isNewBest = true;
            } else {
                bestScore = existing.bestScore;
            }

            user.games[gameIndex] = existing;
        } else {
            // Create new
            user.games.push({
                gameId,
                bestScore: score,
                attempts: 1,
                lastPlayed: new Date()
            });
            isNewBest = true;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            data: {
                gameId,
                bestScore,
                isNewBest
            }
        });

    } catch (error) {
        console.error('Save score error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
