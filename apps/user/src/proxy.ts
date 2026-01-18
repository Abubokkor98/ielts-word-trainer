import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only redirect auth routes if user has a token cookie
  // (prevents logged-in users from seeing login page)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute) {
    const token = request.cookies.get('accessToken')?.value;
    if (token) {
      // User appears to be logged in, redirect to dashboard
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // For all other routes, let React handle auth
  // Add header to indicate middleware passed
  const response = NextResponse.next();
  response.headers.set('x-middleware-passed', 'true');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
