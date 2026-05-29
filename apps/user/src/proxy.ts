import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session token
  const hasSession = !!request.cookies.get('refreshToken')?.value;

  // Define protected and auth routes
  const protectedRoutes = ['/dashboard', '/profile', '/analytics', '/review'];
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth routes to dashboard
  if (isAuthRoute && hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // For all other routes, continue
  const response = NextResponse.next();
  response.headers.set('x-middleware-passed', 'true');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
