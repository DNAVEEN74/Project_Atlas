import { NextResponse } from 'next/server';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';
import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
        }

        await dbConnect();

        // fetch user with password_hash explicitly if it's not selected by default (though usually it is, or we findOne)
        // getCurrentUser returns simple user object, need to fetch document to save
        const userDoc = await User.findById(user.userId).select('+password_hash');

        if (!userDoc) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isValid = await verifyPassword(currentPassword, userDoc.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        userDoc.password_hash = await hashPassword(newPassword);
        await userDoc.save();

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
