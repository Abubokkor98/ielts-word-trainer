import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ielts/ui';
import type { ProblemWord } from '../../dashboard/types';
import { ProblemWordsTableSkeleton } from './ProblemWordsTableSkeleton';

interface ProblemWordsTableProps {
  isLoading: boolean;
  words: ProblemWord[];
}

export function ProblemWordsTable({
  isLoading,
  words,
}: ProblemWordsTableProps) {
  const getDifficultyBadgeClass = (diff: string) => {
    if (diff === 'beginner') return 'bg-muted/30 text-muted-foreground border-muted/50';
    if (diff === 'intermediate') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Word</TableHead>
            <TableHead>Meaning</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="text-right">Accuracy</TableHead>
            <TableHead className="text-right">Attempts</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <ProblemWordsTableSkeleton />
          ) : (
            words.map((pw) => (
              <TableRow key={pw.wordId}>
                <TableCell className="font-bold text-foreground">{pw.word}</TableCell>
                <TableCell className="max-w-[300px] truncate" title={pw.meaning}>
                  {pw.meaning}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getDifficultyBadgeClass(pw.difficulty)}`}>
                    {pw.difficulty}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                    {pw.accuracy}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {pw.attempts}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {pw.lastUpdated
                    ? new Date(pw.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
