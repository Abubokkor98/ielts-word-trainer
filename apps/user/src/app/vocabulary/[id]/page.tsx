import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { WordDetailsView } from '../../../features/vocabulary/components/word-details-view';
import { serverVocabularyApi } from '../../../features/vocabulary/services/server-vocabulary.api';

export const dynamicParams = true;

interface StandaloneWordPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    // Pre-render the top 100 most popular/critical words at build time for fast builds
    const words = await serverVocabularyApi.getWords(1, 100);

    if (words.length === 0) {
      return [];
    }

    return words.map((word) => ({
      id: word.word.toLowerCase(),
    }));
  } catch (error) {
    console.error('Failed to generate static params in build:', error);
    // Return empty array so build doesn't crash; all pages will render dynamically.
    return [];
  }
}

export async function generateMetadata({
  params,
}: StandaloneWordPageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const word = await serverVocabularyApi.getWordById(decodedId);

  if (!word) {
    return {
      title: 'Word Not Found',
    };
  }

  const capitalizedWord = word.word.charAt(0).toUpperCase() + word.word.slice(1);

  return {
    title: `Meaning of "${capitalizedWord}" - Definition & Examples`,
    description: `Master the word "${word.word}" (${word.partOfSpeech}) for IELTS Band 8+. Meaning: ${word.meaning}.`,
    alternates: {
      canonical: `/vocabulary/${encodeURIComponent(decodedId.toLowerCase())}`,
    },
  };
}

export default async function StandaloneWordPage({
  params,
}: StandaloneWordPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const word = await serverVocabularyApi.getWordById(decodedId);

  if (!word) {
    notFound();
  }

  return <WordDetailsView word={word} />;
}
