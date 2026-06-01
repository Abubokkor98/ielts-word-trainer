import { Button } from '@ielts/ui';
import { useRouter } from 'next/navigation';
import { useProblemWords } from '../hooks/use-dashboard-metrics';

export const ProblemWordsCard = () => {
  const router = useRouter();
  const { data: problemWords, isLoading } = useProblemWords(5);

  if (isLoading) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl text-sm text-muted-foreground">
        Loading problem words...
      </section>
    );
  }

  if (!problemWords?.words || problemWords.words.length === 0) {
    return (
      <section className="border border-border bg-transparent p-6 rounded-xl space-y-2">
        <h3 className="text-sm font-bold text-foreground">Problem Words</h3>
        <p className="text-xs text-muted-foreground">
          No words currently meet the criteria for "Problem Words" (&lt;40% accuracy).
        </p>
      </section>
    );
  }

  return (
    <section className="border border-border bg-transparent p-6 rounded-xl space-y-4">
      <header className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-foreground">Problem Words</h3>
          <p className="text-xs text-muted-foreground">
            Lowest accuracy words (Top 5)
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-xs text-primary hover:text-primary/90 hover:bg-white/5 p-2 rounded-lg"
          onClick={() => router.push('/dashboard/problem-words')}
        >
          View All
        </Button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs text-zinc-300">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="py-2 font-semibold">Word</th>
              <th className="py-2 font-semibold">Difficulty</th>
              <th className="py-2 font-semibold text-right">Accuracy</th>
              <th className="py-2 font-semibold text-right">Attempts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {problemWords.words.map((pw) => (
              <tr key={pw.wordId} className="hover:bg-white/5 transition-colors">
                <td className="py-2">
                  <span className="font-bold text-foreground block">{pw.word}</span>
                  <span className="text-[10px] text-muted-foreground block truncate max-w-[150px]">
                    {pw.meaning}
                  </span>
                </td>
                <td className="py-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                    pw.difficulty === 'beginner'
                      ? 'bg-muted/30 text-muted-foreground border-muted/50'
                      : pw.difficulty === 'intermediate'
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}>
                    {pw.difficulty}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                    {pw.accuracy}%
                  </span>
                </td>
                <td className="py-2 text-right text-muted-foreground font-semibold">{pw.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
