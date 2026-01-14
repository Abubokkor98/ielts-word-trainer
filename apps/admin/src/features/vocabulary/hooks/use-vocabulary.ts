import { useToast } from '@chakra-ui/react';
import { useAuthStore } from '@ielts/auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vocabularyApi } from '../services/vocabulary.api';
import type { WordsQueryParams, WordsResponse } from '../types';

export function useVocabulary(params: WordsQueryParams) {
  const { user } = useAuthStore();

  return useQuery<WordsResponse>({
    queryKey: ['admin', 'words', params.page, params.search, params.difficulty],
    queryFn: () => vocabularyApi.getWords(params),
    enabled: !!user && ['admin', 'super_admin'].includes(user.role),
  });
}

export function useVocabularyCRUD() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const deleteWord = useMutation({
    mutationFn: vocabularyApi.deleteWord,
    onSuccess: () => {
      toast({ title: 'Word deleted successfully', status: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
    },
    onError: () => {
      toast({ title: 'Failed to delete word', status: 'error' });
    },
  });

  const uploadCSV = useMutation({
    mutationFn: vocabularyApi.uploadCSV,
    onSuccess: () => {
      toast({ title: 'Words imported successfully', status: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
    },
    onError: () => {
      toast({ title: 'Failed to import words', status: 'error' });
    },
  });

  return {
    deleteWord,
    uploadCSV,
  };
}
