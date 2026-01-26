export class StreakUtils {
  // Convert date to user's local calendar day (ignores time component)
  static getUserCalendarDay(timezone: string, now: Date = new Date()): Date {
    const tz = timezone || 'UTC';
    const userDate = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    return new Date(
      userDate.getFullYear(),
      userDate.getMonth(),
      userDate.getDate()
    );
  }

  // Calculate days between two dates (returns negative if date2 < date1)
  static getDaysDifference(date1: Date, date2: Date): number {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }

  // Helper to get the most recent of two dates
  static getMostRecentDate(
    date1: Date | null | undefined,
    date2: Date | null | undefined
  ): Date | null {
    if (!date1 && !date2) {
      return null;
    }
    if (!date1) {
      return date2;
    }
    if (!date2) {
      return date1;
    }
    return date1.getTime() > date2.getTime() ? date1 : date2;
  }

  // Check if streak should be reset (called when user accesses dashboard)
  static checkAndResetStreak(
    timezone: string,
    lastQuizDate: Date | null | undefined,
    lastReviewDate: Date | null | undefined,
    currentStreak: number
  ): { needsReset: boolean; newStreak: number } {
    // Use the most recent activity (quiz or review) for streak calculation
    const lastActivityDate = StreakUtils.getMostRecentDate(
      lastQuizDate,
      lastReviewDate
    );

    if (!lastActivityDate) {
      return { needsReset: false, newStreak: currentStreak || 0 };
    }

    const today = StreakUtils.getUserCalendarDay(timezone);
    const lastActivityDay = StreakUtils.getUserCalendarDay(
      timezone,
      new Date(lastActivityDate)
    );
    const daysDiff = StreakUtils.getDaysDifference(lastActivityDay, today);

    if (daysDiff >= 2) {
      return { needsReset: true, newStreak: 0 };
    }

    return { needsReset: false, newStreak: currentStreak || 0 };
  }

  // Update streak when user completes a quiz
  static updateStreakOnQuiz(
    timezone: string,
    lastQuizDate: Date | null | undefined,
    lastReviewDate: Date | null | undefined,
    currentStreak: number
  ): { newStreak: number; streakIncremented: boolean } {
    const now = new Date();
    const today = StreakUtils.getUserCalendarDay(timezone, now);

    // Use the most recent activity (quiz or review)
    const lastActivityDate = StreakUtils.getMostRecentDate(
      lastQuizDate,
      lastReviewDate
    );

    if (!lastActivityDate) {
      return { newStreak: 1, streakIncremented: true };
    }

    const lastActivityDay = StreakUtils.getUserCalendarDay(
      timezone,
      new Date(lastActivityDate)
    );
    const daysDiff = StreakUtils.getDaysDifference(lastActivityDay, today);

    if (daysDiff === 0) {
      return { newStreak: currentStreak || 1, streakIncremented: false };
    }
    if (daysDiff === 1) {
      return { newStreak: (currentStreak || 0) + 1, streakIncremented: true };
    }
    return { newStreak: 1, streakIncremented: true };
  }

  // Check if we need to validate streak (optimization to prevent duplicate checks)
  static shouldCheckStreak(
    timezone: string,
    lastStreakCheckDate: Date | null | undefined
  ): boolean {
    if (!lastStreakCheckDate) {
      return true;
    }

    const today = StreakUtils.getUserCalendarDay(timezone);
    const lastCheckDay = StreakUtils.getUserCalendarDay(
      timezone,
      new Date(lastStreakCheckDate)
    );

    const alreadyCheckedToday =
      StreakUtils.getDaysDifference(lastCheckDay, today) === 0;

    return !alreadyCheckedToday;
  }

}
