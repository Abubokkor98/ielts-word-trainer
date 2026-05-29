import { Button, Card, CardContent, CardHeader, cn } from '@ielts/ui';
import Link from 'next/link';

interface ReviewCardProps {
  stats: {
    dueToday: number;
    learning: number;
    reviewing: number;
    mastered: number;
    totalWords: number;
  };
}

export const ReviewCard = ({ stats }: ReviewCardProps) => {
  const isDue = stats.dueToday > 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-2 transition-all duration-300",
        isDue
          ? "border-violet-500/30 bg-card/50 shadow-[0_0_30px_rgba(139,92,246,0.05)]"
          : "border-emerald-500/30 bg-card/50 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
      )}
    >
      {/* Premium subtle gradient glows inside the cards */}
      <div
        className={cn(
          "absolute -right-24 -top-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-40",
          isDue ? "bg-violet-500" : "bg-emerald-500"
        )}
      />
      <div
        className={cn(
          "absolute -left-24 -bottom-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-20",
          isDue ? "bg-purple-500" : "bg-teal-500"
        )}
      />

      <CardHeader className="p-6 pb-4 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label={isDue ? "notepad" : "tada"}>
                {isDue ? '📝' : '🎉'}
              </span>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {isDue ? 'Daily Review' : 'All Caught Up!'}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {isDue
                ? `You have ${stats.dueToday} word${stats.dueToday > 1 ? 's' : ''} ready to review`
                : 'Great job! You have no words due for review right now.'}
            </p>
          </div>
          <Link href="/review" className={cn(!isDue && "pointer-events-none")}>
            <Button
              size="lg"
              disabled={!isDue}
              className={cn(
                "w-full sm:w-auto font-semibold shadow-md transition-all duration-300 group",
                isDue
                  ? "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-violet-500/20 active:scale-95"
                  : "bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
              )}
            >
              {isDue ? (
                <span className="flex items-center gap-2">
                  Start Review 
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              ) : (
                'Review Ahead'
              )}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <StatBox
            label="Learning"
            value={stats.learning}
            textColor="text-sky-400"
          />
          <StatBox
            label="Reviewing"
            value={stats.reviewing}
            textColor="text-amber-400"
          />
          <StatBox
            label="Mastered"
            value={stats.mastered}
            textColor="text-emerald-400"
          />
          <StatBox
            label="Total Words"
            value={stats.totalWords}
            textColor="text-violet-400"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const StatBox = ({
  label,
  value,
  textColor,
}: {
  label: string;
  value: number;
  textColor: string;
}) => (
  <div
    className="text-center p-4 rounded-xl border border-border bg-background/60 transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:-translate-y-0.5"
  >
    <p className={cn("text-2xl font-bold tracking-tight mb-0.5", textColor)}>
      {value || 0}
    </p>
    <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider">
      {label}
    </span>
  </div>
);
