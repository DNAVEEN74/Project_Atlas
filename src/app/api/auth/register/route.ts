import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/core/db/connect";
import User from "@/core/models/User";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const {
            email,
            password,
            name,
            targetExam, // Optional in UI, default SSC_CGL
            dailyGoal   // Unified goal
        } = body;

        // Validation
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Email, password, and name are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists" },
                { status: 409 }
            );
        }

        // Generate username (simple for now)
        const baseUsername = email.split('@')[0];
        const uniqueSuffix = Math.floor(Math.random() * 10000);
        const username = `${baseUsername}${uniqueSuffix}`;

        // Hash password
        const password_hash = await hashPassword(password);

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            password_hash,
            profile: {
                name,
                username,
                avatar_url: '' // optional
            },
            target_exam: 'SSC_CGL', // Currently only one supported
            config: {
                is_premium: false
            },
            preferences: {
                daily_goal: Math.min(Math.max(dailyGoal || 5, 5), 100),
            },
            stats: {
                total_solved: 0,
                total_correct: 0,
                current_streak: 0,
                max_streak: 0,
                last_active_date: new Date().toISOString().split('T')[0]
            },
            role: 'USER'
        });

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
                dailyGoal: user.preferences.daily_goal,
            },
        });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to create account" },
            { status: 500 }
        );
    }
}
