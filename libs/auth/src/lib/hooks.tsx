import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useAuthStore } from './auth.store';

const { useEffect } = React;
export const useAuth = (requireAuth = false) => {
  const { user, isAuthenticated, logout, hasHydrated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if hydration is complete and auth is required but missing
    if (hasHydrated && requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [requireAuth, isAuthenticated, hasHydrated, router, pathname]);

  return {
    user,
    isAuthenticated,
    logout,
    hasHydrated,
  };
};

export const useUserRole = () => {
  const { user } = useAuthStore();
  return user?.role || null;
};

export const protectUserRoute = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function ProtectedUserRoute(props: P) {
    const { user, isAuthenticated, hasHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      // Don't do anything until store is hydrated
      if (!hasHydrated) return;

      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'admin' || user?.role === 'super_admin') {
        // Redirect admins/super_admins to admin app
        if (typeof window !== 'undefined') {
          window.location.href = `${
            process.env['NEXT_PUBLIC_ADMIN_APP_URL'] || 'http://localhost:3001'
          }/dashboard`;
        }
      }
    }, [isAuthenticated, user, router, hasHydrated]);

    // Show nothing while rehydrating or if not authenticated
    if (!hasHydrated || !isAuthenticated || user?.role !== 'user') {
      return null;
    }

    return <Component {...props} />;
  };
};

export const protectAdminRoute = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function ProtectedAdminRoute(props: P) {
    const { user, isAuthenticated, hasHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      // Don't do anything until store is hydrated
      if (!hasHydrated) return;

      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'user') {
        // Redirect regular users to user app
        if (typeof window !== 'undefined') {
          window.location.href = `${
            process.env['NEXT_PUBLIC_USER_APP_URL'] || 'http://localhost:3000'
          }/dashboard`;
        }
      }
    }, [isAuthenticated, user, router, hasHydrated]);

    if (
      !hasHydrated ||
      !isAuthenticated ||
      !['admin', 'super_admin'].includes(user?.role || '')
    ) {
      return null;
    }

    return <Component {...props} />;
  };
};
