import { useToast } from '@chakra-ui/react';
import { axiosInstance } from '@ielts/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { Word, WordFormData } from '../types';

interface UseWordMutationProps {
  initialData?: Word | null;
  onSuccess: () => void;
}

export function useWordMutation({
  initialData,
  onSuccess,
}: UseWordMutationProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: WordFormData) => {
      const payload = {
        ...data,
        synonyms: data.synonyms
          ? data.synonyms
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : [],
        antonyms: data.antonyms
          ? data.antonyms
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : [],
      };

      if (initialData?._id) {
        const response = await axiosInstance.patch(
          `/words/${initialData._id}`,
          payload
        );
        return response.data;
      } else {
        const response = await axiosInstance.post('/words', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      toast({
        title: initialData
          ? 'Word updated successfully'
          : 'Word added successfully',
        status: 'success',
        duration: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      onSuccess();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || 'Something went wrong';
      const isForbidden = error.response?.status === 403;

      toast({
        title: isForbidden
          ? 'Action Not Allowed'
          : initialData
          ? 'Failed to update word'
          : 'Failed to add word',
        description: message,
        status: isForbidden ? 'warning' : 'error',
        duration: 4000,
      });
    },
  });

  return mutation;
}
