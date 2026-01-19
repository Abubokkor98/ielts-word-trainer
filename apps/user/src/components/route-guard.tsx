'use client';

import { selectIsAuthenticated, useAuthStore } from '@ielts/auth';
import { LoadingSpinner } from '@ielts/ui';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const protectedRoutes = ['/dashboard', '/profile', '/analytics', '/review'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();
  const pathname = usePathname();

  // Derive protected route status outside effect
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    // Only redirect if:
    // 1. Store has hydrated
    // 2. Current route is protected
    // 3. User is not authenticated
    if (!hasHydrated || !isProtectedRoute || isAuthenticated) return;

    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [hasHydrated, isAuthenticated, isProtectedRoute, pathname, router]);

  // Only show loading spinner for protected routes during hydration or auth check
  if (isProtectedRoute && (!hasHydrated || !isAuthenticated)) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
