'use client';

import {
  Box,
  HStack,
  IconButton,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Bookmark, BookmarkCheck, Check, FolderPlus } from 'lucide-react';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useAddWord, useCreateList, useWordLists } from '../hooks/use-word-lists';
import type { WordList } from '../types';

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

interface SaveToListButtonProps {
  wordId: string;
  isAuthenticated?: boolean;
}

export function SaveToListButton({ wordId, isAuthenticated = false }: SaveToListButtonProps) {
  const { data: lists = [] } = useWordLists(isAuthenticated);
  const createList = useCreateList();
  const addWord = useAddWord();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newListName, setNewListName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

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
      onClose();
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

    let newList: WordList;
    try {
      newList = await createList.mutateAsync(trimmedName);
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, 'Failed to create list'),
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addWord.mutateAsync({ listId: newList._id, wordId });
      setNewListName('');
      setShowCreateInput(false);
      onClose();
      toast({
        title: `Created "${trimmedName}" and saved word`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: unknown) {
      toast({
        title: getErrorMessage(error, `List created but failed to save word`),
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
    if (e.key === 'Escape') {
      setShowCreateInput(false);
      setNewListName('');
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
    <Popover placement="bottom-start" isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
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
        borderWidth="1px"
        maxW="280px"
        borderRadius="xl"
        boxShadow="0 8px 32px rgba(0,0,0,0.4)"
        onClick={(e) => e.stopPropagation()}
        _focus={{ outline: 'none' }}
      >
        <PopoverBody p={0}>
          {/* Header */}
          <HStack
            px={4}
            py={3}
            borderBottomWidth="1px"
            borderColor="gray.700"
            justify="space-between"
          >
            <Text fontSize="sm" fontWeight="700" color="gray.200" letterSpacing="wide">
              Save to list
            </Text>
            <Box
              as="button"
              onClick={() => setShowCreateInput(!showCreateInput)}
              color="brand.400"
              _hover={{ color: 'brand.300' }}
              transition="color 0.15s"
              cursor="pointer"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <FolderPlus size={15} />
              <Text fontSize="xs" fontWeight="600">
                New
              </Text>
            </Box>
          </HStack>

          {/* List Items */}
          <VStack spacing={0} align="stretch" maxH="220px" overflowY="auto" py={1}>
            {lists.length === 0 && !showCreateInput && (
              <Box px={4} py={6} textAlign="center">
                <Text fontSize="sm" color="gray.500">
                  No lists yet
                </Text>
                <Text fontSize="xs" color="gray.600" mt={1}>
                  Tap &quot;New&quot; to create your first list
                </Text>
              </Box>
            )}
            {lists.map((list) => {
              const isInList = listsContainingWord.has(list._id);
              return (
                <HStack
                  key={list._id}
                  px={4}
                  py={2.5}
                  cursor="pointer"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  onClick={() => {
                    if (!isLoading) {
                      handleAddToList(list._id, list.name);
                    }
                  }}
                  justify="space-between"
                  transition="background 0.15s"
                >
                  <HStack spacing={3} flex={1} minW={0}>
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={isInList ? 'brand.400' : 'gray.600'}
                      flexShrink={0}
                      transition="background 0.2s"
                    />
                    <Text
                      fontSize="sm"
                      noOfLines={1}
                      color={isInList ? 'white' : 'gray.300'}
                      fontWeight={isInList ? '600' : '400'}
                    >
                      {list.name}
                    </Text>
                  </HStack>
                  {isInList && (
                    <Check
                      size={15}
                      color="var(--chakra-colors-brand-400)"
                      strokeWidth={3}
                    />
                  )}
                </HStack>
              );
            })}
          </VStack>

          {/* Create New List */}
          {showCreateInput && (
            <Box
              px={3}
              py={3}
              borderTopWidth="1px"
              borderColor="gray.700"
            >
              <HStack spacing={2}>
                <Input
                  size="sm"
                  placeholder="List name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  bg="gray.900"
                  borderColor="gray.600"
                  borderRadius="lg"
                  _focus={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
                  _placeholder={{ color: 'gray.500' }}
                  autoFocus
                />
                <IconButton
                  aria-label="Create list"
                  icon={<FolderPlus size={16} />}
                  size="sm"
                  colorScheme="brand"
                  borderRadius="lg"
                  isDisabled={!newListName.trim() || isLoading}
                  isLoading={isLoading}
                  onClick={handleCreateAndAdd}
                />
              </HStack>
            </Box>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
