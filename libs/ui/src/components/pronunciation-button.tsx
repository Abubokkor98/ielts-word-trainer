'use client';

import {
  IconButton,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { Volume2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useSpeechSynthesis } from '../hooks/use-speech-synthesis';

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

  const tooltipLabel = isLoading
    ? 'Loading voice...'
    : isSpeaking
    ? 'Playing...'
    : 'Listen to pronunciation';

  const iconSize = size === 'md' ? 22 : 20;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    speak();
  };

  return (
    <Tooltip label={tooltipLabel} placement="top">
      <IconButton
        aria-label="Pronounce word"
        icon={
          isLoading ? (
            <Spinner size="sm" />
          ) : (
            <Volume2 size={iconSize} />
          )
        }
        size={size}
        colorScheme="brand"
        variant={isSpeaking ? 'solid' : 'ghost'}
        onClick={handleClick}
        isDisabled={isLoading}
        _hover={{ bg: 'brand.600' }}
        alignSelf="center"
      />
    </Tooltip>
  );
}
