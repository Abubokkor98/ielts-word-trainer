import { Badge, Card, CardContent, CardHeader, Separator, cn, PronunciationButton } from '@ielts/ui';
import type { MouseEvent } from 'react';
import type { ReviewWord } from '../types';

interface FlashcardProps {
  word: ReviewWord;
  isFlipped: boolean;
  onFlip: () => void;
}

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'intermediate':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'advanced':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export function Flashcard({ word, isFlipped, onFlip }: FlashcardProps) {
  const handlePronunciationClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFlipped && (e.key === 'Enter' || e.key === ' ')) {
      if (e.key === ' ') {
        e.preventDefault();
      }
      onFlip();
    }
  };

  return (
    <Card
      onClick={() => !isFlipped && onFlip()}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={cn(
        "relative overflow-hidden border-2 min-h-[450px] w-full p-6 transition-all duration-300 select-none",
        isFlipped
          ? "border-violet-500/40 bg-card cursor-default shadow-[0_0_30px_rgba(139,92,246,0.05)]"
          : "border-border bg-card/60 cursor-pointer hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-[0_0_35px_rgba(139,92,246,0.04)]"
      )}
    >
      {/* Background radial glows for premium layout visual styling */}
      <div
        className={cn(
          "absolute -right-24 -top-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none opacity-40 transition-all duration-500",
          isFlipped ? "bg-violet-500/20" : "bg-violet-500/10"
        )}
      />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 rounded-full blur-[80px] bg-slate-500/5 pointer-events-none" />

      <CardHeader className="p-0 pb-4 relative z-10 flex flex-wrap gap-2 items-center">
        <Badge
          className={cn(
            "px-3 py-1 text-xs font-bold uppercase rounded-full border transition-all duration-300",
            getDifficultyClass(word.difficulty)
          )}
        >
          {word.difficulty}
        </Badge>
        
        {word.topics && word.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            {word.topics.slice(0, 2).map((t) => (
              <Badge
                key={t._id}
                className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-400"
              >
                {t.name}
              </Badge>
            ))}
            {word.topics.length > 2 && (
              <Badge
                className="px-2 py-0.5 text-[10px] font-bold rounded-full border border-slate-700 bg-slate-800 text-slate-400"
              >
                +{word.topics.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 flex flex-col justify-center min-h-[320px] relative z-10">
        {!isFlipped ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center gap-3 justify-center">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-violet-400 text-center">
                {word.word}
              </h2>
              <PronunciationButton
                word={word.word}
                size="md"
                onClick={handlePronunciationClick}
              />
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <span className="text-sm text-muted-foreground">
                Click anywhere or press
              </span>
              <kbd className="px-4 py-2 bg-secondary border border-border text-foreground font-bold text-sm rounded-md shadow">
                SPACE
              </kbd>
              <span className="text-sm text-muted-foreground">
                to reveal answer
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-6 w-full text-left">
            <div className="flex items-center gap-3 justify-center">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-violet-400 text-center">
                {word.word}
              </h2>
              <PronunciationButton
                word={word.word}
                size="sm"
                onClick={handlePronunciationClick}
              />
            </div>
            
            <Separator className="bg-border" />
            
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Definition
              </span>
              <p className="text-lg text-foreground font-medium leading-relaxed">
                {word.meaning}
              </p>
            </div>
            
            {word.exampleSentence && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Example
                </span>
                <p className="text-base text-slate-300 font-medium italic leading-relaxed">
                  "{word.exampleSentence}"
                </p>
              </div>
            )}
            
            {/* Synonyms & Antonyms */}
            {((word.synonyms && word.synonyms.length > 0) ||
              (word.antonyms && word.antonyms.length > 0)) && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                {word.synonyms && word.synonyms.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Synonyms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {word.synonyms.map((syn) => (
                        <Badge
                          key={syn}
                          className="px-2 py-0.5 text-xs font-medium rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          {syn}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {word.antonyms && word.antonyms.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Antonyms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {word.antonyms.map((ant) => (
                        <Badge
                          key={ant}
                          className="px-2 py-0.5 text-xs font-medium rounded bg-red-500/10 text-red-400 border border-red-500/20"
                        >
                          {ant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
