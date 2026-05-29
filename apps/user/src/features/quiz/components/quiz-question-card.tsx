import { QuestionType } from '@ielts/shared';
import { Button, CheckIcon, CrossIcon, Progress } from '@ielts/ui';
import type { Question } from '../types';

interface QuizQuestionCardProps {
  question: Question;
  currentIdx: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswer: (id: string) => void;
}

export function QuizQuestionCard({
  question,
  currentIdx,
  totalQuestions,
  selectedAnswer,
  onAnswer,
}: QuizQuestionCardProps) {
  const progress = ((currentIdx + 1) / totalQuestions) * 100;

  const getTypeBadge = (type: QuestionType) => {
    switch (type) {
      case QuestionType.WORD_TO_MEANING:
        return { bg: 'bg-blue-500/10 text-blue-300 border-blue-500/20', text: 'Vocabulary' };
      case QuestionType.MEANING_TO_WORD:
        return { bg: 'bg-purple-500/10 text-purple-300 border-purple-500/20', text: 'Find Word' };
      case QuestionType.SYNONYM_MATCH:
        return { bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', text: 'Synonym' };
      case QuestionType.ANTONYM_MATCH:
        return { bg: 'bg-amber-500/10 text-amber-300 border-amber-500/20', text: 'Antonym' };
      case QuestionType.SENTENCE_COMPLETION:
        return { bg: 'bg-pink-500/10 text-pink-300 border-pink-500/20', text: 'Fill in Blank' };
      default:
        return {
          bg: 'bg-secondary text-secondary-foreground border-transparent',
          text: 'Question',
        };
    }
  };

  const badgeInfo = getTypeBadge(question.type);

  const getOptionClassName = (optionId: string) => {
    const isSelected = selectedAnswer === optionId;
    const isCorrect = optionId === question.correctAnswer;
    const hasSelected = selectedAnswer !== null;

    const baseClass =
      'w-full min-h-[4.5rem] p-5 rounded-xl border text-left flex items-center justify-between transition-all duration-300 font-medium relative overflow-hidden whitespace-normal h-auto ';

    if (!hasSelected) {
      return `${baseClass}border-border/60 bg-card/30 hover:bg-accent/20 hover:border-primary/50 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98] text-foreground`;
    }

    if (isSelected) {
      if (isCorrect) {
        return `${baseClass}border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500 disabled:opacity-100`;
      } else {
        return `${baseClass}border-rose-500 bg-rose-950/40 text-rose-300 shadow-lg shadow-rose-500/10 ring-1 ring-rose-500 disabled:opacity-100`;
      }
    }

    if (isCorrect) {
      return `${baseClass}border-emerald-500/50 bg-emerald-950/20 text-emerald-300/80 disabled:opacity-100`;
    }

    return `${baseClass}border-border/30 bg-card/10 text-muted-foreground opacity-40 disabled:opacity-40`;
  };

  return (
    <main className="w-full bg-background py-8 md:py-16 min-h-[80vh] flex items-center">
      <section className="container max-w-4xl mx-auto px-4">
        <article className="flex flex-col space-y-8">
          {/* Header & Progress */}
          <header className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-semibold text-muted-foreground">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeInfo.bg}`}
                >
                  {badgeInfo.text}
                </span>
              </div>
              <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                {Math.round(progress)}% Completed
              </span>
            </div>
            <Progress value={progress} className="h-2 rounded-full bg-secondary/40" />
          </header>

          {/* Question Card */}
          <div className="w-full glass-card p-8 md:p-12 rounded-2xl border border-border/40 shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-8 relative z-10">
              {question.question}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {question.options.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  onClick={() => onAnswer(option.id)}
                  disabled={selectedAnswer !== null}
                  className={getOptionClassName(option.id)}
                >
                  <span className="pr-4 leading-relaxed">{option.text}</span>
                  {selectedAnswer !== null && (
                    <span className="flex-shrink-0 text-xl font-bold">
                      {option.id === question.correctAnswer ? (
                        <CheckIcon className="w-5 h-5 text-emerald-400" />
                      ) : selectedAnswer === option.id ? (
                        <CrossIcon className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
