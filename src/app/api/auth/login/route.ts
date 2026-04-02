import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import User from "@/core/models/User";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { validateUserStreak } from "@/lib/streak";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Validate streak on login, but do not mark activity here.
        // Activity dates are updated from /api/attempts when a question is attempted.
        let userModified = false;
        if (user.stats) {
            const streakUpdated = validateUserStreak(user);
            if (streakUpdated) userModified = true;
        } else {
            // Fallback init if stats missing
            const today = new Date().toISOString().split('T')[0];
            user.stats = {
                total_solved: 0,
                total_correct: 0,
                current_streak: 0,
                max_streak: 0,
                last_active_date: today
            };
            userModified = true;
        }

        // Backfill username if missing (Lazy Migration)
        if (!user.profile?.username) {
            const baseUsername = user.email.split('@')[0];
            const uniqueSuffix = Math.floor(Math.random() * 10000);
            if (!user.profile) user.profile = { name: 'User', username: '' };
            user.profile.username = `${baseUsername}${uniqueSuffix}`;
            userModified = true;
        }

        if (userModified) {
            await user.save();
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        // Set cookie
        await setAuthCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.profile.name,
                username: user.profile.username,
                targetExam: user.target_exam,
                totalSolved: user.stats.total_solved,
                streak: user.stats.current_streak,
                maxStreak: user.stats.max_streak || 0,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Failed to login" },
            { status: 500 }
        );
    }
}
