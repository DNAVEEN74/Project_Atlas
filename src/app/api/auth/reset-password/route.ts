import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        await dbConnect();

        // Hash the incoming raw token to compare with DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            password_reset_token: hashedToken,
            password_reset_expires: { $gt: new Date() }, // Not expired
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired reset link. Please request a new one.' }, { status: 400 });
        }

        // Hash new password and update
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(newPassword, salt);

        // Clear the reset token (single-use)
        user.password_reset_token = undefined;
        user.password_reset_expires = undefined;

        await user.save();

        return NextResponse.json({ success: true, message: 'Password reset successfully. You can now log in.' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
