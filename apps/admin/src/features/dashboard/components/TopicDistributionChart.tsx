import { Skeleton } from '@ielts/ui';
import { useVocabularyOverview } from '../hooks/use-vocabulary-analytics';

export const TopicDistributionChart = () => {
  const { data: overview, isLoading, isError } = useVocabularyOverview();

  if (isLoading) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Words by Topic</h3>
        </header>
        <Skeleton className="h-[300px] w-full bg-white/5 rounded-xl" />
      </section>
    );
  }

  if (isError || !overview) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Words by Topic</h3>
        </header>
        <p className="text-sm text-red-400">Failed to load topic distribution</p>
      </section>
    );
  }

  const { byTopic } = overview;

  if (byTopic.length === 0) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
        <header>
          <h3 className="text-sm font-bold text-foreground">Words by Topic</h3>
        </header>
        <p className="text-sm text-muted-foreground">No topics found</p>
      </section>
    );
  }

  // Show top 8 topics for better visibility
  const topTopics = byTopic.slice(0, 8);
  const maxCount = Math.max(...topTopics.map((t) => t.count));

  return (
    <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
      <header>
        <h3 className="text-sm font-bold text-foreground">
          Words by Topic
        </h3>
        <p className="text-xs text-muted-foreground">
          Top {topTopics.length} most populated topics
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {topTopics.map((topic) => {
          const percentage = maxCount > 0 ? (topic.count / maxCount) * 100 : 0;

          return (
            <div
              key={topic.topicId}
              className="p-3 border border-border rounded-lg bg-transparent flex flex-col gap-2 transition-all duration-200 hover:border-muted-foreground/20"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-foreground truncate mr-3 flex-1">
                  {topic.topicName}
                </span>
                <span className="text-base font-extrabold text-foreground">
                  {topic.count}
                </span>
              </div>
              
              {/* Progress bar */}
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

      {byTopic.length > 8 && (
        <div className="p-2 bg-accent/20 rounded-lg border border-border text-center">
          <span className="text-[11px] font-semibold text-muted-foreground">
            +{byTopic.length - 8} more topics
          </span>
        </div>
      )}
    </section>
  );
};
