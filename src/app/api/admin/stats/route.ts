import { NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import Question from '@/core/models/Question';

// GET /api/admin/stats - Get collection-wide statistics
export async function GET() {
    try {
        console.log('[STATS API] Connecting to database...');
        await dbConnect();
        console.log('[STATS API] Connected successfully');

        // Get collection-wide counts using aggregation
        const stats = await Question.aggregate([
            {
                $facet: {
                    total: [{ $count: 'count' }],
                    verified: [
                        { $match: { is_verified: true } },
                        { $count: 'count' }
                    ],
                    unverified: [
                        { $match: { is_verified: { $ne: true } } },
                        { $count: 'count' }
                    ],
                    needsImages: [
                        { $match: { needs_image_review: true } },
                        { $count: 'count' }
                    ]
                }
            }
        ]);

        const result = {
            total: stats[0].total[0]?.count || 0,
            verified: stats[0].verified[0]?.count || 0,
            unverified: stats[0].unverified[0]?.count || 0,
            needImages: stats[0].needsImages[0]?.count || 0,
        };

        console.log('[STATS API] Collection stats:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('[STATS API] Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to fetch statistics', details: errorMessage },
            { status: 500 }
        );
    }
}
