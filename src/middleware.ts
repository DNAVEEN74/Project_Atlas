import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiter (per instance)
const rateLimit = new Map<string, { count: number; startTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const LIMITS = {
    GLOBAL: 300,     // Default: 300 req/min (5 per second)
    AUTH: 30,        // Auth routes: 30 req/min
    API: 600         // API: 600 req/min (10 per second) - allows rapid sprint/practice navigation
};

function checkRateLimit(ip: string, limit: number): boolean {
    const now = Date.now();
    const record = rateLimit.get(ip) || { count: 0, startTime: now };

    if (now - record.startTime > RATE_LIMIT_WINDOW) {
        record.count = 1;
        record.startTime = now;
    } else {
        record.count++;
    }

    rateLimit.set(ip, record);
    return record.count <= limit;
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('atlas_auth_token');
    const { pathname } = request.nextUrl;
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // 1. Rate Limiting
    let limit = LIMITS.GLOBAL;
    if (pathname.startsWith('/api/auth')) limit = LIMITS.AUTH;
    else if (pathname.startsWith('/api')) limit = LIMITS.API;

    if (!checkRateLimit(ip, limit)) {
        return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
            status: 429,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 2. Route Protection
    // Protected routes (Auth required)
    const protectedRoutes = [
        '/dashboard',
        '/bookmarks',
        '/submissions',
        '/sprint/session',
        '/sprint/summary',
        '/sprint/history',
        '/admin',
        '/settings',
        '/profile'
    ];
    // '/games/history' is also mentioned in doc, but let's stick to the list + evident ones.

    // Check if path starts with any protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Auth routes (Redirect to dashboard if logged in)
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url)); // Redirect to dashboard instead of problems
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
