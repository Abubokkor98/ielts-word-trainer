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
  LightbulbIcon,
  TrophyIcon,
} from '@ielts/ui';
import { useEffect, useState } from 'react';
import { quizApi } from '../services/quiz.api';
import type { Question, QuestionAnswer, QuizRecommendation } from '../types';

interface QuizResultsProps {
  score: number;
  questions: Question[];
  answers: Map<number, QuestionAnswer>;
  onRestart: () => void;
}

export function QuizResults({ score, questions, answers, onRestart }: QuizResultsProps) {
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const [recommendation, setRecommendation] = useState<QuizRecommendation | null>(null);

  useEffect(() => {
    quizApi.getRecommendation().then(setRecommendation).catch(console.error);
  }, []);

  const isGoodScore = percentage >= 70;

  return (
    <main className="w-full bg-background py-8 md:py-16 min-h-screen">
      <section className="container max-w-5xl mx-auto px-4 space-y-12">
        {/* Results Header Card */}
        <article className="flex justify-center">
          <Card className="w-full max-w-md glass-card border border-border/40 hover:border-primary/30 transition-all duration-300 relative overflow-hidden shadow-xl">
            {/* Background Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="text-center pb-2 relative z-10 flex flex-col items-center">
              <div
                className={`inline-flex p-4 rounded-full border mb-4 ${
                  isGoodScore
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-primary/10 border-primary/20 text-primary'
                }`}
              >
                {isGoodScore ? (
                  <TrophyIcon className="w-12 h-12" />
                ) : (
                  <BookOpenIcon className="w-12 h-12" />
                )}
              </div>
              <CardTitle className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-purple-400">
                Quiz Complete!
              </CardTitle>
              <CardDescription className="text-xs font-medium mt-1">
                Here is a summary of your performance
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4 relative z-10">
              <div className="py-2">
                <span className="text-xs text-muted-foreground block font-semibold mb-1">
                  Your Score
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl font-extrabold text-foreground">{score}</span>
                  <span className="text-xl text-muted-foreground">/</span>
                  <span className="text-xl font-semibold text-muted-foreground">
                    {questions.length}
                  </span>
                </div>
                <div className="mt-3">
                  <Badge
                    variant="outline"
                    className={`text-sm px-3.5 py-0.5 font-bold rounded-full border ${
                      isGoodScore
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-brand/30 bg-brand/10 text-brand'
                    }`}
                  >
                    {percentage}% Accuracy
                  </Badge>
                </div>
              </div>

              <p className="text-muted-foreground max-w-sm mx-auto text-xs md:text-sm leading-relaxed">
                {isGoodScore
                  ? 'Excellent work! You have a strong vocabulary!'
                  : 'Keep practicing! Review the words and try again.'}
              </p>

              {recommendation && (
                <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 text-left relative overflow-hidden">
                  <div className="flex items-start space-x-3">
                    <LightbulbIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Recommendation</h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                        {recommendation.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="justify-center pb-6 pt-1 relative z-10">
              <Button
                onClick={onRestart}
                className="w-full sm:w-auto px-8 py-5 text-sm font-semibold shadow-md hover:shadow-primary/15 hover:scale-[1.01] active:scale-[0.99] transition-all bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Take Another Quiz
              </Button>
            </CardFooter>
          </Card>
        </article>

        {/* Word Review Section */}
        <section className="space-y-6">
          <h3 className="text-2xl font-extrabold text-foreground flex items-center space-x-2 border-b border-border/40 pb-3">
            <BookOpenIcon className="w-6 h-6 text-primary" />
            <span>Word Review & Explanations</span>
          </h3>

          <div className="space-y-4">
            {questions.map((question, idx) => {
              const userAnswer = answers.get(idx);
              const isCorrect = userAnswer?.isCorrect || false;
              const wordDetails = question.wordDetails;

              if (!wordDetails) return null;

              return (
                <article
                  key={question.id}
                  className={`w-full glass-card rounded-[14px] p-6 md:p-8 hover:border-[rgba(255,255,255,0.15)] transition-all duration-300 relative overflow-hidden group ${
                    isCorrect
                      ? 'border-emerald-500/20 bg-emerald-950/5 shadow-md shadow-emerald-500/2'
                      : 'border-rose-500/20 bg-rose-950/5 shadow-md shadow-rose-500/2'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    {/* Left Column: Word & Specs */}
                    <div className="space-y-4 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground">Q{idx + 1}</span>
                        <Badge
                          variant="outline"
                          className={`font-semibold py-0.5 px-2 rounded-md ${
                            isCorrect
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                              : 'border-rose-500/20 bg-rose-500/10 text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="font-semibold capitalize py-0.5 px-2 rounded-md"
                        >
                          {wordDetails.partOfSpeech}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-3xl font-extrabold text-foreground tracking-tight">
                          {wordDetails.word}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Meaning
                          </span>
                          <p className="text-sm md:text-base text-foreground/90 leading-relaxed font-medium">
                            {wordDetails.meaning}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Example Sentence
                          </span>
                          <p className="text-sm md:text-base text-foreground/80 leading-relaxed italic">
                            "{wordDetails.exampleSentence}"
                          </p>
                        </div>
                      </div>

                      {wordDetails.synonyms && wordDetails.synonyms.length > 0 && (
                        <div className="space-y-1 pt-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                            Synonyms
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {wordDetails.synonyms.map((syn, sIdx) => (
                              <Badge
                                key={sIdx}
                                variant="outline"
                                className="border-border/60 text-muted-foreground bg-[#1B1722]/40"
                              >
                                {syn}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Choices Feedback */}
                    <div className="w-full md:w-80 flex-shrink-0">
                      {!isCorrect ? (
                        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 space-y-3">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-rose-300/80 uppercase tracking-wider block">
                              Your Selection
                            </span>
                            <span className="text-sm font-semibold text-rose-200">
                              {userAnswer?.selected || 'None'}
                            </span>
                          </div>
                          <div className="space-y-1 border-t border-rose-500/10 pt-2">
                            <span className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider block">
                              Correct Answer
                            </span>
                            <span className="text-sm font-semibold text-emerald-200">
                              {userAnswer?.correct}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
                          <span className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider block">
                            Selected Answer
                          </span>
                          <span className="text-sm font-semibold text-emerald-200">
                            {userAnswer?.selected}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
