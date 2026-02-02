'use client';

import { Box, useDisclosure, VStack } from '@chakra-ui/react';
import { Card, CardContent } from '@ielts/ui';
import { useEffect, useState } from 'react';
import { DeleteWordDialog } from './components/DeleteWordDialog';
import { VocabularyFilters } from './components/VocabularyFilters';
import { VocabularyHeader } from './components/VocabularyHeader';
import { VocabularyTable } from './components/VocabularyTable';
import { WordModal } from './components/WordModal';
import { useVocabulary, useVocabularyCRUD } from './hooks/use-vocabulary';
import type { Word } from './types';

type Difficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';

export function VocabularyContainer() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Alert Dialog State
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const onCloseDeleteAlert = () => {
    setIsDeleteAlertOpen(false);
    setDeletingId(null);
  };

  // Edit Mode State
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDifficultyChange = (value: Difficulty) => {
    setDifficulty(value);
    setPage(1);
  };

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
  const { deleteWord, uploadCSV, uploadCSVAtomic } = useVocabularyCRUD();

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

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <VocabularyHeader
          onAdd={handleAdd}
          uploadCSV={uploadCSV}
          uploadCSVAtomic={uploadCSVAtomic}
        />

        <Card>
          <VocabularyFilters
            search={search}
            onSearchChange={setSearch}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
          />
          <CardContent>
            <VocabularyTable
              isLoading={isLoading}
              wordsData={wordsData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              deletingId={deletingId}
              page={page}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </VStack>

      {/* Word Modal for Add and Edit */}
      <WordModal isOpen={isOpen} onClose={onClose} initialData={editingWord} />

      {/* Delete Confirmation Alert Dialog */}
      <DeleteWordDialog
        isOpen={isDeleteAlertOpen}
        onClose={onCloseDeleteAlert}
        onConfirm={confirmDelete}
        isLoading={deleteWord.isPending}
      />
    </Box>
  );
}
