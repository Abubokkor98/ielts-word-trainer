import { Skeleton } from '@ielts/ui';
import { useVocabularyOverview } from '../hooks/use-vocabulary-analytics';

export const DifficultyDistributionChart = () => {
  const { data: overview, isLoading, isError } = useVocabularyOverview();

  if (isLoading) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Words by Difficulty</h3>
        </header>
        <Skeleton className="h-[280px] w-full bg-white/5 rounded-xl" />
      </section>
    );
  }

  if (isError || !overview) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Words by Difficulty</h3>
        </header>
        <p className="text-sm text-red-400">Failed to load difficulty distribution</p>
      </section>
    );
  }

  const { byDifficulty } = overview;

  const difficulties = [
    { name: 'Beginner', count: byDifficulty.beginner },
    { name: 'Intermediate', count: byDifficulty.intermediate },
    { name: 'Advanced', count: byDifficulty.advanced },
  ];

  const total = difficulties.reduce((sum, d) => sum + d.count, 0);

  return (
    <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
      <header>
        <h3 className="text-sm font-bold text-foreground">
          Words by Difficulty
        </h3>
        <p className="text-xs text-muted-foreground">
          Learning progression distribution
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {difficulties.map((difficulty) => {
          const percentage = total > 0 ? (difficulty.count / total) * 100 : 0;
          return (
            <div
              key={difficulty.name}
              className="p-3 border border-border rounded-lg bg-transparent flex flex-col gap-2 transition-all duration-200 hover:border-muted-foreground/20"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">
                  {difficulty.name}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-foreground">
                    {difficulty.count.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              {/* Progress track */}
              <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                <div
                  style={{ width: `${percentage}%` }}
                  className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total summary */}
      <div className="p-3 bg-accent/20 rounded-lg border border-border flex justify-between items-center">
        <span className="text-[11px] font-bold text-muted-foreground uppercase">
          Total (unique words)
        </span>
        <span className="text-base font-extrabold text-foreground">
          {total.toLocaleString()}
        </span>
      </div>
    </section>
  );
};
