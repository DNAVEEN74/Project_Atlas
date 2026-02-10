import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Attempt from '@/core/models/Attempt';
import Bookmark from '@/core/models/Bookmark';
import Question from '@/core/models/Question';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = { id: currentUser.userId }; // Map to structure used below

        const { searchParams } = new URL(req.url);
        const section = searchParams.get('section') || 'ALL';

        // 1. Build Match Query for Attempts
        const matchQuery: any = { user_id: user.id };
        if (section !== 'ALL') {
            matchQuery.subject = section; // 'QUANT' or 'REASONING'
        }

        // 2. Fetch Attempts
        const attempts = await Attempt.find(matchQuery).lean();

        // 3. Process Attempts for Stats & Lists
        const solvedCorrectSet = new Set<string>();
        const solvedWrongSet = new Set<string>();
        let totalTime = 0;

        // Group by Difficulty for Dashboard
        const difficultyStats = {
            EASY: { solved: 0, total: 0, attempted: 0 },
            MEDIUM: { solved: 0, total: 0, attempted: 0 },
            HARD: { solved: 0, total: 0, attempted: 0 }
        };

        attempts.forEach((att: any) => {
            const qId = att.question_id.toString();
            const diff = att.difficulty as 'EASY' | 'MEDIUM' | 'HARD';

            if (att.is_correct) {
                solvedCorrectSet.add(qId);
                // Also remove from wrong set if they eventually got it right
                solvedWrongSet.delete(qId);

                if (diff && difficultyStats[diff]) {
                    // We need to count unique solved per difficulty? 
                    // The set ensures uniqueness globally, but for difficulty breakdown we iterate attempts.
                    // Ideally we track unique solved questions per difficulty.
                }
            } else {
                if (!solvedCorrectSet.has(qId)) {
                    solvedWrongSet.add(qId);
                }
            }
            totalTime += att.time_ms || 0;

            // For simple attempted count per difficulty (non-unique? or unique?)
            // Dashboard expects "Solved / Total".
        });

        const solvedCorrect = Array.from(solvedCorrectSet);
        const solvedWrong = Array.from(solvedWrongSet);
        const totalCorrect = solvedCorrect.length;
        const totalWrong = solvedWrong.length; // Approximate (unique questions wrong and never solved)
        const totalAttempted = totalCorrect + totalWrong; // Unique questions attempted

        // Re-calculate unique solved per difficulty
        // This requires looking up the difficulty of each unique solved question.
        // Attempts have filtered fields 'subject', 'pattern', 'difficulty'.
        // So we can use the attempt data.
        // We iterate unique solved IDs and find their difficulty from any attempt (assume constant).
        const uniqueSolvedMap = new Map<string, string>(); // qId -> difficulty
        attempts.forEach((att: any) => {
            if (att.is_correct) uniqueSolvedMap.set(att.question_id.toString(), att.difficulty || 'MEDIUM');
        });

        uniqueSolvedMap.forEach((diff) => {
            if (difficultyStats[diff as 'EASY' | 'MEDIUM' | 'HARD']) {
                difficultyStats[diff as 'EASY' | 'MEDIUM' | 'HARD'].solved++;
            }
        });


        // 4. Fetch Bookmarks
        // Bookmark model stores one document per bookmark, not a list in one doc.
        const bookmarkDocs = await Bookmark.find({ user_id: user.id }).lean();
        const bookmarks = bookmarkDocs.map((bm: any) => bm.question_id.toString());
        const bookmarkedCount = bookmarks.length;

        // 5. Fetch Totals (Active Questions Count) for Difficulty Breakdown (Dashboard)
        const totalQuery: any = { is_live: true };
        if (section !== 'ALL') {
            totalQuery.subject = section;
        }

        // We need totals by difficulty
        const totalsByDifficulty = {
            EASY: 0,
            MEDIUM: 0,
            HARD: 0,
            ALL: 0
        };

        // Use aggregation to count by difficulty
        const totalAgg = await Question.aggregate([
            { $match: totalQuery },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        totalAgg.forEach((grp) => {
            if (grp._id && totalsByDifficulty[grp._id as 'EASY' | 'MEDIUM' | 'HARD'] !== undefined) {
                totalsByDifficulty[grp._id as 'EASY' | 'MEDIUM' | 'HARD'] = grp.count;
            }
        });
        totalsByDifficulty.ALL = totalsByDifficulty.EASY + totalsByDifficulty.MEDIUM + totalsByDifficulty.HARD;


        // Response Assembly
        return NextResponse.json({
            success: true,
            data: {
                solvedCorrect,
                solvedWrong,
                bookmarks,
                stats: {
                    totalAttempted,
                    totalCorrect,
                    totalWrong,
                    accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0,
                    bookmarkedCount
                },
                difficultyBreakdown: {
                    EASY: { solved: difficultyStats.EASY.solved },
                    MEDIUM: { solved: difficultyStats.MEDIUM.solved },
                    HARD: { solved: difficultyStats.HARD.solved }
                },
                totalsByDifficulty
            }
        });

    } catch (error) {
        console.error('Progress API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
