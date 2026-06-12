import { Button } from '@ielts/ui';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

export function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[50vh] gap-4 py-16">
      <div className="inline-flex p-4 rounded-full border bg-primary/10 border-primary/20 text-primary mb-1">
        <BarChart3 className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-bold text-foreground">
        No Quiz Data Yet
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Take some quizzes to see your analytics!
      </p>
      <Link href="/quiz" className="mt-2">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex gap-2 items-center font-semibold">
          <BarChart3 size={16} />
          Take a Quiz
        </Button>
      </Link>
    </div>
  );
}
