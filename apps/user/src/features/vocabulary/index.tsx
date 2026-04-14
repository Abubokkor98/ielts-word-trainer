'use client';

import { Box, Container, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { Pagination, WordDetailsModal } from '@ielts/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

import { useDebounce } from '../../hooks/use-debounce';
import { VocabularyFilters } from './components/vocabulary-filters';
import { VocabularyList } from './components/vocabulary-list';
import { useVocabulary } from './hooks/use-vocabulary';
import type { Word } from './types';
import { SaveToListButton } from '../word-list/components/save-to-list-button';

const DIFFICULTY_OPTIONS = [
  'all',
  'beginner',
  'intermediate',
  'advanced',
] as const;
const MODULE_OPTIONS = ['reading', 'writing', 'listening', 'speaking'] as const;

export function VocabularyContainer() {
  const [filters, setFilters] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      difficulty: parseAsStringLiteral(DIFFICULTY_OPTIONS).withDefault('all'),
      module: parseAsStringLiteral(MODULE_OPTIONS),
      search: parseAsString.withDefault(''),
      topic: parseAsString.withDefault(''),
    },
    { history: 'push' }
  );

  const debouncedWordSearch = useDebounce(filters.search, 500);
  const debouncedTopicSearch = useDebounce(filters.topic, 500);

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const { data, isFetching } = useVocabulary({
    page: filters.page,
    difficulty: filters.difficulty,
    module: filters.module ?? undefined,
    search: debouncedWordSearch,
    topic: debouncedTopicSearch,
  });

  const words = data?.words || [];
  const totalPages = data?.totalPages || 1;

  const handleViewDetails = (word: Word) => {
    setSelectedWord(word);
    onOpen();
  };

  const handleClearFilters = () => {
    setFilters({
      search: null,
      topic: null,
      difficulty: null,
      module: null,
      page: null,
    });
  };

  return (
    <Box bg="gray.900" py={8}>
      <Container maxW="7xl">
        <Box mb={8} textAlign={{ base: 'center', lg: 'left' }}>
          <Heading as="h1" size="2xl" color="gray.50" mb={2}>
            Vocabulary Library
          </Heading>
          <Text fontSize="lg" color="gray.400" mb={6}>
            Explore and master essential IELTS vocabulary
          </Text>

          <VocabularyFilters
            difficulty={filters.difficulty}
            onDifficultyChange={(diff) => {
              setFilters({ difficulty: diff, page: 1 });
            }}
            wordSearch={filters.search}
            onWordSearchChange={(val) => {
              setFilters({ search: val, page: 1 });
            }}
            topicSearch={filters.topic}
            onTopicSearchChange={(val) => {
              setFilters({ topic: val, page: 1 });
            }}
            module={filters.module ?? undefined}
            onModuleChange={(val) => {
              setFilters({ module: val ?? null, page: 1 });
            }}
          />
        </Box>

        <VocabularyList
          isLoading={isFetching}
          words={words}
          onViewDetails={handleViewDetails}
          onClearFilters={handleClearFilters}
          hasActiveFilters={
            !!(
              filters.search ||
              filters.topic ||
              filters.difficulty !== 'all' ||
              filters.module
            )
          }
        />

        {!isFetching && words.length > 0 && (
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={(newPage) => setFilters({ page: newPage })}
          />
        )}

        <WordDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          word={selectedWord}
          headerAction={
            <SaveToListButton
              wordId={selectedWord?._id ?? ''}
              isAuthenticated={!!user}
            />
          }
        />
      </Container>
    </Box>
  );
}
