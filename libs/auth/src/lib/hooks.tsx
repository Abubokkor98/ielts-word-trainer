import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import { useAuthStore } from './auth.store';

const { useEffect } = React;
export const useAuth = (requireAuth = false) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [requireAuth, isAuthenticated, router, pathname]);

  return {
    user,
    isAuthenticated,
    logout,
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
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'admin') {
        // Redirect admins to admin app
        if (typeof window !== 'undefined') {
          window.location.href = `${
            process.env['NEXT_PUBLIC_ADMIN_APP_URL'] || 'http://localhost:3001'
          }/dashboard`;
        }
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== 'user') {
      return null;
    }

    return <Component {...props} />;
  };
};

export const protectAdminRoute = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function ProtectedAdminRoute(props: P) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
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
    }, [isAuthenticated, user, router]);

    if (
      !isAuthenticated ||
      !['admin', 'super_admin'].includes(user?.role || '')
    ) {
      return null;
    }

    return <Component {...props} />;
  };
};
