import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';
import OtpStore from '@/core/models/OtpStore';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        // Block if email is already registered (any user, verified or not)
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return NextResponse.json({ error: 'This email is already registered. Please login.' }, { status: 409 });
        }

        const otp = generateOTP();
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Upsert into OtpStore — replaces any previous OTP for this email
        await OtpStore.findOneAndUpdate(
            { email: email.toLowerCase().trim() },
            { otp_hash: hashedOTP, expires_at: expiresAt },
            { upsert: true, new: true }
        );

        await resend.emails.send({
            from: 'PrepLeague <onboarding@resend.dev>',
            to: email,
            subject: 'Your PrepLeague verification code',
            html: `
                <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0f0f; color: #fff; border-radius: 16px;">
                    <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">Verify your email</h1>
                    <p style="color: #888; margin-bottom: 32px;">Enter this code to complete your PrepLeague registration:</p>
                    <div style="background: #1a1a1a; border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
                        <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #f59e0b;">${otp}</span>
                    </div>
                    <p style="color: #555; font-size: 13px;">This code expires in <strong style="color: #f59e0b;">10 minutes</strong>. If you didn't create a PrepLeague account, ignore this email.</p>
                    <hr style="border: 1px solid #222; margin: 32px 0;" />
                    <p style="color: #333; font-size: 12px;">PrepLeague — Your SSC CGL Prep Partner</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true, message: 'OTP sent to your email.' });

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }
}
