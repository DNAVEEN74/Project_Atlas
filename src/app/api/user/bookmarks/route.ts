import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import { getCurrentUser } from '@/lib/auth';
import User from '@/core/models/User';
import Question from '@/core/models/Question';

export async function GET(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findById(authUser.userId).select('bookmarks');
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user wants full question objects or just IDs
        const searchParams = req.nextUrl.searchParams;
        const full = searchParams.get('full') === 'true';

        if (full && user.bookmarks.length > 0) {
            const questions = await Question.find({ _id: { $in: user.bookmarks } })
                .populate('p_id', 'name p_code')
                .select('content.text difficulty source p_id')
                .lean();

            return NextResponse.json({
                success: true,
                bookmarks: user.bookmarks,
                questions
            });
        }

        return NextResponse.json({
            success: true,
            bookmarks: user.bookmarks || []
        });
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { questionId, action } = await req.json();
        if (!questionId || !['add', 'remove'].includes(action)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(authUser.userId);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (action === 'add') {
            if (!user.bookmarks.includes(questionId)) {
                user.bookmarks.push(questionId);
            }
        } else if (action === 'remove') {
            user.bookmarks = user.bookmarks.filter((id: any) => id.toString() !== questionId);
        }

        await user.save();

        return NextResponse.json({
            success: true,
            bookmarks: user.bookmarks,
            message: action === 'add' ? 'Bookmark added' : 'Bookmark removed'
        });
    } catch (error) {
        console.error('Error updating bookmarks:', error);
        return NextResponse.json({ error: 'Failed to update bookmark' }, { status: 500 });
    }
}
