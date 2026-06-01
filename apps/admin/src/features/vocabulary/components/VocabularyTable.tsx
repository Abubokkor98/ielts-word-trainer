import {
  Badge,
  Button,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ielts/ui';
import { Edit2, Trash2, Loader2 } from 'lucide-react';
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
      <div className="space-y-4 py-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[20%] text-foreground font-semibold">Word</TableHead>
              <TableHead className="w-[50%] text-foreground font-semibold">Meaning</TableHead>
              <TableHead className="w-[15%] text-foreground font-semibold">Difficulty</TableHead>
              <TableHead className="w-[15%] text-right text-foreground font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wordsData?.words.map((word: Word) => (
              <TableRow key={word._id} className="hover:bg-muted/40 transition-colors">
                <TableCell className="font-semibold text-foreground">{word.word}</TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground" title={word.meaning}>
                  {word.meaning}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      word.difficulty === 'beginner'
                        ? 'outline'
                        : word.difficulty === 'intermediate'
                        ? 'secondary'
                        : 'default'
                    }
                    className="capitalize px-2.5 py-0.5 text-xs font-semibold"
                  >
                    {word.difficulty}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(word)}
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                      aria-label="Edit word"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(word._id)}
                      disabled={deletingId === word._id}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      aria-label="Delete word"
                    >
                      {deletingId === word._id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {wordsData && (
        <Pagination
          currentPage={page}
          totalPages={wordsData.totalPages || 1}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

