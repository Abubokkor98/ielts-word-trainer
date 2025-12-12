'use client';

import { useAuthStore } from '@ielts/auth';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Box minH="100vh" bg="gray.900" py={16}>
      <Container maxW="7xl">
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <Box textAlign="center" py={12}>
            <Heading as="h1" size="3xl" color="white" mb={6}>
              Master IELTS Vocabulary
            </Heading>
            <Text fontSize="xl" color="gray.400" mb={8}>
              Learn 3000+ words with adaptive quizzes and spaced repetition
            </Text>

            {!isAuthenticated ? (
              <VStack spacing={4}>
                <Link href="/register">
                  <Button size="lg" colorScheme="brand" px={8}>
                    Get Started Free
                  </Button>
                </Link>
              </VStack>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" colorScheme="brand" px={8}>
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </Box>

          {/* Features Section */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} py={8}>
            <Box
              bg="gray.800"
              p={6}
              borderRadius="lg"
              textAlign="center"
              cursor="pointer"
              transition="all 0.3s ease"
              borderWidth="1px"
              borderColor="transparent"
              _hover={{
                transform: 'translateY(-8px)',
                bg: 'gray.750',
                borderColor: 'brand.400',
                boxShadow: '0 10px 30px rgba(30, 136, 229, 0.3)',
              }}
            >
              <Text fontSize="4xl" mb={4}>
                📚
              </Text>
              <Heading size="md" color="white" mb={3}>
                3000+ Words
              </Heading>
              <Text color="gray.400">
                Comprehensive IELTS vocabulary database with meanings, examples,
                and usage
              </Text>
            </Box>

            <Box
              bg="gray.800"
              p={6}
              borderRadius="lg"
              textAlign="center"
              cursor="pointer"
              transition="all 0.3s ease"
              borderWidth="1px"
              borderColor="transparent"
              _hover={{
                transform: 'translateY(-8px)',
                bg: 'gray.750',
                borderColor: 'brand.400',
                boxShadow: '0 10px 30px rgba(30, 136, 229, 0.3)',
              }}
            >
              <Text fontSize="4xl" mb={4}>
                🎯
              </Text>
              <Heading size="md" color="white" mb={3}>
                Adaptive Quizzes
              </Heading>
              <Text color="gray.400">
                Smart quizzes that adapt to your level and track your progress
              </Text>
            </Box>

            <Box
              bg="gray.800"
              p={6}
              borderRadius="lg"
              textAlign="center"
              cursor="pointer"
              transition="all 0.3s ease"
              borderWidth="1px"
              borderColor="transparent"
              _hover={{
                transform: 'translateY(-8px)',
                bg: 'gray.750',
                borderColor: 'brand.400',
                boxShadow: '0 10px 30px rgba(30, 136, 229, 0.3)',
              }}
            >
              <Text fontSize="4xl" mb={4}>
                📊
              </Text>
              <Heading size="md" color="white" mb={3}>
                Analytics
              </Heading>
              <Text color="gray.400">
                Detailed performance tracking and insights to improve faster
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
