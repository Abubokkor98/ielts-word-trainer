import { Badge, Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import type { ProblemWord } from '../../dashboard/types';
import { getDifficultyColorScheme } from '../../dashboard/utils/difficulty';
import { ProblemWordsTableSkeleton } from './ProblemWordsTableSkeleton';

interface ProblemWordsTableProps {
  isLoading: boolean;
  words: ProblemWord[];
}

export function ProblemWordsTable({
  isLoading,
  words,
}: ProblemWordsTableProps) {
  return (
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
          {isLoading ? (
            <ProblemWordsTableSkeleton />
          ) : (
            words.map((pw) => (
              <Tr key={pw.wordId}>
                <Td fontWeight="bold">{pw.word}</Td>
                <Td maxW="300px" isTruncated title={pw.meaning}>
                  {pw.meaning}
                </Td>
                <Td>
                  <Badge colorScheme={getDifficultyColorScheme(pw.difficulty)}>
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
                    ? new Date(pw.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
