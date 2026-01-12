import Link from 'next/link';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';

export function HeroSection() {
  const { isAuthenticated } = useAuthStore();

  return (
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
            <Button size="lg" colorScheme="blue" px={8}>
              Get Started Free
            </Button>
          </Link>
        </VStack>
      ) : (
        <Link href="/vocabulary">
          <Button size="lg" colorScheme="blue" px={8}>
            Start Learning Vocabs
          </Button>
        </Link>
      )}
    </Box>
  );
}
