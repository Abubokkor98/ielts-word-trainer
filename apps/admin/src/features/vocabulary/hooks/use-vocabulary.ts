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
    enabled: !!user && ['admin', 'super_admin', 'viewer'].includes(user.role),
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
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete word';
      toast({
        title: 'Action Not Allowed',
        description: message,
        status: 'warning',
        duration: 4000,
      });
    },
  });

  const uploadCSV = useMutation({
    mutationFn: vocabularyApi.uploadCSV,
    onSuccess: (data: any) => {
      const message = data?.message || 'Words imported successfully';
      toast({
        title: 'Import Complete',
        description: message,
        status: 'success',
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to import words';
      toast({
        title: 'Import Failed',
        description: message,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    },
  });

  const uploadCSVAtomic = useMutation({
    mutationFn: vocabularyApi.uploadCSVAtomic,
    onSuccess: (data: any) => {
      const message = data?.message || 'All words imported successfully';
      toast({
        title: 'Atomic Import Successful',
        description: message,
        status: 'success',
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Atomic import failed - no words were imported';
      toast({
        title: 'Atomic Import Failed',
        description: message,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    },
  });

  return {
    deleteWord,
    uploadCSV,
    uploadCSVAtomic,
  };
}
