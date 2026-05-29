'use client';

import { useAuthStore } from '@ielts/auth';
import { Pagination } from '@ielts/ui';
import { useRouter } from 'next/navigation';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useEffect } from 'react';

import { useDebounce } from '../../hooks/use-debounce';
import { VocabularyFilters } from './components/vocabulary-filters';
import { VocabularyList } from './components/vocabulary-list';
import { useVocabulary } from './hooks/use-vocabulary';
import type { Word } from './types';

const DIFFICULTY_OPTIONS = ['all', 'beginner', 'intermediate', 'advanced'] as const;
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
    { history: 'push' },
  );

  const debouncedWordSearch = useDebounce(filters.search, 500);
  const debouncedTopicSearch = useDebounce(filters.topic, 500);

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
    router.push(`/vocabulary/${encodeURIComponent(word.word.toLowerCase())}`, { scroll: false });
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
    <main className="dark w-full bg-background py-8 min-h-screen">
      <div className="container max-w-[1324px] px-6 mx-auto">
        <header className="mb-8 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-50 mb-2">
            Vocabulary Library
          </h1>
          <p className="text-lg text-zinc-400 mb-6">
            Explore and master essential IELTS vocabulary
          </p>

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
        </header>

        <VocabularyList
          isLoading={isFetching}
          words={words}
          onViewDetails={handleViewDetails}
          onClearFilters={handleClearFilters}
          hasActiveFilters={
            !!(filters.search || filters.topic || filters.difficulty !== 'all' || filters.module)
          }
        />

        {!isFetching && words.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={(newPage) => setFilters({ page: newPage })}
            />
          </div>
        )}
      </div>
    </main>
  );
}
