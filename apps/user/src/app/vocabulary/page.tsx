import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VocabularyContainer } from '../../features/vocabulary';
import { VocabularyPageSkeleton } from '../../features/vocabulary/components/vocabulary-page-skeleton';

export const metadata: Metadata = {
  title: 'Vocabulary Library - IELTS Vocabs',
  description: 'Browse and search the complete IELTS word bank.',
};

export default function VocabularyPage() {
  return (
    <Suspense fallback={<VocabularyPageSkeleton />}>
      <VocabularyContainer />
    </Suspense>
  );
}
