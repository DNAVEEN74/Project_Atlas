import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';
import GameAttempt from '@/core/models/GameAttempt';
import { GAMES } from '@/components/games/games-config';

export async function GET() {
    try {
        const token = await getCurrentUser();
        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(token.userId);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const userGames = user.games || [];

        // 1. Basic Summary Stats
        const totalGamesPlayed = userGames.reduce((sum: number, g: { attempts: number }) => sum + g.attempts, 0);
        const uniqueGamesPlayed = userGames.length;
        const bestScores = userGames.map((g: { gameId: string; bestScore: number }) => g.bestScore);
        const highestScore = bestScores.length > 0 ? Math.max(...bestScores) : 0;
        const totalAttempts = userGames.reduce((sum: number, g: { attempts: number }) => sum + g.attempts, 0);

        // 2. Section-wise Breakdown (Quant vs Reasoning)
        const sectionStats = {
            QUANT: { totalPlays: 0, uniqueGames: 0, avgScore: 0, bestScore: 0 },
            REASONING: { totalPlays: 0, uniqueGames: 0, avgScore: 0, bestScore: 0 }
        };

        userGames.forEach((g: { gameId: string; bestScore: number; attempts: number }) => {
            const config = GAMES.find(c => c.id === g.gameId);
            if (!config) return;
            const section = config.category.toUpperCase() as 'QUANT' | 'REASONING';
            sectionStats[section].totalPlays += g.attempts;
            sectionStats[section].uniqueGames += 1;
            sectionStats[section].bestScore = Math.max(sectionStats[section].bestScore, g.bestScore);
        });

        // 3. Accuracy & Time Metrics from GameAttempts
        const aggregateStats = await GameAttempt.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: null,
                    totalCorrect: { $sum: "$metrics.correctAnswers" },
                    totalQuestions: { $sum: "$metrics.totalQuestions" },
                    totalTime: { $sum: "$metrics.timeTaken" },
                    avgScore: { $avg: "$score" },
                    difficultyEasy: { $sum: { $cond: [{ $eq: ["$difficulty", "EASY"] }, 1, 0] } },
                    difficultyMedium: { $sum: { $cond: [{ $eq: ["$difficulty", "MEDIUM"] }, 1, 0] } },
                    difficultyHard: { $sum: { $cond: [{ $eq: ["$difficulty", "HARD"] }, 1, 0] } }
                }
            }
        ]);

        const stats = aggregateStats[0] || {
            totalCorrect: 0,
            totalQuestions: 0,
            totalTime: 0,
            avgScore: 0,
            difficultyEasy: 0,
            difficultyMedium: 0,
            difficultyHard: 0
        };

        const averageScore = Math.round(stats.avgScore);
        const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

        // 4. Recent games (sorted by lastPlayed, most recent first)
        const recentGames = [...userGames]
            .sort((a: { lastPlayed: Date }, b: { lastPlayed: Date }) =>
                new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
            )
            .slice(0, 10)
            .map((entry: { gameId: string; bestScore: number; attempts: number; lastPlayed: Date }) => {
                const gameConfig = GAMES.find(g => g.id === entry.gameId);
                return {
                    gameId: entry.gameId,
                    gameName: gameConfig?.name || entry.gameId,
                    bestScore: entry.bestScore,
                    attempts: entry.attempts,
                    lastPlayed: entry.lastPlayed,
                    category: gameConfig?.category.toUpperCase() || 'QUANT'
                };
            });

        // Best scores map for game cards
        const bestScoresMap: Record<string, number> = {};
        userGames.forEach((g: { gameId: string; bestScore: number }) => {
            bestScoresMap[g.gameId] = g.bestScore;
        });

        // 5. 7-Day Performance Trend
        let weeklyTrend: { date: string; avgScore: number; count: number }[] = [];
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            const trendData = await GameAttempt.aggregate([
                {
                    $match: {
                        userId: user._id,
                        createdAt: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        avgScore: { $avg: "$score" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            weeklyTrend = trendData.map((d: { _id: string; avgScore: number; count: number }) => ({
                date: d._id,
                avgScore: Math.round(d.avgScore),
                count: d.count
            }));
        } catch (err) {
            console.error('Trend calculation error:', err);
        }

        return NextResponse.json({
            success: true,
            data: {
                totalGamesPlayed,
                uniqueGamesPlayed,
                totalGamesAvailable: GAMES.length,
                highestScore,
                averageScore,
                accuracy,
                totalTime: stats.totalTime,
                totalCorrect: stats.totalCorrect,
                totalQuestions: stats.totalQuestions,
                difficultyBreakdown: {
                    easy: stats.difficultyEasy,
                    medium: stats.difficultyMedium,
                    hard: stats.difficultyHard
                },
                sectionStats,
                bestScores: bestScoresMap,
                recentGames,
                weeklyTrend
            }
        });
    } catch (error) {
        console.error('Games stats error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
    }
}
