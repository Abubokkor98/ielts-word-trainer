import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { vocabularyApi } from '../services/vocabulary.api';
import { VocabularyFilters } from '../types';

export function useVocabulary(filters: VocabularyFilters) {
  return useQuery({
    queryKey: [
      'words',
      filters.page,
      filters.difficulty,
      filters.search,
      filters.topic,
    ],
    queryFn: () => vocabularyApi.getWords(filters),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
