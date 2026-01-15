import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import Question, { IQuestion } from "@/core/models/Question";
import Pattern from "@/core/models/Pattern";
import User from "@/core/models/User";
import Attempt from "@/core/models/Attempt";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Force Pattern model registration (prevents tree-shaking the import)
        // This is required for .populate() to work correctly
        void Pattern;

        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const section = searchParams.get("section");
        const difficulty = searchParams.get("difficulty");
        const status = searchParams.get("status");
        const query = searchParams.get("query");
        const filterType = searchParams.get("filter"); // 'bookmarked', 'wrong', 'unanswered'

        const skip = (page - 1) * limit;

        const filter: any = {
            is_verified: true, // Only show verified questions to users
        };

        // --- Auth Check for Personal Filters ---
        const authUser = await getCurrentUser();
        if (filterType && !authUser) {
            // If trying to access personal filters without auth, return empty or error
            // For now, let's just ignore the filter or return empty?
            // Better to return 401 if they explicitly asked for it, but for UI simplicity let's just match nothing
            // checking if user is trying to use a restricted filter
            if (['bookmarked', 'wrong'].includes(filterType)) {
                return NextResponse.json({ data: [], pagination: { total: 0, page, totalPages: 0 } });
            }
        }

        if (authUser && filterType === 'bookmarked') {
            const user = await User.findById(authUser.userId).select('bookmarks');
            if (user?.bookmarks?.length) {
                filter._id = { $in: user.bookmarks };
            } else {
                return NextResponse.json({ data: [], pagination: { total: 0, page, totalPages: 0 } });
            }
        } else if (authUser && filterType === 'wrong') {
            // Find all attempts by this user that were NOT correct
            // We want distinct question IDs.
            const wrongAttempts = await Attempt.find({
                u_id: authUser.userId,
                is_correct: false
            }).distinct('q_id');

            if (wrongAttempts.length > 0) {
                filter._id = { $in: wrongAttempts };
            } else {
                return NextResponse.json({ data: [], pagination: { total: 0, page, totalPages: 0 } });
            }
        } else if (authUser && filterType === 'correct') {
            const correctAttempts = await Attempt.find({
                u_id: authUser.userId,
                is_correct: true
            }).distinct('q_id');

            if (correctAttempts.length > 0) {
                filter._id = { $in: correctAttempts };
            } else {
                return NextResponse.json({ data: [], pagination: { total: 0, page, totalPages: 0 } });
            }
        } else if (authUser && filterType === 'unattempted') {
            const allAttempts = await Attempt.find({
                u_id: authUser.userId
            }).distinct('q_id');

            if (allAttempts.length > 0) {
                filter._id = { $nin: allAttempts };
            }
        }


        if (section) filter["source.section"] = section;
        if (difficulty) filter.difficulty = difficulty;
        if (status) filter.status = status;
        if (query) {
            // Text search on content text
            filter["content.text"] = { $regex: query, $options: "i" };
        }

        // Ensure we populate the Pattern to get the name
        const questions = await Question.find(filter)
            .populate("p_id", "name p_code") // Get Pattern Name
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Question.countDocuments(filter);

        const formattedQuestions = questions.map((q: any) => ({
            id: q._id,
            title: q.p_id?.name || q.content.text,
            pattern_code: q.p_id?.p_code,
            difficulty: q.difficulty,
            status: q.status, // This is 'CALIBRATION' etc. In UI we will mapping user's solved status separately
            acceptance: q.calibration?.accuracy_rate
                ? `${Math.round(q.calibration.accuracy_rate * 100)}%`
                : "N/A",
            source: `SSC CGL ${q.source.year}`,
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


