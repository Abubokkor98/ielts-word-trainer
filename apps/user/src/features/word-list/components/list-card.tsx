'use client';

import {
  Badge,
  Box,
  Heading,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { MoreVertical, Pencil, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Word } from '../../vocabulary/types';
import type { WordList } from '../types';
import { useDeleteList, useRemoveWord, useRenameList } from '../hooks/use-word-lists';

interface ListCardProps {
  list: WordList;
  onViewDetails: (word: Word) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'purple',
};

export function ListCard({ list, onViewDetails }: ListCardProps) {
  const renameList = useRenameList();
  const deleteList = useDeleteList();
  const removeWord = useRemoveWord();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(list.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartRename = () => {
    setEditName(list.name);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveRename = async () => {
    const trimmedName = editName.trim();
    if (!trimmedName || trimmedName === list.name) {
      setIsEditing(false);
      return;
    }

    try {
      await renameList.mutateAsync({ listId: list._id, name: trimmedName });
      setIsEditing(false);
      toast({
        title: 'List renamed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to rename list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancelRename = () => {
    setEditName(list.name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const handleDelete = async () => {
    try {
      await deleteList.mutateAsync(list._id);
      toast({
        title: `"${list.name}" deleted`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to delete list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveWord = async (wordId: string) => {
    try {
      await removeWord.mutateAsync({ listId: list._id, wordId });
    } catch {
      toast({
        title: 'Failed to remove word',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      bg="gray.800"
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="lg"
      p={5}
    >
      {/* List Header */}
      <HStack justify="space-between" mb={4}>
        {isEditing ? (
          <HStack flex={1}>
            <Input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveRename}
              size="sm"
              bg="gray.900"
              borderColor="gray.600"
              _focus={{ borderColor: 'brand.400' }}
              maxW="300px"
            />
          </HStack>
        ) : (
          <HStack spacing={3}>
            <Heading size="md" color="white">
              {list.name}
            </Heading>
            <Badge colorScheme="brand" variant="subtle" fontSize="xs">
              {list.words.length} {list.words.length === 1 ? 'word' : 'words'}
            </Badge>
          </HStack>
        )}

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<MoreVertical size={16} />}
            variant="ghost"
            size="sm"
            color="gray.400"
            _hover={{ color: 'white', bg: 'gray.700' }}
            aria-label="List actions"
          />
          <MenuList bg="gray.800" borderColor="gray.700" minW="150px">
            <MenuItem
              icon={<Pencil size={14} />}
              onClick={handleStartRename}
              bg="gray.800"
              _hover={{ bg: 'gray.700' }}
              fontSize="sm"
            >
              Rename
            </MenuItem>
            <MenuItem
              icon={<Trash2 size={14} />}
              onClick={handleDelete}
              bg="gray.800"
              _hover={{ bg: 'gray.700' }}
              color="red.400"
              fontSize="sm"
            >
              Delete
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>

      {/* Word Cards */}
      {list.words.length === 0 ? (
        <Text color="gray.500" fontSize="sm" fontStyle="italic">
          No words in this list yet. Browse the Vocabulary page to add words.
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
          {list.words.map((word) => (
            <HStack
              key={word._id}
              bg="gray.900"
              px={3}
              py={2}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.700"
              justify="space-between"
            >
              <VStack
                align="start"
                spacing={0}
                flex={1}
                minW={0}
                cursor="pointer"
                onClick={() => onViewDetails(word)}
                _hover={{ opacity: 0.8 }}
              >
                <HStack spacing={2}>
                  <Text color="brand.400" fontWeight="600" fontSize="sm" noOfLines={1}>
                    {word.word}
                  </Text>
                  <Badge
                    colorScheme={DIFFICULTY_COLORS[word.difficulty] || 'gray'}
                    fontSize="2xs"
                  >
                    {word.difficulty}
                  </Badge>
                </HStack>
                <Text color="gray.400" fontSize="xs" noOfLines={1}>
                  {word.meaning}
                </Text>
              </VStack>
              <IconButton
                aria-label="Remove word"
                icon={<X size={14} />}
                size="xs"
                variant="ghost"
                color="gray.500"
                _hover={{ color: 'red.400', bg: 'gray.700' }}
                onClick={() => handleRemoveWord(word._id)}
              />
            </HStack>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
