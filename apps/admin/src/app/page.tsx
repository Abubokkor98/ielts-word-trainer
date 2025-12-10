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

  const userAppUrl =
    process.env.NEXT_PUBLIC_USER_APP_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!isAuthenticated) {
      // Not logged in - stay on home to show welcome screen
      return;
    }

    if (user?.role === 'admin') {
      // Admin user - redirect to dashboard
      router.push('/dashboard');
    } else if (user?.role === 'user') {
      // Regular user trying to access admin portal - redirect to user app
      if (typeof window !== 'undefined') {
        window.location.href = userAppUrl;
      }
    }
  }, [isAuthenticated, user, router, userAppUrl]);

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
    <Box minH="100vh" bg="gray.900" display="flex" alignItems="center">
      <Container maxW="4xl">
        <VStack spacing={8} align="center" textAlign="center">
          <Heading as="h1" size="3xl" color="white">
            IELTS Admin Portal
          </Heading>

          <Text fontSize="xl" color="gray.400" maxW="2xl">
            Secure administration dashboard for managing the IELTS Vocabulary
            Learning Platform. Access statistics, manage vocabulary, and oversee
            user activity.
          </Text>

          <VStack spacing={4} mt={8}>
            <Link href="/login">
              <Button size="lg" colorScheme="brand" px={12}>
                Admin Login
              </Button>
            </Link>

            <Text fontSize="sm" color="gray.500">
              Regular users? Visit the{' '}
              <a
                href={userAppUrl}
                style={{ color: '#4299e1', textDecoration: 'underline' }}
              >
                User Portal
              </a>
            </Text>
          </VStack>

          <Box
            mt={12}
            p={6}
            bg="gray.800"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.700"
          >
            <VStack spacing={3} align="start">
              <Heading size="sm" color="gray.300">
                Admin Features
              </Heading>
              <Text fontSize="sm" color="gray.400">
                • View platform statistics and analytics
              </Text>
              <Text fontSize="sm" color="gray.400">
                • Manage vocabulary database
              </Text>
              <Text fontSize="sm" color="gray.400">
                • Monitor user activity and progress
              </Text>
              <Text fontSize="sm" color="gray.400">
                • Generate reports and insights
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
