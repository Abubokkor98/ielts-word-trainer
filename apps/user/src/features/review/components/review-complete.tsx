import {
  Badge,
  BookOpenIcon,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  SparklesIcon,
  TrophyIcon,
} from '@ielts/ui';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface ReviewCompleteProps {
  reviewedCount: number;
  onRestart: () => void;
  onReviewMore: () => void;
}

const ZERO_REVIEWED_TITLE = 'All Caught Up!';
const POSITIVE_REVIEWED_TITLE = 'Review Complete!';
const ZERO_REVIEWED_DESCRIPTION =
  "You don't have any words due for review right now. Come back tomorrow after taking some quizzes!";

function getReviewedDescription(count: number): string {
  const wordLabel = count > 1 ? 'words' : 'word';
  return `Excellent work! You reviewed ${count} ${wordLabel} in this session. Your vocabulary is getting stronger!`;
}

export function ReviewComplete({ reviewedCount, onRestart, onReviewMore }: ReviewCompleteProps) {
  const hasReviewedWords = reviewedCount > 0;
  const title = hasReviewedWords ? POSITIVE_REVIEWED_TITLE : ZERO_REVIEWED_TITLE;
  const description = hasReviewedWords
    ? getReviewedDescription(reviewedCount)
    : ZERO_REVIEWED_DESCRIPTION;

  return (
    <main className="w-full bg-background min-h-[80vh] flex items-center">
      <section className="container max-w-5xl mx-auto px-4 py-8 md:py-16">
        <article className="flex justify-center">
          <Card className="w-full max-w-md glass-card border border-border/40 hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-xl">
            {/* Background Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="text-center pb-2 relative z-10 flex flex-col items-center">
              <div
                className={`inline-flex p-4 rounded-full border mb-4 ${
                  hasReviewedWords
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-primary/10 border-primary/20 text-primary'
                }`}
              >
                {hasReviewedWords ? (
                  <TrophyIcon className="w-10 h-10 md:w-12 md:h-12" />
                ) : (
                  <SparklesIcon className="w-10 h-10 md:w-12 md:h-12" />
                )}
              </div>
              <CardTitle className="text-xl md:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-purple-400">
                {title}
              </CardTitle>
              <CardDescription className="text-xs font-medium mt-1">
                {hasReviewedWords
                  ? 'Here is a summary of your review session'
                  : 'Your spaced repetition queue is empty'}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4 relative z-10">
              {hasReviewedWords && (
                <div className="py-2">
                  <span className="text-xs text-muted-foreground block font-semibold mb-1">
                    Words Reviewed
                  </span>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl md:text-4xl font-extrabold text-foreground">
                      {reviewedCount}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Badge
                      variant="outline"
                      className="text-xs md:text-sm px-3.5 py-0.5 font-bold rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    >
                      Session Complete
                    </Badge>
                  </div>
                </div>
              )}

              <p className="text-muted-foreground max-w-sm mx-auto text-xs md:text-sm leading-relaxed">
                {description}
              </p>

              {hasReviewedWords && (
                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 text-left relative overflow-hidden">
                  <div className="flex items-start space-x-3">
                    <BookOpenIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Keep It Up</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                        Consistent daily reviews strengthen long-term memory. Come back tomorrow for
                        your next set of due words!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="justify-center pb-6 pt-1 relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={onRestart}
                  className="w-full sm:w-auto px-6 md:px-8 py-5 text-sm font-semibold shadow-md hover:shadow-primary/15 hover:scale-[1.01] active:scale-[0.99] transition-all bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>

                {hasReviewedWords && (
                  <Button
                    variant="outline"
                    onClick={onReviewMore}
                    className="w-full sm:w-auto px-6 md:px-8 py-5 text-sm font-semibold border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Review More
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </article>
      </section>
    </main>
  );
}
