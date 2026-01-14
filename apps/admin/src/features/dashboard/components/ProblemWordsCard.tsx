import {
  Badge,
  Box,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useProblemWords } from '../hooks/use-dashboard-metrics';
import { Button, Card, CardContent } from '@ielts/ui';

export const ProblemWordsCard = () => {
  const router = useRouter();
  const { data: problemWords, isLoading } = useProblemWords(5);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Text>Loading problem words...</Text>
        </CardContent>
      </Card>
    );
  }

  // If no problem words, don't render anything or show empty state
  // Showing empty state is better for visibility
  if (!problemWords?.words || problemWords.words.length === 0) {
    return (
      <Card>
        <CardContent>
          <Heading size="md" mb={4}>
            Problem Words
          </Heading>
          <Text color="gray.500">
            No words currently meet the criteria for "Problem Words" (&lt;40%
            accuracy).
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Heading size="md">Problem Words</Heading>
            <Text fontSize="sm" color="gray.500">
              Lowest accuracy words (Top 5)
            </Text>
          </Box>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push('/dashboard/problem-words')}
          >
            View All
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Word</Th>
                <Th>Difficulty</Th>
                <Th isNumeric>Accuracy</Th>
                <Th isNumeric>Attempts</Th>
              </Tr>
            </Thead>
            <Tbody>
              {problemWords.words.map((pw) => (
                <Tr key={pw.wordId}>
                  <Td>
                    <Text fontWeight="bold">{pw.word}</Text>
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                      {pw.meaning}
                    </Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        pw.difficulty === 'beginner'
                          ? 'green'
                          : pw.difficulty === 'intermediate'
                          ? 'yellow'
                          : 'red'
                      }
                      fontSize="xs"
                    >
                      {pw.difficulty}
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    <Badge colorScheme="red">{pw.accuracy}%</Badge>
                  </Td>
                  <Td isNumeric>{pw.attempts}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};
