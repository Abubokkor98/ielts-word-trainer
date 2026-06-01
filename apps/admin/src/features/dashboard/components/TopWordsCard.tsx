import { Skeleton } from '@ielts/ui';
import { TrendingUp } from 'lucide-react';
import { useTopWords } from '../hooks/use-vocabulary-analytics';

export const TopWordsCard = () => {
  const { data, isLoading, isError } = useTopWords(10);

  if (isLoading) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Top Performing Words</h3>
        </header>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-white/5 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Top Performing Words</h3>
        </header>
        <p className="text-sm text-red-400">Failed to load top words</p>
      </section>
    );
  }

  if (data.words.length === 0) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Top Performing Words</h3>
        </header>
        <p className="text-sm text-muted-foreground">
          No top words data available (requires ≥10 attempts per word)
        </p>
      </section>
    );
  }

  return (
    <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
      <header>
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>Top Performing Words</span>
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Words with ≥80% accuracy (minimum 10 attempts)
        </p>
      </header>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs text-zinc-300">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="py-2.5 font-semibold">Word</th>
              <th className="py-2.5 font-semibold">Meaning</th>
              <th className="py-2.5 font-semibold">Difficulty</th>
              <th className="py-2.5 font-semibold text-right">Accuracy</th>
              <th className="py-2.5 font-semibold text-right">Attempts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.words.map((word) => (
              <tr key={word.wordId} className="hover:bg-white/5 transition-colors">
                <td className="py-2.5 font-bold text-foreground">{word.word}</td>
                <td className="py-2.5 max-w-[200px] truncate text-muted-foreground">
                  {word.meaning}
                </td>
                <td className="py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                    word.difficulty === 'beginner'
                      ? 'bg-muted/30 text-muted-foreground border-muted/50'
                      : word.difficulty === 'intermediate'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}>
                    {word.difficulty}
                  </span>
                </td>
                <td className="py-2.5 text-right font-extrabold text-primary">
                  {word.accuracy}%
                </td>
                <td className="py-2.5 text-right text-muted-foreground font-medium">
                  {word.attempts}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="pt-3 border-t border-border text-[10px] text-muted-foreground">
        Showing {data.words.length} top performing words
      </footer>
    </section>
  );
};
