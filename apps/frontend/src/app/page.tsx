import Link from 'next/link';
import { Button } from '@ielts/ui';
import {
  Box,
  Text,
  VStack,
  HStack,
  Container,
  SimpleGrid,
  Heading,
  Icon,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <Box bg="gray.900" minH="100vh">
      {/* Hero Section */}
      <Container maxW="7xl" pt={24} pb={20}>
        <VStack spacing={6} textAlign="center">
          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="bold"
            color="gray.50"
            lineHeight="1.2"
          >
            Master IELTS Vocabulary
          </Heading>
          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.400" maxW="2xl">
            Learn essential vocabulary with interactive quizzes and personalized
            learning paths designed for IELTS success
          </Text>
          <HStack spacing={4} pt={4}>
            <Link href="/vocabulary">
              <Button size="lg" px={8}>
                Start Learning
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" px={8}>
                Take a Quiz
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="7xl" pb={20}>
        <VStack spacing={12}>
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontWeight="bold"
            color="gray.50"
            textAlign="center"
          >
            Why Choose Our Platform?
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            {/* Feature 1 */}
            <Box
              bg="gray.800"
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.700"
              _hover={{
                borderColor: 'brand.600',
                transform: 'translateY(-4px)',
              }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={4}>
                <Box fontSize="4xl">📚</Box>
                <Heading as="h3" size="md" color="brand.400">
                  Rich Vocabulary
                </Heading>
                <Text color="gray.400">
                  Access hundreds of essential IELTS words categorized by topics
                  and difficulty levels
                </Text>
              </VStack>
            </Box>

            {/* Feature 2 */}
            <Box
              bg="gray.800"
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.700"
              _hover={{
                borderColor: 'brand.600',
                transform: 'translateY(-4px)',
              }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={4}>
                <Box fontSize="4xl">🎯</Box>
                <Heading as="h3" size="md" color="brand.400">
                  Interactive Quizzes
                </Heading>
                <Text color="gray.400">
                  Test your knowledge with engaging quizzes and track your
                  progress over time
                </Text>
              </VStack>
            </Box>

            {/* Feature 3 */}
            <Box
              bg="gray.800"
              p={8}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.700"
              _hover={{
                borderColor: 'brand.600',
                transform: 'translateY(-4px)',
              }}
              transition="all 0.2s"
            >
              <VStack align="start" spacing={4}>
                <Box fontSize="4xl">🚀</Box>
                <Heading as="h3" size="md" color="brand.400">
                  Smart Learning
                </Heading>
                <Text color="gray.400">
                  Adaptive learning system that focuses on words you need to
                  improve
                </Text>
              </VStack>
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
