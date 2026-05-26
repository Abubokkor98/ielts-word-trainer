import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { VocabularyContainer } from '../../features/vocabulary';
import { VocabularyPageSkeleton } from '../../features/vocabulary/components/vocabulary-page-skeleton';
import { serverVocabularyApi } from '../../features/vocabulary/services/server-vocabulary.api';
import { getQueryClient } from '../../lib/get-query-client';

export const metadata: Metadata = {
  title: {
    absolute: 'IELTS Vocabulary Library - 3500+ Words for Reading & Writing',
  },
  description:
    'Browse, search, and filter the complete IELTS word bank by difficulty and exam module. Find the exact vocabulary words you need for a Band 8+.',
  keywords: [
    'IELTS word list',
    'IELTS reading vocabulary',
    'IELTS writing vocabulary',
    'advanced English words',
  ],
  alternates: {
    canonical: '/vocabulary',
  },
};

// Default filter values matching VocabularyContainer's initial state
const DEFAULT_PAGE = 1;
const DEFAULT_DIFFICULTY = 'all';
const DEFAULT_SEARCH = '';
const DEFAULT_TOPIC = '';

export default async function VocabularyPage() {
  const queryClient = getQueryClient();

  // Prefetch the first page of words on the server.
  // The queryKey must exactly match what useVocabulary produces for the default filters.
  await queryClient.prefetchQuery({
    queryKey: [
      'words',
      DEFAULT_PAGE,
      undefined, // limit
      DEFAULT_DIFFICULTY,
      DEFAULT_SEARCH,
      DEFAULT_TOPIC,
      undefined, // module
    ],
    queryFn: () => serverVocabularyApi.getWordsPage(DEFAULT_PAGE),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<VocabularyPageSkeleton />}>
        <VocabularyContainer />
      </Suspense>
    </HydrationBoundary>
  );
}
