'use client';

import { Box, Container, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Flashcard } from './components/flashcard';
import { RatingButtons } from './components/rating-buttons';
import { ReviewComplete } from './components/review-complete';
import { ReviewHeader } from './components/review-header';
import { ReviewLoading } from './components/review-loading';
import { useKeyboardShortcuts } from './hooks/use-keyboard-shortcuts';
import { useReviewSession } from './hooks/use-review-session';

export function ReviewContainer() {
  const router = useRouter();
  const {
    currentWord,
    isFlipped,
    isLoading,
    reviewedCount,
    sessionComplete,
    isSubmitting,
    currentIndex,
    words,
    progress,
    fetchDueWords,
    handleRating,
    flipCard,
  } = useReviewSession();

  useKeyboardShortcuts({
    isFlipped,
    sessionComplete,
    isSubmitting,
    onFlip: flipCard,
    onRating: handleRating,
  });

  useEffect(() => {
    fetchDueWords();
  }, [fetchDueWords]);

  const handleRestart = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return <ReviewLoading />;
  }

  if (sessionComplete) {
    return (
      <ReviewComplete
        reviewedCount={reviewedCount}
        onRestart={handleRestart}
        onReviewMore={fetchDueWords}
      />
    );
  }

  if (!currentWord) {
    return <ReviewLoading />;
  }

  return (
    <Box bg="gray.900" py={8} px={4}>
      <Container maxW="900px">
        <VStack spacing={6}>
          <ReviewHeader
            currentIndex={currentIndex}
            totalCards={words.length}
            reviewedCount={reviewedCount}
            progress={progress}
            onExit={handleRestart}
          />

          <Flashcard word={currentWord} isFlipped={isFlipped} onFlip={flipCard} />

          {isFlipped && <RatingButtons onRating={handleRating} isSubmitting={isSubmitting} />}
        </VStack>
      </Container>
    </Box>
  );
}
