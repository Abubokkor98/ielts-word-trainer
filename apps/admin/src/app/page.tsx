'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { selectIsAuthenticated, useAuthStore } from '@ielts/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminHomePage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router, hasHydrated]);

  // Return null while hydrating (no flash of loading text)
  if (!hasHydrated) {
    return null;
  }

  // Return null while redirecting (cleaner UX)
  if (isAuthenticated) {
    return null;
  }

  // Show welcome page for unauthenticated users
  return (
    <Box
      minH="100vh"
      bg="gray.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="md">
        <VStack spacing={8} align="center" textAlign="center">
          <Heading as="h1" size="2xl" color="white">
            IELTS Admin Portal
          </Heading>

          <Text fontSize="lg" color="gray.400">
            Secure administration dashboard
          </Text>

          <Link href="/login">
            <Button size="lg" colorScheme="brand" px={12} mt={4}>
              Login
            </Button>
          </Link>
        </VStack>
      </Container>
    </Box>
  );
}
