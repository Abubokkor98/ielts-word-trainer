import { Skeleton } from '@ielts/ui';
import { BookOpen, FileWarning, TrendingUp } from 'lucide-react';
import { useVocabularyOverview } from '../hooks/use-vocabulary-analytics';

export const VocabularyOverviewCard = () => {
  const { data: overview, isLoading, isError } = useVocabularyOverview();

  if (isLoading) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-lg font-bold text-foreground">Vocabulary Overview</h3>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
          <Skeleton className="h-[100px] rounded-xl bg-white/5" />
          <Skeleton className="h-[100px] rounded-xl bg-white/5" />
          <Skeleton className="h-[100px] rounded-xl bg-white/5" />
        </div>
      </section>
    );
  }

  if (isError || !overview) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-lg font-bold text-foreground">Vocabulary Overview</h3>
        </header>
        <p className="text-sm text-red-400">Failed to load vocabulary overview</p>
      </section>
    );
  }

  const kpiCards = [
    {
      label: 'Total Words',
      value: overview.totalCount.toLocaleString(),
      icon: BookOpen,
      borderClass: 'border-border bg-transparent',
      textAccent: 'text-primary',
      tooltip: 'Total number of words across all topics and modules.',
    },
    {
      label: 'Avg Accuracy',
      value: `${overview.avgAccuracy.toFixed(1)}%`,
      icon: TrendingUp,
      borderClass: 'border-border bg-transparent',
      textAccent: 'text-primary',
      tooltip: 'Global average accuracy across all user quiz attempts.',
    },
    {
      label: 'Unused Words',
      value: overview.unusedWordsCount.toLocaleString(),
      icon: FileWarning,
      borderClass: 'border-border bg-transparent',
      textAccent: 'text-primary',
      tooltip: 'Words that have never been quizzed or reviewed by any user.',
    },
  ];

  return (
    <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
      <header>
        <h3 className="text-lg font-bold text-foreground">
          Vocabulary Overview
        </h3>
        <p className="text-xs text-muted-foreground">
          Key metrics at a glance
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              title={card.tooltip}
              className={`relative group p-5 rounded-lg border transition-all duration-200 hover:border-muted-foreground/30 cursor-help ${card.borderClass}`}
            >
              {/* Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div className={`${card.textAccent}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-foreground leading-none">
                  {card.value}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
