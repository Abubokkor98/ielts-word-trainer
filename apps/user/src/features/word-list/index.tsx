'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { WordDetailsModal } from '@ielts/ui';
import { BookOpen, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ListCard } from './components/list-card';
import { SaveToListButton } from './components/save-to-list-button';
import { useCreateList, useWordLists } from './hooks/use-word-lists';
import type { Word } from '../vocabulary/types';

export function WordListContainer() {
  const { data: lists = [], isLoading } = useWordLists();
  const createList = useCreateList();
  const toast = useToast();
  const [newListName, setNewListName] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleViewDetails = (word: Word) => {
    setSelectedWord(word);
    onOpen();
  };

  const handleCreateList = async () => {
    const trimmedName = newListName.trim();
    if (!trimmedName) return;

    try {
      await createList.mutateAsync(trimmedName);
      setNewListName('');
      toast({
        title: `"${trimmedName}" created`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Failed to create list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateList();
    }
  };

  if (isLoading) {
    return (
      <Container maxW="6xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Skeleton height="40px" width="200px" />
          <Skeleton height="200px" borderRadius="lg" />
          <Skeleton height="200px" borderRadius="lg" />
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Heading size="lg" color="white">
            My Lists
          </Heading>
          <HStack>
            <Input
              size="sm"
              placeholder="New list name..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={handleKeyDown}
              bg="gray.800"
              borderColor="gray.600"
              _focus={{ borderColor: 'brand.400' }}
              maxW="220px"
            />
            <Button
              size="sm"
              colorScheme="brand"
              leftIcon={<Plus size={16} />}
              isDisabled={!newListName.trim() || createList.isPending}
              isLoading={createList.isPending}
              onClick={handleCreateList}
            >
              Create
            </Button>
          </HStack>
        </HStack>

        {/* Lists */}
        {lists.length === 0 ? (
          <Box textAlign="center" py={16}>
            <VStack spacing={4}>
              <Box color="gray.500">
                <BookOpen size={48} />
              </Box>
              <Heading size="md" color="gray.400">
                No lists yet
              </Heading>
              <Text color="gray.500" maxW="md">
                Create your first vocabulary list above, then save words from the
                Vocabulary page.
              </Text>
              <Button
                as={Link}
                href="/vocabulary"
                colorScheme="brand"
                variant="outline"
                size="sm"
              >
                Browse Vocabulary
              </Button>
            </VStack>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {lists.map((list) => (
              <ListCard key={list._id} list={list} onViewDetails={handleViewDetails} />
            ))}
          </VStack>
        )}
      </VStack>

      <WordDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        word={selectedWord}
        headerAction={
          <SaveToListButton
            wordId={selectedWord?._id ?? ''}
            isAuthenticated
          />
        }
      />
    </Container>
  );
}
