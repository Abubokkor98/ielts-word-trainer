'use client';

import { useAuthStore } from '@ielts/auth';
import { WordDetailsModal } from '@ielts/ui';
import { useRouter } from 'next/navigation';
import { SaveToListButton } from '../../../../../features/word-list/components/save-to-list-button';
import type { Word } from '../../../../../features/vocabulary/types';

export function InterceptedModalClient({ word }: { word: Word }) {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleClose = () => {
    router.back();
  };

  return (
    <WordDetailsModal
      isOpen={true}
      onClose={handleClose}
      word={word}
      headerAction={<SaveToListButton wordId={word.id} isAuthenticated={!!user} />}
    />
  );
}
