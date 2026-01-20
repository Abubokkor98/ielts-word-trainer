import {
  Badge,
  Box,
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
import { Card, CardContent, CardHeader } from '@ielts/ui';
import type { RecentAttempt } from '../types';

interface RecentAttemptsTableProps {
  attempts: RecentAttempt[];
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  // Full format for desktop
  const fullFormat = date
    .toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .replace(',', ' at');

  // Compact numeric format for mobile (1/19/26)
  const mobileDateOnly = date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });

  const timeOnly = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return { fullFormat, mobileDateOnly, timeOnly };
};

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
              {attempts.map((attempt) => {
                const { fullFormat, mobileDateOnly, timeOnly } = formatDateTime(
                  attempt.completedAt
                );

                return (
                  <Tr key={attempt._id}>
                    <Td color="gray.300">
                      {/* Desktop: Single line */}
                      <Text
                        display={{ base: 'none', md: 'block' }}
                        whiteSpace="nowrap"
                      >
                        {fullFormat}
                      </Text>
                      {/* Mobile: Stacked */}
                      <VStack
                        align="start"
                        spacing={0}
                        display={{ base: 'flex', md: 'none' }}
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          whiteSpace="nowrap"
                        >
                          {mobileDateOnly}
                        </Text>
                        <Text
                          fontSize="xs"
                          color="gray.400"
                          whiteSpace="nowrap"
                        >
                          {timeOnly}
                        </Text>
                      </VStack>
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
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
}
