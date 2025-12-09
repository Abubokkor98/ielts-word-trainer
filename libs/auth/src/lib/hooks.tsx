import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

export const protectUserRoute = (Component: React.ComponentType<any>) => {
  return function ProtectedUserRoute(props: any) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'admin') {
        // Redirect admins to admin app
        if (typeof window !== 'undefined') {
          window.location.href = 'http://localhost:3001/dashboard';
        }
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== 'user') {
      return null;
    }

    return <Component {...props} />;
  };
};

export const protectAdminRoute = (Component: React.ComponentType<any>) => {
  return function ProtectedAdminRoute(props: any) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'user') {
        // Redirect regular users to user app
        if (typeof window !== 'undefined') {
          window.location.href = 'http://localhost:3000/dashboard';
        }
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== 'admin') {
      return null;
    }

    return <Component {...props} />;
  };
};
