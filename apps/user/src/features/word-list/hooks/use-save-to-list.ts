'use client';

import { useToast } from '@ielts/ui';
import { useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { wordListApi } from '../services/word-list.api';
import { useAddWord, useWordLists, WORD_LISTS_QUERY_KEY } from './use-word-lists';

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

interface UseSaveToListParams {
  wordId: string;
  isAuthenticated: boolean;
}

export function useSaveToList({ wordId, isAuthenticated }: UseSaveToListParams) {
  const { data: lists = [] } = useWordLists(isAuthenticated);
  const queryClient = useQueryClient();
  const addWord = useAddWord();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isBookmarked = lists.some((list) => list.words.some((w) => w._id === wordId));

  const listsContainingWord = new Set(
    lists.filter((list) => list.words.some((w) => w._id === wordId)).map((list) => list._id),
  );

  const handleAddToList = async (listId: string, listName: string) => {
    try {
      await addWord.mutateAsync({ listId, wordId });
      toast({
        title: `Saved to "${listName}"`,
      });
      setIsOpen(false);
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Failed to save word'),
        variant: 'destructive',
      });
    }
  };

  const handleCreateAndAdd = async () => {
    if (isCreating) return;
    const trimmedName = newListName.trim();
    if (!trimmedName) return;

    setIsCreating(true);
    try {
      const newList = await wordListApi.createList(trimmedName);
      await wordListApi.addWord(newList._id, wordId);

      await queryClient.invalidateQueries({ queryKey: WORD_LISTS_QUERY_KEY });

      setNewListName('');
      setShowCreateInput(false);
      setIsOpen(false);
      toast({
        title: `Created "${trimmedName}" and saved word`,
      });
    } catch (error: unknown) {
      setNewListName('');
      setShowCreateInput(false);
      await queryClient.invalidateQueries({ queryKey: WORD_LISTS_QUERY_KEY });
      toast({
        title: getErrorMessage(error, 'Something went wrong'),
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateAndAdd();
    }
    if (e.key === 'Escape') {
      setShowCreateInput(false);
      setNewListName('');
    }
  };

  const isLoading = isCreating || addWord.isPending;

  return {
    lists,
    isOpen,
    setIsOpen,
    newListName,
    setNewListName,
    showCreateInput,
    setShowCreateInput,
    isBookmarked,
    listsContainingWord,
    isLoading,
    handleAddToList,
    handleCreateAndAdd,
    handleKeyDown,
  };
}
