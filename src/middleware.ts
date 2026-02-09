import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('atlas_auth_token');
    const { pathname } = request.nextUrl;

    // Protected routes
    // Protected routes
    const protectedRoutes = ['/dashboard', '/performance', '/settings', '/profile'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Auth routes (redirect to dashboard if already logged in)
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        // loginUrl.searchParams.set('from', pathname); // Optional: remember where they were
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
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - design-system-example (public page)
         * - / (home page)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|design-system-example|$).*)',
    ],
};
