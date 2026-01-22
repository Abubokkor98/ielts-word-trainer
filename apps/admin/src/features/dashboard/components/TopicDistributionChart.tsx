import { Box, Flex, Heading, Skeleton, Text } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import { useVocabularyOverview } from '../hooks/use-vocabulary-analytics';

export const TopicDistributionChart = () => {
  const { data: overview, isLoading, isError } = useVocabularyOverview();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Words by Topic</Heading>
        </CardHeader>
        <CardContent>
          <Skeleton height="300px" w="full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !overview) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Words by Topic</Heading>
        </CardHeader>
        <CardContent>
          <Text color="red.500">Failed to load topic distribution</Text>
        </CardContent>
      </Card>
    );
  }

  const { byTopic } = overview;

  if (byTopic.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Words by Topic</Heading>
        </CardHeader>
        <CardContent>
          <Text color="gray.500">No topics found</Text>
        </CardContent>
      </Card>
    );
  }

  // Show top 8 topics for better visibility
  const topTopics = byTopic.slice(0, 8);
  const maxCount = Math.max(...topTopics.map((t) => t.count));

  const colors = [
    'blue.500',
    'green.500',
    'purple.500',
    'orange.500',
    'pink.500',
    'teal.500',
    'red.500',
    'cyan.500',
  ];
  return (
    <Card>
      <CardHeader>
        <Heading size="sm" mb={1}>
          Words by Topic
        </Heading>
        <Text fontSize="xs" color="gray.500">
          Top {topTopics.length} most populated topics
        </Text>
      </CardHeader>
      <CardContent>
        <Flex direction="column" gap={3}>
          {topTopics.map((topic, index) => {
            const percentage = maxCount > 0 ? (topic.count / maxCount) * 100 : 0;
            const color = colors[index % colors.length];

            return (
              <Box
                key={topic.topicId}
                p={3}
                bg="gray.50"
                _dark={{ bg: 'gray.800' }}
                borderRadius="lg"
                borderLeft="3px solid"
                borderColor={color}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.900"
                    _dark={{ color: 'white' }}
                    noOfLines={1}
                    flex="1"
                    mr={3}
                  >
                    {topic.topicName}
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color={color}>
                    {topic.count}
                  </Text>
                </Flex>
                <Box
                  w="full"
                  h="8px"
                  bg="gray.200"
                  _dark={{ bg: 'gray.700' }}
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    h="full"
                    w={`${percentage}%`}
                    bg={color}
                    borderRadius="full"
                    transition="width 0.5s ease-in-out"
                  />
                </Box>
              </Box>
            );
          })}
        </Flex>

        {byTopic.length > 8 && (
          <Box
            mt={3}
            p={2}
            bg="gray.100"
            _dark={{ bg: 'gray.900' }}
            borderRadius="md"
            textAlign="center"
          >
            <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.400' }}>
              +{byTopic.length - 8} more topics
            </Text>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
