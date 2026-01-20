'use client';

import { Box, Container, Heading, Text, useDisclosure } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { Pagination, WordDetailsModal } from '@ielts/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useDebounce } from '../../hooks/use-debounce';
import type { DifficultyLevel } from '../../types';
import { VocabularyFilters } from './components/vocabulary-filters';
import { VocabularyList } from './components/vocabulary-list';
import { useVocabulary } from './hooks/use-vocabulary';
import type { Word } from './types';

export function VocabularyContainer() {
  const [page, setPage] = useState(1);
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [module, setModule] = useState<
    'reading' | 'writing' | 'listening' | 'speaking' | undefined
  >(undefined);
  const [wordSearchQuery, setWordSearchQuery] = useState('');
  const [topicSearchQuery, setTopicSearchQuery] = useState('');

  const debouncedWordSearch = useDebounce(wordSearchQuery, 500);
  const debouncedTopicSearch = useDebounce(topicSearchQuery, 500);

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Auth check logic retained from original page
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  const { data, isFetching } = useVocabulary({
    page,
    difficulty,
    module,
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
    setWordSearchQuery('');
    setTopicSearchQuery('');
    setDifficulty('all');
    setModule(undefined);
    setPage(1);
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
            difficulty={difficulty}
            onDifficultyChange={(diff) => {
              setDifficulty(diff);
              setPage(1);
            }}
            wordSearch={wordSearchQuery}
            onWordSearchChange={(val) => {
              setWordSearchQuery(val);
              setPage(1);
            }}
            topicSearch={topicSearchQuery}
            onTopicSearchChange={(val) => {
              setTopicSearchQuery(val);
              setPage(1);
            }}
            module={module}
            onModuleChange={(val) => {
              setModule(val);
              setPage(1);
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
              wordSearchQuery ||
              topicSearchQuery ||
              difficulty !== 'all' ||
              module
            )
          }
        />

        {!isFetching && words.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <WordDetailsModal
          isOpen={isOpen}
          onClose={onClose}
          word={selectedWord}
        />
      </Container>
    </Box>
  );
}
