'use client';

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { WordDetailsModal } from '@ielts/ui';
import { BookOpen, FolderPlus, Plus } from 'lucide-react';
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
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const totalWords = lists.reduce((sum, list) => sum + list.words.length, 0);

  const handleCreateBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setShowCreateInput(false);
      setNewListName('');
    }
  };

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
      setShowCreateInput(false);
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
    if (e.key === 'Escape') {
      setShowCreateInput(false);
      setNewListName('');
    }
  };

  return (
    <Box bg="gray.900" minH="80vh" py={10}>
      <Container maxW="6xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box>
            <HStack justify="space-between" mb={1}>
              <Heading size="lg" color="white">
                My Lists
              </Heading>

              {showCreateInput ? (
                <HStack spacing={2} onBlur={handleCreateBlur}>
                  <Input
                    size="sm"
                    placeholder="List name..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    bg="gray.800"
                    borderColor="gray.600"
                    borderRadius="lg"
                    _focus={{
                      borderColor: 'brand.400',
                      boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
                    }}
                    maxW="180px"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    colorScheme="brand"
                    borderRadius="lg"
                    leftIcon={<Plus size={15} />}
                    isDisabled={!newListName.trim() || createList.isPending}
                    isLoading={createList.isPending}
                    onClick={handleCreateList}
                  >
                    Create
                  </Button>
                </HStack>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  leftIcon={<FolderPlus size={15} />}
                  _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
                  onClick={() => setShowCreateInput(true)}
                >
                  New List
                </Button>
              )}
            </HStack>
            {!isLoading && (
              <Text fontSize="sm" color="gray.500">
                {lists.length} {lists.length === 1 ? 'list' : 'lists'} · {totalWords}{' '}
                {totalWords === 1 ? 'word' : 'words'}
              </Text>
            )}
          </Box>

          {/* List Content */}
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="200px" borderRadius="xl" />
              ))}
            </SimpleGrid>
          ) : lists.length === 0 ? (
            <VStack py={16} spacing={4}>
              <Box color="gray.600">
                <BookOpen size={36} />
              </Box>
              <VStack spacing={1}>
                <Text color="gray.400" fontWeight="500">
                  No lists yet
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Create a list and save words from Vocabulary.
                </Text>
              </VStack>
              <HStack spacing={3} pt={2}>
                <Button
                  size="sm"
                  colorScheme="brand"
                  borderRadius="lg"
                  onClick={() => setShowCreateInput(true)}
                >
                  Create List
                </Button>
                <Button
                  as={Link}
                  href="/vocabulary"
                  size="sm"
                  variant="ghost"
                  color="gray.400"
                  _hover={{ color: 'white' }}
                >
                  Browse Words
                </Button>
              </HStack>
            </VStack>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {lists.map((list) => (
                <ListCard
                  key={list._id}
                  list={list}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

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
    </Box>
  );
}
