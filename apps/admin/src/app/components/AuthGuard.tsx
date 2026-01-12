'use client';

import { Box, Center, Spinner } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!['admin', 'super_admin'].includes(user?.role || '')) {
        // Redirect non-admins
        window.location.href = process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3000';
      }
    }
  }, [isAuthenticated, user, router, isMounted]);

  if (!isMounted) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!isAuthenticated || !['admin', 'super_admin'].includes(user?.role || '')) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
