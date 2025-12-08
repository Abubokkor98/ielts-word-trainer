export const SRS_INTERVALS = [1, 3, 7, 14, 30];

export function getNextReviewDate(currentRepetition: number): {
  date: Date;
  interval: number;
} {
  // If repetition is 0 (first time), interval is 1. If 1, interval is 3, etc.
  // The index in array corresponds to currentRepetition.
  // If we exceed array, we can clamp or keep adding 30. User prompt implied 5th -> 30d. Maybe 6th -> 30d too?
  const index = Math.min(currentRepetition, SRS_INTERVALS.length - 1);
  const interval = SRS_INTERVALS[index];

  const date = new Date();
  date.setDate(date.getDate() + interval);

  return { date, interval };
}
