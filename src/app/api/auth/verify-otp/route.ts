import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/core/db/connect';
import OtpStore from '@/core/models/OtpStore';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        await dbConnect();

        const hashedOTP = crypto.createHash('sha256').update(otp.toString()).digest('hex');

        const record = await OtpStore.findOne({
            email: email.toLowerCase().trim(),
            otp_hash: hashedOTP,
            expires_at: { $gt: new Date() },
        });

        if (!record) {
            return NextResponse.json({ error: 'Invalid or expired OTP. Please request a new one.' }, { status: 400 });
        }

        // Delete on success — OTP is single-use
        await OtpStore.deleteOne({ _id: record._id });

        return NextResponse.json({ success: true, verified: true });

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
