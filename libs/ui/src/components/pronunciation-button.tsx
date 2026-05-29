'use client';

import { Volume2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Button } from './ui/button';
import { useSpeechSynthesis } from '../hooks/use-speech-synthesis';
import { cn } from '../lib/utils';

interface PronunciationButtonProps {
  word: string;
  size?: 'sm' | 'md';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function PronunciationButton({
  word,
  size = 'sm',
  onClick,
}: PronunciationButtonProps) {
  const { speak, isSpeaking, isLoading, isSupported } = useSpeechSynthesis({
    text: word,
    lang: 'en',
    voiceLang: 'en-GB',
  });

  if (!isSupported) {
    return null;
  }

  const iconSize = size === 'md' ? 22 : 20;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    speak();
  };

  return (
    <Button
      type="button"
      aria-label="Pronounce word"
      variant={isSpeaking ? 'default' : 'ghost'}
      size="icon"
      className={cn(
        'rounded-full self-center transition-all focus-visible:ring-2 focus-visible:ring-primary',
        size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
        isSpeaking 
          ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
          : 'text-primary hover:bg-primary/10 hover:text-primary'
      )}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        <Volume2 size={iconSize} />
      )}
    </Button>
  );
}

