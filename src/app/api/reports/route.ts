import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/core/db/connect";
import Report from "@/core/models/Report";
import { getCurrentUser, requireAdmin } from "@/lib/auth";

/**
 * POST /api/reports - Submit a question report
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

        await dbConnect();

        const body = await req.json();
        const { questionId, reason, description } = body;

        if (!questionId || !reason) {
            return NextResponse.json(
                { error: "questionId and reason are required" },
                { status: 400 }
            );
        }

        const report = await Report.create({
            user_id: new mongoose.Types.ObjectId(authUser.userId),
            question_id: new mongoose.Types.ObjectId(questionId),
            reason,
            description: description || undefined,
            status: 'PENDING',
        });

        return NextResponse.json({
            success: true,
            report: {
                id: report._id,
                status: report.status,
            },
        });
    } catch (error) {
        console.error("Create report error:", error);
        return NextResponse.json(
            { error: "Failed to submit report" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/reports - Get reports (admin: all pending, user: own reports)
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
        const status = searchParams.get('status');
        const isAdmin = searchParams.get('admin') === 'true';

        if (isAdmin) {
            // Admin role check
            const { error: authError } = await requireAdmin();
            if (authError) return authError;

            const query: any = {};
            if (status) query.status = status;

            const reports = await Report.find(query)
                .sort({ created_at: 1 })
                .populate('question_id', 'text pattern subject')
                .populate('user_id', 'profile.name email')
                .limit(100)
                .lean();

            return NextResponse.json({ data: reports });
        }

        // Regular user: own reports
        const reports = await Report.find({ user_id: authUser.userId })
            .sort({ created_at: -1 })
            .limit(50)
            .lean();

        return NextResponse.json({ data: reports });
    } catch (error) {
        console.error("Get reports error:", error);
        return NextResponse.json(
            { error: "Failed to fetch reports" },
            { status: 500 }
        );
    }
}
