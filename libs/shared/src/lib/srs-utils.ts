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
    throw new Error(
      `Invalid quality rating: ${quality}. Must be between 0 and 5.`
    );
  }

  let interval: number;
  let repetitions: number;
  let easeFactor: number;

  if (quality >= 3) {
    // Correct response logic
    if (prevRepetitions === 0) {
      interval = 1;
    } else if (prevRepetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(prevInterval * prevEaseFactor);
    }

    repetitions = prevRepetitions + 1;

    // Update Ease Factor
    // EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
    easeFactor =
      prevEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    // Incorrect response logic (Reset)
    repetitions = 0;
    interval = 1;
    // Ease factor remains same or could be decreased slightly?
    // SM-2 usually doesn't change EF on failure, keeps it same or decreases.
    // The formula above covers q<3 cases if applied, but standard implementation resets interval.
    // We will keep EF same for simplicity or apply formula if we want punishment.
    // Standard SM-2 applies formula for all q, but only updates interval if q>=3.
    // However, for simplicity here:
    easeFactor = prevEaseFactor;
  }

  // Ensure EF doesn't drop below 1.3
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
