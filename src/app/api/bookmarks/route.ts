import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Bookmark from "@/core/models/Bookmark";
import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/bookmarks - Get user bookmarks
 */
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

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const bookmarks = await Bookmark.find({ user_id: authUser.userId })
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .populate('question_id')
            .lean();

        const total = await Bookmark.countDocuments({ user_id: authUser.userId });

        // Transform to standardize response if needed, for now returning as is with populated question
        return NextResponse.json({
            data: bookmarks.map((b: any) => ({
                id: b._id,
                question: b.question_id,
                createdAt: b.created_at
            })),
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Get bookmarks error:", error);
        return NextResponse.json(
            { error: "Failed to get bookmarks" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/bookmarks/toggle - Toggle bookmark
 */
export async function POST(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            );
        }

        const { questionId } = await req.json();
        if (!questionId) {
            return NextResponse.json(
                { error: "Question ID required" },
                { status: 400 }
            );
        }

        await dbConnect();

        const existing = await Bookmark.findOne({
            user_id: authUser.userId,
            question_id: questionId
        });

        if (existing) {
            await Bookmark.deleteOne({ _id: existing._id });
            return NextResponse.json({ bookmarked: false });
        } else {
            await Bookmark.create({
                user_id: authUser.userId,
                question_id: questionId
            });
            return NextResponse.json({ bookmarked: true });
        }

    } catch (error) {
        console.error("Toggle bookmark error:", error);
        return NextResponse.json(
            { error: "Failed to toggle bookmark" },
            { status: 500 }
        );
    }
}
