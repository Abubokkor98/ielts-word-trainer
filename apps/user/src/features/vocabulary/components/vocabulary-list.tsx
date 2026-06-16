'use client';

import { Badge, Button, Card, CardContent, CardFooter, CardHeader, cn, Skeleton } from '@ielts/ui';
import type { Word } from '../types';

interface VocabularyListProps {
  isLoading: boolean;
  words: Word[];
  onViewDetails: (word: Word) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const difficultyStyles: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10',
  intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/10',
  advanced: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/10',
};

export function VocabularyList({
  isLoading,
  words,
  onViewDetails,
  onClearFilters,
  hasActiveFilters,
}: VocabularyListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[220px] w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-zinc-400 text-lg">No vocabulary found matching your criteria.</p>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      aria-label="Vocabulary Cards"
    >
      {words.map((word) => (
        <article key={word.id || word._id} className="h-full">
          <Card className="flex flex-col justify-between h-full bg-card/50 border-border hover:border-border/80 transition-colors">
            <CardHeader className="p-5 pb-0">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-lg font-bold text-card-foreground break-words max-w-[70%]">
                  {word.word}
                </h3>
                <Badge
                  className={cn(
                    'capitalize border font-medium',
                    difficultyStyles[word.difficulty] ||
                      'bg-muted text-muted-foreground border-border',
                  )}
                >
                  {word.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 py-4 flex-grow">
              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{word.meaning}</p>
              <p className="text-muted-foreground/60 text-xs italic">
                Example: {word.exampleSentence}
              </p>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button
                className="w-full text-primary-foreground bg-primary hover:bg-primary/90"
                size="sm"
                onClick={() => onViewDetails(word)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        </article>
      ))}
    </section>
  );
}
