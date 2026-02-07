import { AppError } from '../../core/errors/AppError';

export interface SM2Input {
  quality: number; // 0-5
  prevInterval: number;
  prevRepetitions: number;
  prevEaseFactor: number;
}

export interface SM2Output {
  interval: number;
  repetitions: number;
  easeFactor: number;
}

/**
 * Calculates the next review interval using the SuperMemo-2 (SM-2) algorithm.
 * Ref: https://super-memory.com/english/ol/sm2.htm
 */
export function calculateSM2({
  quality,
  prevInterval,
  prevRepetitions,
  prevEaseFactor,
}: SM2Input): SM2Output {
  // Validate quality is within SM-2 range (0-5)
  if (quality < 0 || quality > 5) {
    throw new AppError(
      `Invalid quality rating: ${quality}. Must be between 0 and 5.`,
      400
    );
  }

  let interval: number;
  let repetitions: number;
  let easeFactor: number;

  if (quality >= 3) {
    if (prevRepetitions === 0) {
      interval = 1; // First review: Verification phase (always 1 day)
    } else if (prevRepetitions === 1) {
      interval = 6; // Second review: Consolidation phase (6 days)
    } else {
      interval = Math.round(prevInterval * prevEaseFactor); // Subsequent reviews: Exponential growth
    }

    repetitions = prevRepetitions + 1;
  } else {
    repetitions = 0; // Forgot: Reset progress
    interval = 1;
  }

  // Update Ease Factor based on performance (0-5)
  easeFactor =
    prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Establish a minimum floor for the Ease Factor
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return { interval, repetitions, easeFactor };
}

export function getNextReviewDate(interval: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + interval);
  return date;
}
