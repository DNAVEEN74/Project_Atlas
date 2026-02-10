import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Question from "@/core/models/Question";
import User from "@/core/models/User";
import Attempt from "@/core/models/Attempt";
import Bookmark from "@/core/models/Bookmark";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const section = searchParams.get("section");
        const difficulty = searchParams.get("difficulty");
        const pattern = searchParams.get("pattern");
        const year = searchParams.get("year");
        const query = searchParams.get("query");
        const filterType = searchParams.get("filter"); // 'bookmarked', 'wrong', 'unanswered'

        const skip = (page - 1) * limit;

        const filter: any = {
            is_live: true, // Only show live questions
        };

        // --- Auth Check for Personal Filters ---
        const authUser = await getCurrentUser();

        if (filterType && !authUser) {
            if (['bookmarked', 'wrong', 'unanswered'].includes(filterType)) {
                return NextResponse.json({ data: [], pagination: { total: 0, page, totalPages: 0 } });
            }
        }

        if (authUser && filterType === 'bookmarked') {
            const userBookmarks = await Bookmark.find({ user_id: authUser.userId }).distinct('question_id');
            if (userBookmarks.length) {
                filter._id = { $in: userBookmarks };
            } else {
                return NextResponse.json({ data: [], pagination: { total: 0, page, totalPages: 0 } });
            }
        } else if (authUser && filterType === 'wrong') {
            const wrongAttempts = await Attempt.find({
                user_id: authUser.userId,
                is_correct: false
            }).distinct('question_id');

            // We should also exclude questions solely answered correctly later?
            // "Wrong" usually means "I got this wrong at some point" or "My last attempt was wrong".
            // Let's stick to "Has a wrong attempt" for now, or maybe "Last attempt was wrong".
            // Simplest interpretation: Questions I have ever gotten wrong.

            if (wrongAttempts.length > 0) {
                filter._id = { $in: wrongAttempts };
            } else {
                return NextResponse.json({ data: [], pagination: { total: 0, page, totalPages: 0 } });
            }
        } else if (authUser && filterType === 'unanswered') {
            const allAttempts = await Attempt.find({
                user_id: authUser.userId
            }).distinct('question_id');

            if (allAttempts.length > 0) {
                filter._id = { $nin: allAttempts };
            }
        }

        if (section) filter.subject = section;
        if (difficulty) filter.difficulty = difficulty;
        if (pattern) filter.pattern = pattern;
        if (year) filter["source.year"] = parseInt(year);

        if (query) {
            filter.text = { $regex: query, $options: "i" };
        }

        const questions = await Question.find(filter)
            .sort({ "source.year": -1, created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Question.countDocuments(filter);

        const formattedQuestions = questions.map((q: any) => ({
            id: q._id,
            title: q.text.substring(0, 100) + (q.text.length > 100 ? "..." : ""),
            pattern: q.pattern,
            difficulty: q.difficulty,
            subject: q.subject,
            acceptance: q.stats?.accuracy_rate
                ? `${Math.round(q.stats.accuracy_rate * 100)}%`
                : "N/A",
            source: `${q.source.exam} ${q.source.year}`,
            is_live: q.is_live
        }));

        return NextResponse.json({
            data: formattedQuestions,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { error: "Failed to fetch questions" },
            { status: 500 }
        );
    }
}


