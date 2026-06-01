'use client';

import { Card, CardContent } from '@ielts/ui';
import { useProblemWords } from '../dashboard/hooks/use-dashboard-metrics';
import { ProblemWordsTable } from './components/ProblemWordsTable';

export function ProblemWordsContainer() {
  // Fetch up to 100 words for the detailed view
  const { data: problemWords, isLoading, isError } = useProblemWords(100);

  return (
    <div className="py-6 px-8 max-w-[1920px] mx-auto space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Problem Words</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed analysis of words with low accuracy (&lt;40%) and high
            attempts
          </p>
        </div>
      </header>

      {/* Content */}
      {isError ? (
        <Card className="border border-border bg-transparent shadow-none">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-2 text-destructive">
              Error Loading Problem Words
            </h2>
            <p className="text-sm text-muted-foreground">
              Unable to fetch problem words. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : !isLoading && (!problemWords || problemWords.words.length === 0) ? (
        <Card className="border border-border bg-transparent shadow-none">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-2">
              No Problem Words Found
            </h2>
            <p className="text-sm text-muted-foreground">
              Great job! There are no words matching the criteria for "Problem
              Words" at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border bg-transparent shadow-none">
          <CardContent className="p-0">
            <ProblemWordsTable
              isLoading={isLoading}
              words={problemWords?.words || []}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
