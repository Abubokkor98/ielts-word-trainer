import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';

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
