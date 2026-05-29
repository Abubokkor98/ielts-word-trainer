'use client';

import { useAuthStore } from '@ielts/auth';
import { WordDetailsModal } from '@ielts/ui';
import { safeDecodeURIComponent } from '@ielts/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';
import { vocabularyApi } from '../../../../../features/vocabulary/services/vocabulary.api';
import type { VocabularyResponse } from '../../../../../features/vocabulary/types';
import { SaveToListButton } from '../../../../../features/word-list/components/save-to-list-button';

interface InterceptedWordPageProps {
  params: Promise<{ id: string }>;
}

export default function InterceptedWordPage({ params }: InterceptedWordPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const decodedId = safeDecodeURIComponent(id);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!decodedId) {
      router.replace('/vocabulary');
    }
  }, [decodedId, router]);

  const { data: wordData } = useQuery({
    queryKey: ['word', decodedId],
    queryFn: () => {
      if (!decodedId) {
        throw new Error('Word ID is required');
      }
      return vocabularyApi.getWordById(decodedId);
    },
    initialData: () => {
      if (!decodedId) {
        return undefined;
      }

      const cachedQueries = queryClient.getQueriesData<VocabularyResponse>({
        queryKey: ['words'],
      });

      for (const [, data] of cachedQueries) {
        const found = data?.words?.find(
          (word) => word._id === decodedId || word.word.toLowerCase() === decodedId.toLowerCase(),
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

  if (!decodedId) {
    return null;
  }

  return (
    <WordDetailsModal
      isOpen={true}
      onClose={handleClose}
      word={wordData}
      headerAction={<SaveToListButton wordId={wordData?._id ?? ''} isAuthenticated={!!user} />}
    />
  );
}
