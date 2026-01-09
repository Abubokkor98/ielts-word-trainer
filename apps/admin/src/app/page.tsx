'use client';

import { useAuthStore } from '@ielts/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function AdminHomePage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in - stay on home to show welcome screen
      return;
    }

    if (user?.role === 'admin' || user?.role === 'super_admin') {
      // Admin user - redirect to dashboard
      router.push('/dashboard');
    } else if (user?.role === 'user') {
      // Regular user trying to access admin portal - redirect to user app
      const userAppUrl =
        process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3000';
      if (typeof window !== 'undefined') {
        window.location.href = userAppUrl;
      }
    }
  }, [isAuthenticated, user, router]);

  // Show loading state while redirecting authenticated users
  if (isAuthenticated) {
    return (
      <Box
        minH="100vh"
        bg="gray.900"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="gray.400">Redirecting...</Text>
      </Box>
    );
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
