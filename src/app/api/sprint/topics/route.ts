import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Pattern from '@/core/models/Pattern';
import Question from '@/core/models/Question';

/**
 * GET /api/sprint/topics - Get available topics for sprint setup
 * Query params: subject (QUANT | REASONING)
 */
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        void Pattern; // Force model registration

        const searchParams = req.nextUrl.searchParams;
        const subject = searchParams.get('subject') as 'QUANT' | 'REASONING';

        if (!subject) {
            return NextResponse.json(
                { error: 'Subject parameter required' },
                { status: 400 }
            );
        }

        // First, count all verified questions in this section
        const totalCount = await Question.countDocuments({
            is_verified: true,
            'source.section': subject
        });

        // Get all patterns that have at least one verified question in this section
        const questionPatterns = await Question.aggregate([
            {
                $match: {
                    is_verified: true,
                    'source.section': subject,
                    p_id: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: '$p_id',
                    count: { $sum: 1 }
                }
            }
        ]);

        const patternIds = questionPatterns.map(p => p._id);
        const patternCounts = questionPatterns.reduce((acc, p) => {
            acc[p._id.toString()] = p.count;
            return acc;
        }, {} as Record<string, number>);

        // Get pattern details
        const patterns = await Pattern.find({
            _id: { $in: patternIds }
        }).select('_id name p_code').lean();

        const topics = patterns.map(p => ({
            id: p._id.toString(),
            name: p.name,
            code: p.p_code,
            questionCount: patternCounts[p._id.toString()] || 0
        })).sort((a, b) => b.questionCount - a.questionCount);

        // If no patterns found but questions exist, provide an "All Questions" fallback
        if (topics.length === 0 && totalCount > 0) {
            topics.push({
                id: 'ALL',
                name: 'All Questions',
                code: 'ALL',
                questionCount: totalCount
            });
        }

        return NextResponse.json({
            success: true,
            subject,
            topics,
            totalQuestions: totalCount
        });

    } catch (error) {
        console.error('Error fetching topics:', error);
        return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 });
    }
}
