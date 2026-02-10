import { NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Pattern from "@/core/models/Pattern";
import Question from "@/core/models/Question";

/**
 * GET /api/questions/patterns
 * Returns all patterns with their question counts.
 * Used for filter sidebars and sprint pickers.
 */
export async function GET() {
    try {
        await dbConnect();

        // Fetch all patterns
        const patterns = await Pattern.find({})
            .sort({ display_order: 1 })
            .lean();

        // Optionally, we could aggregate live question counts here to be strictly accurate,
        // but the Pattern model has a `question_count` field which is supposed to be updated on import.
        // For now, let's trust the Pattern model, but maybe do a quick aggregation if we want to be sure about *live* questions.
        // "question_count: number; // denormalized, updated on import" -> Let's use this for speed.

        // However, if we want to show counts of *available* (live) questions, an aggregation is safer given we just changed schema.
        // Let's do a fast aggregation.

        const counts = await Question.aggregate([
            { $match: { is_live: true } },
            { $group: { _id: "$pattern", count: { $sum: 1 } } }
        ]);

        const countMap = new Map(counts.map(c => [c._id, c.count]));

        const result = patterns.map((p: any) => ({
            id: p._id,
            code: p.code,
            name: p.name,
            subject: p.subject,
            count: countMap.get(p.code) || 0 // Use live count
        }));

        return NextResponse.json({
            data: result
        });
    } catch (error) {
        console.error("Get patterns error:", error);
        return NextResponse.json(
            { error: "Failed to fetch patterns" },
            { status: 500 }
        );
    }
}
