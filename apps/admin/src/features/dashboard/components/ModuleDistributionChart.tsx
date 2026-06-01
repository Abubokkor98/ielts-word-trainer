import { Skeleton } from '@ielts/ui';
import { useVocabularyOverview } from '../hooks/use-vocabulary-analytics';

export const ModuleDistributionChart = () => {
  const { data: overview, isLoading, isError } = useVocabularyOverview();

  if (isLoading) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Words by Module</h3>
        </header>
        <Skeleton className="h-[280px] w-full bg-white/5 rounded-xl" />
      </section>
    );
  }

  if (isError || !overview) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Words by Module</h3>
        </header>
        <p className="text-sm text-red-400">Failed to load module distribution</p>
      </section>
    );
  }

  const { byModule } = overview;

  const modules = [
    { name: 'Reading', count: byModule.reading },
    { name: 'Writing', count: byModule.writing },
    { name: 'Listening', count: byModule.listening },
    { name: 'Speaking', count: byModule.speaking },
  ];

  const total = modules.reduce((sum, m) => sum + m.count, 0);

  return (
    <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
      <header>
        <h3 className="text-sm font-bold text-foreground">
          Words by Module
        </h3>
        <p className="text-xs text-muted-foreground">
          Distribution across IELTS modules
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {modules.map((module) => {
          const percentage = total > 0 ? (module.count / total) * 100 : 0;
          return (
            <div
              key={module.name}
              className="p-3 border border-border rounded-lg bg-transparent flex flex-col gap-2 transition-all duration-200 hover:border-muted-foreground/20"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">
                  {module.name}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-foreground">
                    {module.count.toLocaleString()}
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
    </section>
  );
};
