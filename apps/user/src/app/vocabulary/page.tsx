import type { Metadata } from 'next';
import { VocabularyContainer } from '../../features/vocabulary';

export const metadata: Metadata = {
  title: 'Vocabulary Library - IELTS Vocabs',
  description: 'Browse and search the complete IELTS word bank.',
};

export default function VocabularyPage() {
  return <VocabularyContainer />;
}
