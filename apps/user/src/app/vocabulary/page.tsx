import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VocabularyContainer } from '../../features/vocabulary';
import { VocabularyPageSkeleton } from '../../features/vocabulary/components/vocabulary-page-skeleton';

export const metadata: Metadata = {
  title: 'IELTS Vocabulary Library - 3500+ Words for Reading & Writing',
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

export default function VocabularyPage() {
  return (
    <Suspense fallback={<VocabularyPageSkeleton />}>
      <VocabularyContainer />
    </Suspense>
  );
}
