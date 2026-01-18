'use client';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { selectIsAuthenticated, useAuthStore } from '@ielts/auth';
import Link from 'next/link';

export function HeroSection() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return (
    <Box textAlign="center" py={{ base: 8, md: 12, lg: 16 }} px={4}>
      <Heading
        as="h1"
        size={{ base: 'xl', md: '2xl', lg: '4xl' }}
        color="white"
        mb={{ base: 3, md: 6 }}
        lineHeight="shorter"
      >
        Master IELTS Vocabulary
      </Heading>
      <Text
        fontSize={{ base: 'md', md: 'xl' }}
        color="gray.400"
        mb={{ base: 6, md: 8 }}
        maxW="2xl"
        mx="auto"
      >
        Learn 3000+ words with adaptive quizzes and spaced repetition
      </Text>

      {!isAuthenticated ? (
        <VStack spacing={4}>
          <Link href="/login">
            <Button size={{ base: 'md', md: 'lg' }} colorScheme="blue" px={8}>
              Get Started Free
            </Button>
          </Link>
        </VStack>
      ) : (
        <Link href="/vocabulary">
          <Button size={{ base: 'md', md: 'lg' }} colorScheme="blue" px={8}>
            Start Learning Vocabs
          </Button>
        </Link>
      )}
    </Box>
  );
}
