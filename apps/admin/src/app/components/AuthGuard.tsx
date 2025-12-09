'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
import { Box, Spinner, Center } from '@chakra-ui/react';

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
      } else if (user?.role !== 'admin') {
        // Redirect non-admins
        window.location.href = 'http://localhost:3000';
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

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
