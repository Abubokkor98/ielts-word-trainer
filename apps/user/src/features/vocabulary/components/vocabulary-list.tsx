'use client';

import { Badge, Box, Button, Heading, HStack, SimpleGrid, Skeleton, Text } from '@chakra-ui/react';
import { Card, CardContent, CardFooter, CardHeader } from '@ielts/ui';
import type { Word } from '../types';

interface VocabularyListProps {
  isLoading: boolean;
  words: Word[];
  onViewDetails: (word: Word) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const difficultyColors: Record<string, string> = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'purple',
};

export function VocabularyList({
  isLoading,
  words,
  onViewDetails,
  onClearFilters,
  hasActiveFilters,
}: VocabularyListProps) {
  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} height="220px" borderRadius="md" />
        ))}
      </SimpleGrid>
    );
  }

  if (words.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text color="gray.400" fontSize="lg">
          No vocabulary found matching your criteria.
        </Text>
        {hasActiveFilters && (
          <Button mt={4} variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {words.map((word) => (
        <Card key={word._id}>
          <CardHeader>
            <HStack justify="space-between" align="start">
              <Heading as="h3" size="md" color="brand.400">
                {word.word}
              </Heading>
              <Badge colorScheme={difficultyColors[word.difficulty] || 'gray'}>
                {word.difficulty}
              </Badge>
            </HStack>
          </CardHeader>
          <CardContent>
            <Text color="gray.300" noOfLines={2} fontSize="sm">
              {word.meaning}
            </Text>
            <Text color="gray.500" fontSize="xs" mt={2}>
              Example: {word.exampleSentence}
            </Text>
          </CardContent>
          <CardFooter>
            <Button width="100%" size="sm" onClick={() => onViewDetails(word)}>
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </SimpleGrid>
  );
}
