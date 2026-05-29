'use client';

import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '../components/ui/dialog';
import { PronunciationButton } from '../components/pronunciation-button';
import { cn } from './utils';

interface WordDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: {
    word: string;
    meaning: string;
    exampleSentence: string;
    difficulty: string;
    partOfSpeech?: string;
    synonyms?: string[];
    antonyms?: string[];
    topics?: Array<string | { _id: string; name: string }>;
    modules?: string[];
  } | null;
  headerAction?: React.ReactNode;
}

// Exact difficulty mapping to previous color scheme (beginner: green, intermediate: orange, advanced: red)
const difficultyColorScheme = {
  beginner: 'bg-[#38a169] text-white hover:bg-[#38a169]',
  intermediate: 'bg-[#dd6b20] text-white hover:bg-[#dd6b20]',
  advanced: 'bg-[#e53e3e] text-white hover:bg-[#e53e3e]',
};

export function WordDetailsModal({
  isOpen,
  onClose,
  word,
  headerAction,
}: WordDetailsModalProps) {
  if (!word) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-[#1b1722] border-[#2f293a] text-[#f4f4f5] max-w-lg shadow-2xl rounded-lg p-0 overflow-hidden" aria-describedby={undefined}>
        {/* Compact Header */}
        <div className="pb-3 pt-4 px-6 border-b border-[#2f293a] flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <DialogTitle className="text-[30px] font-bold text-[#a855f7] leading-tight font-sans">
              {word.word}
            </DialogTitle>
            <PronunciationButton word={word.word} size="sm" />
            {headerAction}
            {word.partOfSpeech && (
              <Badge
                className="bg-[#3182ce] text-white hover:bg-[#3182ce] text-xs font-semibold uppercase px-2 py-0.5 rounded-md self-center"
              >
                {word.partOfSpeech}
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            <Badge
              className={cn(
                'px-2 py-0.5 rounded-md text-[10.4px] font-bold uppercase tracking-wider',
                difficultyColorScheme[word.difficulty as keyof typeof difficultyColorScheme] ||
                  difficultyColorScheme.intermediate
              )}
            >
              {word.difficulty}
            </Badge>
            {word.topics &&
              word.topics.length > 0 &&
              word.topics.slice(0, 3).map((topic) => {
                const topicName = typeof topic === 'object' && topic !== null ? topic.name : topic;
                return (
                  <Badge
                    key={`topic-${topicName}`}
                    className="bg-[#b794f4]/20 text-[#d6bcfa] hover:bg-[#b794f4]/20 px-2 py-0.5 rounded-full text-[10.4px] font-bold uppercase tracking-wider"
                  >
                    {topicName}
                  </Badge>
                );
              })}
            {word.topics && word.topics.length > 3 && (
              <Badge
                variant="outline"
                className="border border-[#a1a1aa]/30 text-[#a1a1aa] px-2 py-0.5 rounded-full text-[10.4px] font-bold uppercase tracking-wider"
              >
                +{word.topics.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="py-4 px-6 flex flex-col gap-4">
          {/* Meaning */}
          <div>
            <span className="text-[12px] font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1.5 font-sans">
              Meaning
            </span>
            <p className="text-[16px] text-[#e4e4e7] leading-relaxed font-sans">
              {word.meaning}
            </p>
          </div>

          {/* Example */}
          <div>
            <span className="text-[12px] font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1.5 font-sans">
              Example
            </span>
            <p className="text-[16px] italic text-[#cccccc] leading-relaxed font-sans">
              "{word.exampleSentence}"
            </p>
          </div>

          {/* Synonyms & Antonyms - Two Column Layout */}
          {((word.synonyms && word.synonyms.length > 0) ||
            (word.antonyms && word.antonyms.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Synonyms */}
              {word.synonyms && word.synonyms.length > 0 && (
                <div>
                  <span className="text-[12px] font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1.5 font-sans">
                    Synonyms
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {word.synonyms.map((syn) => (
                      <Badge
                        key={syn}
                        className="bg-[#48bb78]/20 text-[#9ae6b4] hover:bg-[#48bb78]/20 px-2 py-0.5 rounded text-xs font-semibold uppercase"
                      >
                        {syn}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms */}
              {word.antonyms && word.antonyms.length > 0 && (
                <div>
                  <span className="text-[12px] font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1.5 font-sans">
                    Antonyms
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {word.antonyms.map((ant) => (
                      <Badge
                        key={ant}
                        className="bg-[#f56565]/20 text-[#feb2b2] hover:bg-[#f56565]/20 px-2 py-0.5 rounded text-xs font-semibold uppercase"
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

        {/* Modal Footer */}
        <div className="pt-3 pb-4 px-6 border-t border-[#2f293a]">
          <Button onClick={onClose} className="w-full font-sans">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
