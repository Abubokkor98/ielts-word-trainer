'use client';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Heading,
  HStack,
  IconButton,
  Select,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Button, Card, CardContent, CardHeader, Input, Pagination } from '@ielts/ui';
import { Edit2, Filter, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { WordModal } from './components/WordModal';
import { useVocabulary, useVocabularyCRUD } from './hooks/use-vocabulary';
import type { Word } from './types';

export function VocabularyContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>(
    'all',
  );
  const toast = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Alert Dialog State
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const onCloseDeleteAlert = () => {
    setIsDeleteAlertOpen(false);
    setDeletingId(null);
  };
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Edit Mode State
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Fetch words
  const { data: wordsData, isLoading } = useVocabulary({
    page,
    limit: 10,
    search: debouncedSearch,
    difficulty,
  });

  // CRUD operations
  const { deleteWord, uploadCSV } = useVocabularyCRUD();

  const handleDelete = (wordId: string) => {
    setDeletingId(wordId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteWord.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null);
          onCloseDeleteAlert();
        },
      });
    }
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    onOpen();
  };

  const handleAdd = () => {
    setEditingWord(null);
    onOpen();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv') || !file.type.includes('csv')) {
        toast({
          title: 'Please select a valid CSV file',
          status: 'error',
        });
        return;
      }
      uploadCSV.mutate(file, {
        onSettled: () => {
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
      });
    }
  };

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Vocabulary Management</Heading>
          <HStack>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              leftIcon={<Upload size={16} />}
              variant="outline"
              onClick={handleImportClick}
              isLoading={uploadCSV.isPending}
            >
              Import CSV
            </Button>
            <Button leftIcon={<Plus size={16} />} colorScheme="brand" onClick={handleAdd}>
              Add Word
            </Button>
          </HStack>
        </HStack>

        <Card>
          <CardHeader>
            <HStack spacing={4}>
              <Box position="relative" w="full" maxW="300px">
                <Input
                  placeholder="Search words..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  pl={10}
                />
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                >
                  <Search size={16} />
                </Box>
              </Box>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                w="180px"
                icon={<Filter size={16} />}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </HStack>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <VStack spacing={2}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} height="50px" w="full" />
                ))}
              </VStack>
            ) : (
              <>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Word</Th>
                        <Th>Meaning</Th>
                        <Th>Difficulty</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {wordsData?.words.map((word: Word) => (
                        <Tr key={word._id}>
                          <Td fontWeight="600">{word.word}</Td>
                          <Td maxW="300px" isTruncated color="gray.500">
                            {word.meaning}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                word.difficulty === 'beginner'
                                  ? 'green'
                                  : word.difficulty === 'intermediate'
                                    ? 'blue'
                                    : 'purple'
                              }
                            >
                              {word.difficulty}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                aria-label="Edit word"
                                icon={<Edit2 size={16} />}
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => handleEdit(word)}
                              />
                              <IconButton
                                aria-label="Delete word"
                                icon={<Trash2 size={16} />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => handleDelete(word._id)}
                                isLoading={deletingId === word._id}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                <Pagination
                  currentPage={page}
                  totalPages={wordsData?.totalPages || 1}
                  onPageChange={setPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </VStack>

      {/* Word Modal for Add and Edit */}
      <WordModal isOpen={isOpen} onClose={onClose} initialData={editingWord} />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDeleteAlert}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(2px)">
          <AlertDialogContent borderRadius="xl" boxShadow="2xl">
            <AlertDialogHeader fontSize="lg" color={'red.500'} fontWeight="bold" pt={8} pb={0}>
              <VStack spacing={4}>
                <Text>Delete Word</Text>
              </VStack>
            </AlertDialogHeader>

            <AlertDialogBody textAlign="center" color="gray.500" py={6}>
              Are you sure you want to delete this word? <br />
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter justifyContent="center" pb={8} gap={3}>
              <Button
                ref={cancelRef}
                onClick={onCloseDeleteAlert}
                variant="outline"
                borderRadius="lg"
                px={6}
              >
                No, Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                isLoading={deleteWord.isPending}
                borderRadius="lg"
                px={6}
              >
                Yes, Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
