import type { Metadata } from 'next';
import { VocabularyContainer } from '../../../features/vocabulary';
import { vocabularyData } from '../../../data/vocabulary';

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

export default async function VocabularyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  // 2. Extract Filters from URL
  const page = Number(params.page) || 1;
  const search = typeof params.search === 'string' ? params.search.toLowerCase() : '';
  const topicSlug = typeof params.topic === 'string' ? params.topic : '';
  const difficulty = typeof params.difficulty === 'string' ? params.difficulty : 'all';
  const moduleParam = typeof params.module === 'string' ? params.module : '';
  const limit = 12;

  // 3. Filter the Data in Memory
  let filteredWords = vocabularyData;

  if (search) {
    filteredWords = filteredWords.filter(w => 
      w.word.toLowerCase().includes(search) || 
      w.meaning.toLowerCase().includes(search) ||
      w.synonyms?.some(s => s.toLowerCase().includes(search))
    );
  }

  if (topicSlug) {
    filteredWords = filteredWords.filter(w => 
      w.topics?.some(t => t.slug === topicSlug)
    );
  }

  if (difficulty !== 'all') {
    filteredWords = filteredWords.filter(w => w.difficulty === difficulty);
  }

  if (moduleParam) {
    filteredWords = filteredWords.filter(w => 
      w.modules?.includes(moduleParam as 'reading' | 'writing' | 'listening' | 'speaking')
    );
  }

  // 4. Paginate
  const startIndex = (page - 1) * limit;
  const paginatedWords = filteredWords.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(filteredWords.length / limit) || 1;

  // 5. Pass only the paginated slice to the Client Component
  return (
    <VocabularyContainer 
      initialWords={paginatedWords} 
      totalPages={totalPages} 
    />
  );
}
