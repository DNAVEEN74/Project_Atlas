import { NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find user and update subscription status
        const updatedUser = await User.findOneAndUpdate(
            { _id: user.userId },
            {
                $set: {
                    'subscription.status': 'CANCELLED'
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Subscription cancelled successfully.',
            subscription: updatedUser.subscription
        });

    } catch (error) {
        console.error('Error cancelling subscription:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
