import { NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Question from "@/core/models/Question";

export async function GET() {
    try {
        await dbConnect();

        // Aggregate to get counts per pattern (topic)
        // Only count live questions
        const stats = await Question.aggregate([
            { $match: { is_live: true, pattern: { $ne: null } } },
            { $group: { _id: "$pattern", count: { $sum: 1 } } }
        ]);

        // Transform into a map for easier lookup: { "percentage": 10, "algebra": 5 }
        const topicCounts: Record<string, number> = {};
        stats.forEach((item) => {
            if (item._id) {
                topicCounts[item._id] = item.count;
            }
        });

        return NextResponse.json({ data: topicCounts });
    } catch (error) {
        console.error("Error fetching topic stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats", data: {} }, { status: 500 });
    }
}
