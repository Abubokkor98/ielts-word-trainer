import {
  Badge,
  Box,
  HStack,
  IconButton,
  Skeleton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { Pagination } from '@ielts/ui';
import { Edit2, Trash2 } from 'lucide-react';
import type { Word, WordsResponse } from '../types';

interface VocabularyTableProps {
  isLoading: boolean;
  wordsData: WordsResponse | undefined;
  onEdit: (word: Word) => void;
  onDelete: (wordId: string) => void;
  deletingId: string | null;
  page: number;
  onPageChange: (page: number) => void;
}

export function VocabularyTable({
  isLoading,
  wordsData,
  onEdit,
  onDelete,
  deletingId,
  page,
  onPageChange,
}: VocabularyTableProps) {
  if (isLoading) {
    return (
      <VStack spacing={2}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} height="50px" w="full" />
        ))}
      </VStack>
    );
  }

  return (
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
                <Td
                  maxW="300px"
                  isTruncated
                  color="gray.500"
                  title={word.meaning}
                >
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
                      onClick={() => onEdit(word)}
                    />
                    <IconButton
                      aria-label="Delete word"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => onDelete(word._id)}
                      isLoading={deletingId === word._id}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {wordsData && (
        <Pagination
          currentPage={page}
          totalPages={wordsData.totalPages || 1}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
