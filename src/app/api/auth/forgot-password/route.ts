import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import dbConnect from '@/core/db/connect';
import User from '@/core/models/User';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        // Always return success to prevent email enumeration
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (user) {
            // Generate raw token (sent in email)
            const rawToken = crypto.randomBytes(32).toString('hex');
            // Hash token before storing in DB
            const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

            user.password_reset_token = hashedToken;
            user.password_reset_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
            await user.save();

            const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}`;

            await resend.emails.send({
                from: 'PrepLeague <onboarding@resend.dev>',
                to: email,
                subject: 'Reset your PrepLeague password',
                html: `
                    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #0f0f0f; color: #fff; border-radius: 16px;">
                        <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">Reset your password</h1>
                        <p style="color: #888; margin-bottom: 32px;">We received a request to reset your PrepLeague account password.</p>
                        <a href="${resetUrl}" style="display: inline-block; background: #f59e0b; color: #000; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-size: 16px;">
                            Reset Password
                        </a>
                        <p style="color: #555; font-size: 13px; margin-top: 32px;">This link expires in <strong style="color: #f59e0b;">15 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
                        <hr style="border: 1px solid #222; margin: 32px 0;" />
                        <p style="color: #333; font-size: 12px;">PrepLeague — Your SSC CGL Prep Partner</p>
                    </div>
                `,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link shortly.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
