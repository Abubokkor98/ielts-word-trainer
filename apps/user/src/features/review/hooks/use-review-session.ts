import { useToast } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { reviewApi } from '../services/review.api';
import type { QualityRating, ReviewWord } from '../types';

export function useReviewSession() {
  const [words, setWords] = useState<ReviewWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const queryClient = useQueryClient();

  const fetchDueWords = useCallback(async () => {
    try {
      setIsLoading(true);
      setSessionComplete(false);
      setIsFlipped(false);
      setCurrentIndex(0);
      setReviewedCount(0);

      const dueWords = await reviewApi.getDueWords();

      if (dueWords.length > 0) {
        setWords(dueWords);
      } else {
        setWords([]);
        setSessionComplete(true);
      }
    } catch (error) {
      console.error('Error fetching due words:', error);
      toast({
        title: 'Failed to load due words',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleRating = useCallback(
    async (quality: QualityRating) => {
      if (isSubmitting || sessionComplete || words.length === 0) return;

      const word = words[currentIndex];
      if (!word) return;

      try {
        setIsSubmitting(true);
        await reviewApi.submitReview(word._id, quality);

        setReviewedCount((prev) => prev + 1);
        queryClient.invalidateQueries({ queryKey: ['srs', 'stats'] });

        if (currentIndex + 1 < words.length) {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
        } else {
          setSessionComplete(true);
        }
      } catch (_error) {
        toast({
          title: 'Failed to submit review',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [words, currentIndex, queryClient, toast, isSubmitting, sessionComplete],
  );

  const flipCard = useCallback(() => {
    if (!isFlipped && !isLoading && !sessionComplete && !isSubmitting) {
      setIsFlipped(true);
    }
  }, [isFlipped, isLoading, sessionComplete, isSubmitting]);

  return {
    words,
    currentIndex,
    isFlipped,
    isLoading,
    reviewedCount,
    sessionComplete,
    isSubmitting,
    fetchDueWords,
    handleRating,
    flipCard,
    currentWord: words[currentIndex] || null,
    progress: words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0,
  };
}
