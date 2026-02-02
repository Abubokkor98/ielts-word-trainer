'use client';

import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { Card, CardContent } from '@ielts/ui';
import { useProblemWords } from '../dashboard/hooks/use-dashboard-metrics';
import { ProblemWordsTable } from './components/ProblemWordsTable';

export function ProblemWordsContainer() {
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
        {!isLoading && (!problemWords || problemWords.words.length === 0) ? (
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
              <ProblemWordsTable
                isLoading={isLoading}
                words={problemWords?.words || []}
              />
            </CardContent>
          </Card>
        )}
      </VStack>
    </Box>
  );
}
