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

        // Update last active and validate streak
        user.dash.last_active = new Date();
        validateUserStreak(user); // Validate streak here
        await user.save();

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
                targetExam: user.target.exam,
                targetYear: user.target.year,
                totalSolved: user.dash.total_solved,
                streak: user.dash.streak,
                maxStreak: user.dash.max_streak || 0,
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
