'use client';

import {
  Box,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Bookmark, BookmarkCheck, Check, Plus } from 'lucide-react';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useAddWord, useCreateList, useWordLists } from '../hooks/use-word-lists';

function getErrorMessage(error: unknown, fallback: string): string {
  // Axios error in dev mode
  const axiosError = error as AxiosError<{ message?: string }>;
  if (axiosError?.response?.data?.message) {
    return axiosError.response.data.message;
  }
  // Production mode (interceptor wraps as Error)
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

interface SaveToListButtonProps {
  wordId: string;
  isAuthenticated?: boolean;
}

export function SaveToListButton({ wordId, isAuthenticated = false }: SaveToListButtonProps) {
  const { data: lists = [] } = useWordLists();
  const createList = useCreateList();
  const addWord = useAddWord();
  const toast = useToast();
  const { onClose } = useDisclosure();

  const [newListName, setNewListName] = useState('');

  const isBookmarked = lists.some((list) =>
    list.words.some((w) => w._id === wordId),
  );

  const listsContainingWord = new Set(
    lists
      .filter((list) => list.words.some((w) => w._id === wordId))
      .map((list) => list._id),
  );

  const handleAddToList = async (listId: string, listName: string) => {
    try {
      await addWord.mutateAsync({ listId, wordId });
      toast({
        title: `Saved to "${listName}"`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Failed to save word'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateAndAdd = async () => {
    const trimmedName = newListName.trim();
    if (!trimmedName) return;

    try {
      const newList = await createList.mutateAsync(trimmedName);
      await addWord.mutateAsync({ listId: newList._id, wordId });
      setNewListName('');
      onClose();
      toast({
        title: `Created "${trimmedName}" and saved word`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Failed to create list'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateAndAdd();
    }
  };

  const isLoading = createList.isPending || addWord.isPending;

  if (!isAuthenticated) {
    return (
      <IconButton
        aria-label="Save to list"
        icon={<Bookmark size={18} />}
        size="sm"
        colorScheme="brand"
        variant="ghost"
        _hover={{ bg: 'brand.600' }}
        alignSelf="center"
        onClick={() => {
          toast({
            title: 'Login required',
            description: 'Please log in to save words to your lists.',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        }}
      />
    );
  }

  return (
    <Popover placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Box>
          <IconButton
            aria-label={isBookmarked ? 'Already saved' : 'Save to list'}
            icon={
              isBookmarked
                ? <BookmarkCheck size={18} />
                : <Bookmark size={18} />
            }
            size="sm"
            colorScheme="brand"
            variant="ghost"
            _hover={{ bg: 'brand.600' }}
            alignSelf="center"
          />
        </Box>
      </PopoverTrigger>
      <PopoverContent
        bg="gray.800"
        borderColor="gray.600"
        maxW="250px"
        onClick={(e) => e.stopPropagation()}
      >
        <PopoverHeader borderColor="gray.700" fontSize="sm" fontWeight="600">
          Save to list
        </PopoverHeader>
        <PopoverBody p={2}>
          <VStack spacing={1} align="stretch" maxH="200px" overflowY="auto">
            {lists.length === 0 && (
              <Text fontSize="sm" color="gray.500" px={2} py={1}>
                No lists yet. Create one below.
              </Text>
            )}
            {lists.map((list) => {
              const isInList = listsContainingWord.has(list._id);
              return (
                <HStack
                  key={list._id}
                  px={2}
                  py={1.5}
                  rounded="md"
                  cursor={isInList ? 'default' : 'pointer'}
                  _hover={{ bg: isInList ? 'transparent' : 'gray.700' }}
                  opacity={isInList ? 0.6 : 1}
                  onClick={() => {
                    if (!isInList && !isLoading) {
                      handleAddToList(list._id, list.name);
                    }
                  }}
                  justify="space-between"
                >
                  <Text fontSize="sm" noOfLines={1}>
                    {list.name}
                  </Text>
                  {isInList && <Check size={14} color="var(--chakra-colors-green-400)" />}
                </HStack>
              );
            })}
          </VStack>

          <HStack mt={2} pt={2} borderTopWidth="1px" borderColor="gray.700">
            <Input
              size="sm"
              placeholder="New list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={handleKeyDown}
              bg="gray.900"
              borderColor="gray.600"
              _focus={{ borderColor: 'brand.400' }}
            />
            <IconButton
              aria-label="Create list"
              icon={<Plus size={16} />}
              size="sm"
              colorScheme="brand"
              isDisabled={!newListName.trim() || isLoading}
              isLoading={isLoading}
              onClick={handleCreateAndAdd}
            />
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
