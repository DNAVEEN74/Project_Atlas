import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Attempt from "@/core/models/Attempt";
import { getCurrentUser } from "@/lib/auth";

import Request from "next/server";
import Question from "@/core/models/Question";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        await dbConnect();

        console.log(`Fetching stats for user: ${authUser.userId}`);

        const stats = await Attempt.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(authUser.userId) } },
            {
                $facet: {
                    // General Stats
                    overall: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 },
                                correct: { $sum: { $cond: ["$is_correct", 1, 0] } },
                                totalTime: { $sum: "$time_ms" }
                            }
                        }
                    ],
                    // Topic Stats for Best/Worst
                    byTopic: [
                        {
                            $group: {
                                _id: "$pattern",
                                total: { $sum: 1 },
                                correct: { $sum: { $cond: ["$is_correct", 1, 0] } },
                                // Capture the subject from the first document in the group
                                subject: { $first: "$subject" }
                            }
                        },
                        {
                            $project: {
                                topic: "$_id",
                                total: 1,
                                correct: 1,
                                subject: 1, // Pass subject through
                                accuracy: {
                                    $cond: [
                                        { $eq: ["$total", 0] },
                                        0,
                                        { $multiply: [{ $divide: ["$correct", "$total"] }, 100] }
                                    ]
                                }
                            }
                        },
                        { $sort: { accuracy: -1, total: -1 } } // Sort by accuracy desc, then total desc
                    ]
                }
            }
        ]);

        // Fetch ALL available patterns from the Question collection
        // We group by pattern and take the first subject we find for that pattern
        const allPatterns = await Question.aggregate([
            {
                $group: {
                    _id: "$pattern",
                    subject: { $first: "$subject" }
                }
            }
        ]);

        const result = stats[0];
        const overall = result.overall[0] || { total: 0, correct: 0, totalTime: 0 };
        // User attempted topics
        const userTopics = result.byTopic;

        // Create a map of user stats for quick lookup
        const userStatsMap = new Map(userTopics.map((t: any) => [t.topic, t]));

        // Merge all patterns with user stats
        // If user hasn't attempted a pattern, provide default 0 vals
        const mergedTopics = allPatterns.map((p: any) => {
            const userStat = userStatsMap.get(p._id) as any;
            if (userStat) {
                return {
                    name: userStat.topic,
                    total: userStat.total,
                    correct: userStat.correct,
                    accuracy: Math.round(userStat.accuracy),
                    subject: userStat.subject
                };
            } else {
                return {
                    name: p._id,
                    total: 0,
                    correct: 0,
                    accuracy: 0,
                    subject: p.subject
                };
            }
        });

        // Calculate derived stats
        const wrong = overall.total - overall.correct;
        const accuracy = overall.total > 0 ? Math.round((overall.correct / overall.total) * 100) : 0;
        const wrongPct = overall.total > 0 ? Math.round((wrong / overall.total) * 100) : 0;
        const avgTimeSec = overall.total > 0 ? Math.round((overall.totalTime / overall.total) / 1000) : 0;

        // Best Topic: Highest accuracy, then most attempts
        // Worst Topic: Lowest accuracy, then most attempts (prioritize higher failure count)
        const sortedByAccuracy = [...userTopics].sort((a, b) => b.accuracy - a.accuracy || b.total - a.total);

        const bestTopic = sortedByAccuracy[0];

        // For worst topic, we want lowest accuracy first, but prefer higher total attempts
        // If we just take the last element of sortedByAccuracy (accuracy desc, total desc),
        // we get lowest accuracy, LOWEST total (e.g. 0% 1 attempt).
        // We want lowest accuracy, HIGHEST total (e.g. 0% 10 attempts).
        const sortedForWorst = [...userTopics].sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
        const worstTopic = sortedForWorst[0];

        return NextResponse.json({
            data: {
                total: overall.total,
                correct: overall.correct,
                correctPct: accuracy,
                wrong: wrong,
                wrongPct: wrongPct,
                avgTimeSec: avgTimeSec,
                bestTopic: bestTopic ? {
                    name: bestTopic.topic,
                    accuracy: Math.round(bestTopic.accuracy),
                    total: bestTopic.total,
                    correct: bestTopic.correct
                } : null,
                worstTopic: worstTopic ? {
                    name: worstTopic.topic,
                    accuracy: Math.round(worstTopic.accuracy),
                    total: worstTopic.total,
                    correct: worstTopic.correct
                } : null,
                allTopics: mergedTopics
            }
        });

    } catch (error) {
        console.error("Get attempts stats error:", error);
        return NextResponse.json(
            { error: "Failed to get stats" },
            { status: 500 }
        );
    }
}
