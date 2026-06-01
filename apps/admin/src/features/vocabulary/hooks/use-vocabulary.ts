import { useToast } from '@ielts/ui';
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteWord = useMutation({
    mutationFn: vocabularyApi.deleteWord,
    onSuccess: () => {
      toast({ title: 'Word deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete word';
      const isForbidden = error?.response?.status === 403;

      toast({
        title: isForbidden ? 'Action Not Allowed' : 'Failed to delete word',
        description: message,
        variant: 'destructive',
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
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to import words';
      toast({
        title: 'Import Failed',
        description: message,
        variant: 'destructive',
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
        variant: 'destructive',
      });
    },
  });

  return {
    deleteWord,
    uploadCSV,
    uploadCSVAtomic,
  };
}

