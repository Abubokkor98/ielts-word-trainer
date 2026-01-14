import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Get auth token from cookies
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/analytics', '/review', '/admin'];

  // Auth routes that should not be accessible if already authenticated
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  // Check if the current path starts with any of the protected routes
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If accessing auth route with token, redirect to dashboard
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
