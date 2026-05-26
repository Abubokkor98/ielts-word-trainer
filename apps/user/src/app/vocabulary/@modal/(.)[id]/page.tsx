'use client';

import { useAuthStore } from '@ielts/auth';
import { WordDetailsModal } from '@ielts/ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { safeDecodeURIComponent } from '@ielts/utils';

import type { VocabularyResponse } from '../../../../features/vocabulary/types';
import { vocabularyApi } from '../../../../features/vocabulary/services/vocabulary.api';
import { SaveToListButton } from '../../../../features/word-list/components/save-to-list-button';

interface InterceptedWordPageProps {
  params: Promise<{ id: string }>;
}

export default function InterceptedWordPage({ params }: InterceptedWordPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const decodedId = safeDecodeURIComponent(id);

  if (!decodedId) {
    router.replace('/vocabulary');
    return null;
  }
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Read the word instantly from TanStack Query's existing in-memory cache,
  // with a robust background-fetch fallback if it's not found (e.g. soft nav from dashboard).
  const { data: wordData } = useQuery({
    queryKey: ['word', decodedId],
    queryFn: () => vocabularyApi.getWordById(decodedId),
    initialData: () => {
      const cachedQueries = queryClient.getQueriesData<VocabularyResponse>({
        queryKey: ['words'],
      });

      for (const [, data] of cachedQueries) {
        const found = data?.words?.find(
          (word) =>
            word._id === decodedId || word.word.toLowerCase() === decodedId.toLowerCase()
        );
        if (found) return found;
      }

      return undefined;
    },
    enabled: !!decodedId,
    staleTime: 5 * 60 * 1000,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <WordDetailsModal
      isOpen={true}
      onClose={handleClose}
      word={wordData}
      headerAction={
        <SaveToListButton
          wordId={wordData?._id ?? ''}
          isAuthenticated={!!user}
        />
      }
    />
  );
}
