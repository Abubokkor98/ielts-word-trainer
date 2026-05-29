import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TargetIcon,
} from '@ielts/ui';

interface QuizStartScreenProps {
  onStart: () => void;
  isLoading: boolean;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
}

export function QuizStartScreen({
  onStart,
  isLoading,
  selectedDifficulty,
  onDifficultyChange,
}: QuizStartScreenProps) {
  return (
    <main className="flex flex-col flex-1 items-center justify-center py-12 px-4 md:py-16 bg-background">
      <section className="w-full max-w-md">
        <article className="flex flex-col items-center text-center space-y-6 p-8 relative overflow-hidden group bg-card/95 rounded-2xl border border-border/40 shadow-2xl">
          {/* Subtle glowing backdrop */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/30 transition-all duration-500" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/25 transition-all duration-500" />

          <div className="inline-flex p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary w-fit mb-2">
            <TargetIcon className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-purple-400">
              Ready to Test Your Vocabulary?
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Challenge yourself with our interactive quiz featuring carefully selected IELTS
              vocabulary.
            </p>
          </div>

          <div className="w-full max-w-sm space-y-2 text-left">
            <label
              htmlFor="difficulty-select"
              className="block text-sm font-semibold text-foreground/80 pl-1"
            >
              Select Difficulty Level
            </label>
            <Select value={selectedDifficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger
                id="difficulty-select"
                className="w-full p-3 h-12 rounded-lg bg-[#1B1722]/80 border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm font-medium cursor-pointer"
              >
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-[#1B1722] border-border/85">
                <SelectItem value="mixed">Mixed (All Levels)</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            size="lg"
            onClick={onStart}
            disabled={isLoading}
            className="w-full sm:w-auto px-10 py-6 text-base font-semibold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? 'Loading...' : 'Start New Quiz'}
          </Button>
        </article>
      </section>
    </main>
  );
}
