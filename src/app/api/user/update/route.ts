import { NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(req: Request) {
    try {
        const authUser = await getCurrentUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, targetExam, targetYear, dailyQuantGoal, dailyReasoningGoal, avatar_url } = body;

        if (!name || !targetExam) {
            return NextResponse.json({ error: 'Name and Target Exam are required' }, { status: 400 });
        }

        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(
            authUser.userId,
            {
                $set: {
                    'profile.name': name,
                    'profile.avatar_url': avatar_url,
                    'target_exam': targetExam,
                    'target_year': targetYear,
                    'preferences.daily_quant_goal': dailyQuantGoal,
                    'preferences.daily_reasoning_goal': dailyReasoningGoal
                }
            },
            { new: true }
        ).select('-password_hash');

        return NextResponse.json({
            success: true,
            user: {
                name: updatedUser?.profile.name,
                email: updatedUser?.email,
                avatar_url: updatedUser?.profile.avatar_url,
                targetExam: updatedUser?.target_exam,
                targetYear: updatedUser?.target_year,
                dailyQuantGoal: updatedUser?.preferences.daily_quant_goal,
                dailyReasoningGoal: updatedUser?.preferences.daily_reasoning_goal
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
