'use client';

import { useAuthStore } from '@ielts/auth';
import { LoadingSpinner } from '@ielts/ui';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const protectedRoutes = ['/dashboard', '/profile', '/analytics', '/review'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for hydration
    if (!hasHydrated) return;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    } else {
      setIsChecking(false);
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  // Show loading state while checking auth
  if (isChecking || !hasHydrated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
