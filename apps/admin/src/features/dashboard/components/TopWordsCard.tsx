import {
  Badge,
  Box,
  Heading,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import { TrendingUp } from 'lucide-react';
import { useTopWords } from '../hooks/use-vocabulary-analytics';

export const TopWordsCard = () => {
  const { data, isLoading, isError } = useTopWords(10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Top Performing Words</Heading>
        </CardHeader>
        <CardContent>
          <VStack spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height="40px" w="full" />
            ))}
          </VStack>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Top Performing Words</Heading>
        </CardHeader>
        <CardContent>
          <Text color="red.500">Failed to load top words</Text>
        </CardContent>
      </Card>
    );
  }

  if (data.words.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Heading size="sm">Top Performing Words</Heading>
        </CardHeader>
        <CardContent>
          <Text color="gray.500">No top words data available (requires ≥10 attempts per word)</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="sm">
          <Box as="span" display="inline-flex" alignItems="center" gap={2}>
            <TrendingUp size={18} />
            Top Performing Words
          </Box>
        </Heading>
        <Text fontSize="xs" color="gray.500">
          Words with ≥80% accuracy (minimum 10 attempts)
        </Text>
      </CardHeader>
      <CardContent>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Word</Th>
                <Th>Meaning</Th>
                <Th>Difficulty</Th>
                <Th isNumeric>Accuracy</Th>
                <Th isNumeric>Attempts</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.words.map((word) => (
                <Tr key={word.wordId}>
                  <Td fontWeight="600">{word.word}</Td>
                  <Td maxW="300px" isTruncated color="gray.600">
                    {word.meaning}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        word.difficulty === 'beginner'
                          ? 'green'
                          : word.difficulty === 'intermediate'
                            ? 'blue'
                            : 'purple'
                      }
                      fontSize="xs"
                    >
                      {word.difficulty}
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    <Text fontWeight="600" color="green.600">
                      {word.accuracy}%
                    </Text>
                  </Td>
                  <Td isNumeric color="gray.600">
                    {word.attempts}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box mt={3} pt={3} borderTop="1px solid" borderColor="gray.200">
          <Text fontSize="xs" color="gray.500">
            Showing {data.words.length} of {data.count} top performing words
          </Text>
        </Box>
      </CardContent>
    </Card>
  );
};
