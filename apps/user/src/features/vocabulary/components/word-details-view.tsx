'use client';

import { useAuthStore } from '@ielts/auth';
import { Badge, Button, cn, PronunciationButton, Separator } from '@ielts/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { SaveToListButton } from '../../word-list/components/save-to-list-button';
import type { Word } from '../types';

interface WordDetailsViewProps {
  word: Word;
}

const difficultyStyles: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10',
  intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/10',
};

export function WordDetailsView({ word }: WordDetailsViewProps) {
  const { user } = useAuthStore();

  return (
    <main className="dark w-full bg-background min-h-[80vh] py-12">
      <div className="container max-w-3xl px-6 mx-auto">
        <div className="flex justify-center mb-8">
          <Link href="/vocabulary">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-accent gap-2"
            >
              <ArrowLeft size={16} />
              Back to Library
            </Button>
          </Link>
        </div>

        <article className="bg-card/50 rounded-lg p-8 border border-border shadow-lg">
          <header className="flex justify-between items-start gap-4 mb-6">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-primary leading-tight">
                  {word.word}
                </h1>
                <PronunciationButton word={word.word} size="sm" />
                <SaveToListButton wordId={word._id} isAuthenticated={!!user} />
                {word.partOfSpeech && (
                  <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/10 text-xs px-2.5 py-0.5 rounded-md uppercase font-semibold">
                    {word.partOfSpeech}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge
                  className={cn(
                    'capitalize border font-medium px-2.5 py-1 rounded-md text-xs',
                    difficultyStyles[word.difficulty] ||
                      'bg-muted text-muted-foreground border-border',
                  )}
                >
                  {word.difficulty}
                </Badge>
                {word.topics &&
                  word.topics.length > 0 &&
                  word.topics.map((topic) => (
                    <Badge
                      key={topic._id}
                      className="bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/10 text-xs px-2.5 py-1 rounded-full uppercase font-medium"
                    >
                      {topic.name}
                    </Badge>
                  ))}
              </div>
            </div>
          </header>

          <Separator className="my-6 bg-border" />

          <div className="flex flex-col gap-6">
            <section aria-labelledby="definition-title">
              <h2
                id="definition-title"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
              >
                Definition
              </h2>
              <p className="text-lg text-foreground font-sans">{word.meaning}</p>
            </section>

            <section aria-labelledby="example-title">
              <h2
                id="example-title"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
              >
                Example Sentence
              </h2>
              <p className="text-md text-muted-foreground/80 italic font-serif">
                "{word.exampleSentence}"
              </p>
            </section>

            {/* Synonyms & Antonyms - Two Column Layout */}
            {((word.synonyms && word.synonyms.length > 0) ||
              (word.antonyms && word.antonyms.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Synonyms */}
                {word.synonyms && word.synonyms.length > 0 && (
                  <section aria-labelledby="synonyms-title">
                    <h2
                      id="synonyms-title"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
                    >
                      Synonyms
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {word.synonyms.map((syn) => (
                        <Badge
                          key={syn}
                          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 text-xs px-2.5 py-1 rounded-md"
                        >
                          {syn}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* Antonyms */}
                {word.antonyms && word.antonyms.length > 0 && (
                  <section aria-labelledby="antonyms-title">
                    <h2
                      id="antonyms-title"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
                    >
                      Antonyms
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                      {word.antonyms.map((ant) => (
                        <Badge
                          key={ant}
                          className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/10 text-xs px-2.5 py-1 rounded-md"
                        >
                          {ant}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {word.modules && word.modules.length > 0 && (
              <section aria-labelledby="module-focus-title">
                <h2
                  id="module-focus-title"
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
                >
                  IELTS Module Focus
                </h2>
                <div className="flex flex-wrap gap-2">
                  {word.modules.map((mod) => (
                    <Badge
                      key={mod}
                      className="bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/10 text-xs px-2.5 py-1 rounded-md capitalize font-medium"
                    >
                      {mod}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
