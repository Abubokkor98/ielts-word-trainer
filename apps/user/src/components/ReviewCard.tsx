import {
  Box,
  Heading,
  Text,
  HStack,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { Card, CardHeader, CardContent } from '@ielts/ui';
import Link from 'next/link';

interface ReviewCardProps {
  stats: {
    dueToday: number;
    learning: number;
    reviewing: number;
    mastered: number;
    totalWords: number;
  };
}

export const ReviewCard = ({ stats }: ReviewCardProps) => {
  const isDue = stats.dueToday > 0;

  return (
    <Card
      bg="gradient"
      borderWidth="2px"
      borderColor={isDue ? 'brand.500' : 'green.500'}
      position="relative"
      overflow="hidden"
    >
      <CardHeader>
        <HStack justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <HStack mb={1}>
              <Text fontSize="2xl">{isDue ? '📝' : '🎉'}</Text>
              <Heading size="md" color="gray.50">
                {isDue ? 'Daily Review' : 'All Caught Up!'}
              </Heading>
            </HStack>
            <Text color="gray.400">
              {isDue
                ? `You have ${stats.dueToday} word${
                    stats.dueToday > 1 ? 's' : ''
                  } ready to review`
                : 'Great job! You have no words due for review right now.'}
            </Text>
          </Box>
          <Link href="/review" passHref>
            <Button
              size="lg"
              colorScheme={isDue ? 'brand' : 'green'}
              bg={isDue ? 'brand.500' : 'green.600'}
              _hover={{ bg: isDue ? 'brand.600' : 'green.700' }}
              isDisabled={!isDue}
              rightIcon={isDue ? <span>→</span> : undefined}
            >
              {isDue ? 'Start Review' : 'Review Ahead'}
            </Button>
          </Link>
        </HStack>
      </CardHeader>
      <CardContent>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mt={2}>
          <StatBox
            label="Learning"
            value={stats.learning}
            color="blue.400"
            bg="blue.900"
          />
          <StatBox
            label="Reviewing"
            value={stats.reviewing}
            color="yellow.400"
            bg="yellow.900"
          />
          <StatBox
            label="Mastered"
            value={stats.mastered}
            color="green.400"
            bg="green.900"
          />
          <StatBox
            label="Total Words"
            value={stats.totalWords}
            color="purple.400"
            bg="purple.900"
          />
        </SimpleGrid>
      </CardContent>
    </Card>
  );
};

const StatBox = ({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
}) => (
  <Box
    textAlign="center"
    p={3}
    bg="gray.800"
    borderRadius="lg"
    borderWidth="1px"
    borderColor="gray.700"
    transition="all 0.2s"
    _hover={{ borderColor: color, bg: bg }}
  >
    <Text color={color} fontSize="2xl" fontWeight="bold">
      {value || 0}
    </Text>
    <Text
      color="gray.400"
      fontSize="xs"
      fontWeight="bold"
      textTransform="uppercase"
    >
      {label}
    </Text>
  </Box>
);
