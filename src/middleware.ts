import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TODO: Implement distributed rate limiting using Redis (e.g. Upstash)

export function middleware(request: NextRequest) {
    const token = request.cookies.get('atlas_auth_token')?.value;
    const { pathname } = request.nextUrl;

    // 1. Rate Limiting (Removed in-memory limiter due to serverless incompatibility)

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

    // Auth routes (Redirect to problems if logged in)
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/problems', request.url));
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
