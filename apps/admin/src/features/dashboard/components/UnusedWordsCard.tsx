import { Skeleton } from '@ielts/ui';
import { FileText } from 'lucide-react';
import { useUnusedWords } from '../hooks/use-vocabulary-analytics';

export const UnusedWordsCard = () => {
  const { data, isLoading, isError } = useUnusedWords(50);

  if (isLoading) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Unused Words</h3>
        </header>
        <Skeleton className="h-[100px] rounded-xl bg-white/5" />
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Unused Words</h3>
        </header>
        <p className="text-sm text-red-400">Failed to load unused words</p>
      </section>
    );
  }

  const unusedCount = data.count;
  const hasUnusedWords = unusedCount > 0;

  return (
    <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
      <header>
        <h3 className="text-sm font-bold text-foreground">Unused Words</h3>
        <p className="text-xs text-muted-foreground">
          Words with zero quiz attempts
        </p>
      </header>
      
      <article
        className="p-5 rounded-lg border border-border bg-transparent transition-all duration-200 hover:border-muted-foreground/30 flex items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Total Unused Words
          </span>
          <div className="text-4xl font-extrabold text-foreground leading-none">
            {unusedCount.toLocaleString()}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 leading-tight">
            {hasUnusedWords
              ? "These words haven't appeared in any quiz yet"
              : '✓ All words have been used in quizzes!'}
          </p>
        </div>

        <div className="p-2.5 bg-accent/30 rounded-lg shrink-0 text-primary">
          <FileText className="h-6 w-6" />
        </div>
      </article>
    </section>
  );
};
