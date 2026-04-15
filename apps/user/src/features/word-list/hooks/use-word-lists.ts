'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wordListApi } from '../services/word-list.api';

export const WORD_LISTS_QUERY_KEY = ['word-lists'] as const;

export function useWordLists(enabled = true) {
  return useQuery({
    queryKey: WORD_LISTS_QUERY_KEY,
    queryFn: wordListApi.getLists,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled,
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => wordListApi.createList(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORD_LISTS_QUERY_KEY });
    },
  });
}

export function useRenameList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, name }: { listId: string; name: string }) =>
      wordListApi.renameList(listId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORD_LISTS_QUERY_KEY });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => wordListApi.deleteList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORD_LISTS_QUERY_KEY });
    },
  });
}

export function useAddWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, wordId }: { listId: string; wordId: string }) =>
      wordListApi.addWord(listId, wordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORD_LISTS_QUERY_KEY });
    },
  });
}

export function useRemoveWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, wordId }: { listId: string; wordId: string }) =>
      wordListApi.removeWord(listId, wordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORD_LISTS_QUERY_KEY });
    },
  });
}
