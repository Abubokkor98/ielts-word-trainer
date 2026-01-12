import { useEffect } from 'react';
import { QualityRating } from '../types';

interface UseKeyboardShortcutsProps {
  isFlipped: boolean;
  sessionComplete: boolean;
  isSubmitting: boolean;
  onFlip: () => void;
  onRating: (quality: QualityRating) => void;
}

export function useKeyboardShortcuts({
  isFlipped,
  sessionComplete,
  isSubmitting,
  onFlip,
  onRating,
}: UseKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (sessionComplete || isSubmitting) return;

      if (e.key === ' ' && !isFlipped) {
        e.preventDefault();
        onFlip();
      } else if (isFlipped) {
        switch (e.key) {
          case '1':
            onRating(0);
            break;
          case '2':
            onRating(3);
            break;
          case '3':
            onRating(4);
            break;
          case '4':
            onRating(5);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, sessionComplete, isSubmitting, onFlip, onRating]);
}
