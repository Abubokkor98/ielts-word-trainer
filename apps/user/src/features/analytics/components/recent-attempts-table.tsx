import { Badge, Box, Heading, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Card, CardContent, CardHeader } from '@ielts/ui';
import type { RecentAttempt } from '../types';

interface RecentAttemptsTableProps {
  attempts: RecentAttempt[];
}

export function RecentAttemptsTable({ attempts }: RecentAttemptsTableProps) {
  if (!attempts || attempts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="gray.50">
          Recent Attempts
        </Heading>
      </CardHeader>
      <CardContent>
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th color="gray.400">Date</Th>
                <Th color="gray.400">Difficulty</Th>
                <Th color="gray.400" isNumeric>
                  Score
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {attempts.map((attempt) => (
                <Tr key={attempt._id}>
                  <Td color="gray.300">{new Date(attempt.completedAt).toLocaleDateString()}</Td>
                  <Td>
                    <Badge>{attempt.difficulty?.toUpperCase() || 'MIXED'}</Badge>
                  </Td>
                  <Td color="gray.300" isNumeric>
                    {attempt.score}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}
