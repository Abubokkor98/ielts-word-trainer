import { Box, Flex, Heading, Skeleton, Text } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import { useVocabularyOverview } from '../hooks/use-vocabulary-analytics';

export const DifficultyDistributionChart = () => {
  const { data: overview, isLoading, isError } = useVocabularyOverview();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Words by Difficulty</Heading>
        </CardHeader>
        <CardContent>
          <Skeleton height="280px" w="full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !overview) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Words by Difficulty</Heading>
        </CardHeader>
        <CardContent>
          <Text color="red.500">Failed to load difficulty distribution</Text>
        </CardContent>
      </Card>
    );
  }

  const { byDifficulty } = overview;

  const difficulties = [
    {
      name: 'Beginner',
      count: byDifficulty.beginner,
      color: 'green.500',
    },
    {
      name: 'Intermediate',
      count: byDifficulty.intermediate,
      color: 'blue.500',
    },
    {
      name: 'Advanced',
      count: byDifficulty.advanced,
      color: 'purple.500',
    },
  ];

  const total = difficulties.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card>
      <CardHeader>
        <Heading size="sm" mb={1}>
          Words by Difficulty
        </Heading>
        <Text fontSize="xs" color="gray.500">
          Learning progression distribution
        </Text>
      </CardHeader>
      <CardContent>
        <Flex direction="column" gap={4}>
          {difficulties.map((difficulty) => {
            const percentage = total > 0 ? (difficulty.count / total) * 100 : 0;
            return (
              <Box
                key={difficulty.name}
                p={4}
                bg="gray.50"
                _dark={{ bg: 'gray.800' }}
                borderRadius="lg"
                borderLeft="4px solid"
                borderColor={difficulty.color}
              >
                <Flex justify="space-between" align="center" mb={3}>
                  <Text fontSize="md" fontWeight="700" color="gray.900" _dark={{ color: 'white' }}>
                    {difficulty.name}
                  </Text>
                  <Flex align="baseline" gap={2}>
                    <Text fontSize="2xl" fontWeight="bold" color={difficulty.color}>
                      {difficulty.count.toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                      ({percentage.toFixed(1)}%)
                    </Text>
                  </Flex>
                </Flex>
                <Box
                  w="full"
                  h="12px"
                  bg="gray.200"
                  _dark={{ bg: 'gray.700' }}
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    h="full"
                    w={`${percentage}%`}
                    bg={difficulty.color}
                    borderRadius="full"
                    transition="width 0.5s ease-in-out"
                    boxShadow="sm"
                  />
                </Box>
              </Box>
            );
          })}
        </Flex>

        {/* Total summary */}
        <Box mt={4} p={3} bg="gray.100" _dark={{ bg: 'gray.900' }} borderRadius="md">
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="600" color="gray.700" _dark={{ color: 'gray.300' }}>
              Total (unique words)
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="gray.900" _dark={{ color: 'white' }}>
              {total.toLocaleString()}
            </Text>
          </Flex>
        </Box>
      </CardContent>
    </Card>
  );
};
