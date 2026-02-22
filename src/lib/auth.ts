import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'atlas_auth_token';

export interface JWTPayload {
    userId: string;
    email: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
        return null;
    }
}

/**
 * Set auth cookie (server-side)
 */
export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: '/',
    });
}

/**
 * Get auth cookie (server-side)
 */
export async function getAuthCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

/**
 * Clear auth cookie (server-side)
 */
export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Get current user from cookie
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
    const token = await getAuthCookie();
    if (!token) return null;
    return verifyToken(token);
}

/**
 * Verify the current user is an admin. Returns { user, error? }.
 * If error is set, return it directly as the route response.
 */
export async function requireAdmin(): Promise<{ user: JWTPayload | null; error: NextResponse | null }> {
    const authUser = await getCurrentUser();
    if (!authUser) {
        return {
            user: null,
            error: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
        };
    }

    // Lazy import to avoid circular deps — only needed for admin check
    const dbConnect = (await import('@/core/db/connect')).default;
    const User = (await import('@/core/models/User')).default;

    await dbConnect();
    const user = await User.findById(authUser.userId).select('role').lean();

    if (!user || (user as any).role !== 'ADMIN') {
        return {
            user: null,
            error: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
        };
    }

    return { user: authUser, error: null };
}
