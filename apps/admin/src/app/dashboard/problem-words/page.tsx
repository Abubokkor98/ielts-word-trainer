'use client';

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
  VStack,
} from '@chakra-ui/react';
import { Card, CardContent } from '@ielts/ui';
import { useProblemWords } from 'apps/admin/src/features/dashboard/hooks/use-dashboard-metrics';
import { getDifficultyColorScheme } from 'apps/admin/src/features/dashboard/utils/difficulty';

export default function ProblemWordsPage() {
  // Fetch up to 100 words for the detailed view
  const { data: problemWords, isLoading } = useProblemWords(100);

  return (
    <Box py={6} px={4} maxW="container.xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">Problem Words</Heading>
            <Text color="gray.500">
              Detailed analysis of words with low accuracy (&lt;40%) and high
              attempts
            </Text>
          </Box>
        </Flex>

        {/* Content */}
        {isLoading ? (
          <Card>
            <CardContent>
              <Text>Loading problem words data...</Text>
            </CardContent>
          </Card>
        ) : !problemWords || problemWords.words.length === 0 ? (
          <Card>
            <CardContent>
              <Heading size="md" mb={2}>
                No Problem Words Found
              </Heading>
              <Text color="gray.500">
                Great job! There are no words matching the criteria for "Problem
                Words" at this time.
              </Text>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Word</Th>
                      <Th>Meaning</Th>
                      <Th>Difficulty</Th>
                      <Th isNumeric>Accuracy</Th>
                      <Th isNumeric>Attempts</Th>
                      <Th>Last Updated</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {problemWords.words.map((pw) => (
                      <Tr key={pw.wordId}>
                        <Td fontWeight="bold">{pw.word}</Td>
                        <Td maxW="300px" isTruncated title={pw.meaning}>
                          {pw.meaning}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getDifficultyColorScheme(
                              pw.difficulty
                            )}
                          >
                            {pw.difficulty}
                          </Badge>
                        </Td>
                        <Td isNumeric>
                          <Badge colorScheme="red" fontSize="md">
                            {pw.accuracy}%
                          </Badge>
                        </Td>
                        <Td isNumeric fontWeight="semibold">
                          {pw.attempts}
                        </Td>
                        <Td fontSize="sm" color="gray.500">
                          {pw.lastUpdated
                            ? new Date(pw.lastUpdated).toLocaleDateString()
                            : '-'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardContent>
          </Card>
        )}
      </VStack>
    </Box>
  );
}
