import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { Card, CardHeader, CardContent } from '@ielts/ui';
import { RecentAttempt } from '../types';

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
                  <Td color="gray.300">
                    {new Date(attempt.completedAt).toLocaleDateString()}
                  </Td>
                  <Td>
                    <Badge>
                      {attempt.difficulty?.toUpperCase() || 'MIXED'}
                    </Badge>
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
