import { StreakUtils } from './streak-utils';

describe('StreakUtils - Production Tests', () => {
  // Helper to set system time for controlled testing
  const setNow = (iso: string) => jest.setSystemTime(new Date(iso));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getUserCalendarDay', () => {
    it('should convert UTC time to Asia/Dhaka calendar day', () => {
      const date = new Date('2026-01-26T23:30:00Z');
      const result = StreakUtils.getUserCalendarDay('Asia/Dhaka', date);

      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(27);
    });

    it('should handle UTC timezone correctly', () => {
      const date = new Date('2026-01-26T12:00:00Z');
      const result = StreakUtils.getUserCalendarDay('UTC', date);

      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(26);
    });
  });

  describe('getDaysDifference', () => {
    it('should return 0 for same day', () => {
      const date1 = new Date(2026, 0, 26);
      const date2 = new Date(2026, 0, 26);
      expect(StreakUtils.getDaysDifference(date1, date2)).toBe(0);
    });

    it('should return 1 for consecutive days', () => {
      const date1 = new Date(2026, 0, 25);
      const date2 = new Date(2026, 0, 26);
      expect(StreakUtils.getDaysDifference(date1, date2)).toBe(1);
    });

    it('should return negative for reversed dates', () => {
      const date1 = new Date(2026, 0, 26);
      const date2 = new Date(2026, 0, 25);
      expect(StreakUtils.getDaysDifference(date1, date2)).toBe(-1);
    });

    it('should return 3 for 3-day gap', () => {
      const date1 = new Date(2026, 0, 20);
      const date2 = new Date(2026, 0, 23);
      expect(StreakUtils.getDaysDifference(date1, date2)).toBe(3);
    });
  });

  describe('checkAndResetStreak - Dashboard Access', () => {
    it('should not reset if never took quiz or review', () => {
      setNow('2026-01-26T10:00:00Z');
      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        null,
        null,
        0
      );
      expect(result.needsReset).toBe(false);
      expect(result.newStreak).toBe(0);
    });

    it('should not reset if last quiz was today', () => {
      setNow('2026-01-26T10:00:00Z');
      const today = new Date();
      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        today,
        null,
        5
      );
      expect(result.needsReset).toBe(false);
      expect(result.newStreak).toBe(5);
    });

    it('should not reset if last review was today', () => {
      setNow('2026-01-26T10:00:00Z');
      const today = new Date();
      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        null,
        today,
        5
      );
      expect(result.needsReset).toBe(false);
      expect(result.newStreak).toBe(5);
    });

    it('should not reset if last quiz was yesterday', () => {
      setNow('2026-01-26T10:00:00Z');
      const yesterday = new Date('2026-01-25T10:00:00Z');
      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        yesterday,
        null,
        5
      );
      expect(result.needsReset).toBe(false);
      expect(result.newStreak).toBe(5);
    });

    it('should not reset if last review was yesterday', () => {
      setNow('2026-01-26T10:00:00Z');
      const yesterday = new Date('2026-01-25T10:00:00Z');
      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        null,
        yesterday,
        5
      );
      expect(result.needsReset).toBe(false);
      expect(result.newStreak).toBe(5);
    });

    it('should use most recent activity (quiz newer)', () => {
      setNow('2026-01-26T10:00:00Z');
      const today = new Date();
      const threeDaysAgo = new Date('2026-01-23T10:00:00Z');

      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        today,
        threeDaysAgo,
        5
      );
      expect(result.needsReset).toBe(false);
      expect(result.newStreak).toBe(5);
    });

    it('should use most recent activity (review newer)', () => {
      setNow('2026-01-26T10:00:00Z');
      const today = new Date();
      const threeDaysAgo = new Date('2026-01-23T10:00:00Z');

      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        threeDaysAgo,
        today,
        5
      );
      expect(result.needsReset).toBe(false);
      expect(result.newStreak).toBe(5);
    });

    it('should reset to 0 if 2 days passed since last activity', () => {
      setNow('2026-01-26T10:00:00Z');
      const twoDaysAgo = new Date('2026-01-24T10:00:00Z');
      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        twoDaysAgo,
        null,
        5
      );
      expect(result.needsReset).toBe(true);
      expect(result.newStreak).toBe(0);
    });

    it('should reset to 0 if 10 days passed', () => {
      setNow('2026-01-26T10:00:00Z');
      const tenDaysAgo = new Date('2026-01-16T10:00:00Z');
      const result = StreakUtils.checkAndResetStreak(
        'Asia/Dhaka',
        null,
        tenDaysAgo,
        15
      );
      expect(result.needsReset).toBe(true);
      expect(result.newStreak).toBe(0);
    });
  });

  describe('updateStreakOnQuiz - Quiz Completion', () => {
    it('should set streak to 1 for first quiz ever', () => {
      setNow('2026-01-26T10:00:00Z');
      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        null,
        0
      );
      expect(result.newStreak).toBe(1);
      expect(result.streakIncremented).toBe(true);
    });

    it('should not change streak if quiz taken same day', () => {
      setNow('2026-01-26T10:00:00Z');
      const today = new Date();
      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        today,
        null,
        5
      );
      expect(result.newStreak).toBe(5);
      expect(result.streakIncremented).toBe(false);
    });

    it('should not change streak if review done same day', () => {
      setNow('2026-01-26T10:00:00Z');
      const today = new Date();
      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        today,
        5
      );
      expect(result.newStreak).toBe(5);
      expect(result.streakIncremented).toBe(false);
    });

    it('should increment streak if consecutive day (quiz)', () => {
      setNow('2026-01-26T10:00:00Z');
      const yesterday = new Date('2026-01-25T10:00:00Z');
      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        yesterday,
        null,
        5
      );
      expect(result.newStreak).toBe(6);
      expect(result.streakIncremented).toBe(true);
    });

    it('should increment streak if consecutive day (review)', () => {
      setNow('2026-01-26T10:00:00Z');
      const yesterday = new Date('2026-01-25T10:00:00Z');
      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        yesterday,
        5
      );
      expect(result.newStreak).toBe(6);
      expect(result.streakIncremented).toBe(true);
    });

    it('should use most recent activity for streak calculation', () => {
      setNow('2026-01-26T10:00:00Z');
      const yesterday = new Date('2026-01-25T10:00:00Z');
      const threeDaysAgo = new Date('2026-01-23T10:00:00Z');

      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        threeDaysAgo,
        yesterday,
        5
      );
      expect(result.newStreak).toBe(6);
      expect(result.streakIncremented).toBe(true);
    });

    it('should reset to 1 if missed 2 days', () => {
      setNow('2026-01-26T10:00:00Z');
      const twoDaysAgo = new Date('2026-01-24T10:00:00Z');
      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        twoDaysAgo,
        null,
        5
      );
      expect(result.newStreak).toBe(1);
      expect(result.streakIncremented).toBe(true);
    });

    it('should reset to 1 if missed many days', () => {
      setNow('2026-01-26T10:00:00Z');
      const weekAgo = new Date('2026-01-19T10:00:00Z');
      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        weekAgo,
        10
      );
      expect(result.newStreak).toBe(1);
      expect(result.streakIncremented).toBe(true);
    });
  });

  describe('shouldCheckStreak - Optimization Logic', () => {
    it('should return true if never checked before', () => {
      setNow('2026-01-26T10:00:00Z');
      const result = StreakUtils.shouldCheckStreak('Asia/Dhaka', null);
      expect(result).toBe(true);
    });

    it('should return false if already checked today', () => {
      setNow('2026-01-26T10:00:00Z');
      const today = new Date();
      const result = StreakUtils.shouldCheckStreak('Asia/Dhaka', today);
      expect(result).toBe(false);
    });

    it('should return true if last check was yesterday', () => {
      setNow('2026-01-26T10:00:00Z');
      const yesterday = new Date('2026-01-25T10:00:00Z');
      const result = StreakUtils.shouldCheckStreak('Asia/Dhaka', yesterday);
      expect(result).toBe(true);
    });
  });

  describe('Production Scenarios with Reviews', () => {
    it('CRITICAL: Quiz maintains streak, then review next day', () => {
      // Day 1: Quiz
      setNow('2026-01-25T10:00:00Z');
      const day1 = new Date();
      let result = StreakUtils.updateStreakOnQuiz('Asia/Dhaka', null, null, 0);
      expect(result.newStreak).toBe(1);

      // Day 2: Review (advance time to next day)
      setNow('2026-01-26T10:00:00Z');
      result = StreakUtils.updateStreakOnQuiz('Asia/Dhaka', day1, null, 1);
      expect(result.newStreak).toBe(2);
      expect(result.streakIncremented).toBe(true);
    });

    it('CRITICAL: Review maintains streak, then quiz next day', () => {
      // Day 1: Review
      setNow('2026-01-25T10:00:00Z');
      const day1 = new Date();
      let result = StreakUtils.updateStreakOnQuiz('Asia/Dhaka', null, null, 0);
      expect(result.newStreak).toBe(1);

      // Day 2: Quiz (advance time to next day)
      setNow('2026-01-26T10:00:00Z');
      result = StreakUtils.updateStreakOnQuiz('Asia/Dhaka', null, day1, 1);
      expect(result.newStreak).toBe(2);
      expect(result.streakIncremented).toBe(true);
    });

    it('CRITICAL: Mixed quiz and review over 5 days', () => {
      // Day 1: Quiz
      setNow('2026-01-20T10:00:00Z');
      let lastQuiz: Date | null = new Date();
      let lastReview: Date | null = null;
      let streak = 1;

      // Day 2: Review
      setNow('2026-01-21T10:00:00Z');
      lastReview = new Date();
      let result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        lastQuiz,
        null,
        streak
      );
      expect(result.newStreak).toBe(2);
      streak = result.newStreak;

      // Day 3: Quiz
      setNow('2026-01-22T10:00:00Z');
      lastQuiz = new Date();
      result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        lastReview,
        streak
      );
      expect(result.newStreak).toBe(3);
      streak = result.newStreak;

      // Day 4: Review
      setNow('2026-01-23T10:00:00Z');
      lastReview = new Date();
      result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        lastQuiz,
        null,
        streak
      );
      expect(result.newStreak).toBe(4);

      // Final streak should be 4
      expect(result.newStreak).toBe(4);
    });

    it('CRITICAL: Only reviews for 7 days straight', () => {
      let lastReview: Date | null = null;
      let streak = 0;

      for (let day = 0; day < 7; day++) {
        const dateStr = `2026-01-${20 + day}T10:00:00Z`;
        setNow(dateStr);

        const result = StreakUtils.updateStreakOnQuiz(
          'Asia/Dhaka',
          null,
          lastReview,
          streak
        );
        streak = result.newStreak;
        lastReview = new Date();
      }

      expect(streak).toBe(7);
    });

    it('CRITICAL: Midnight boundary', () => {
      setNow('2026-01-25T17:59:00Z'); // 11:59 PM in Dhaka
      const beforeMidnight = new Date();

      setNow('2026-01-25T18:01:00Z'); // 12:01 AM next day in Dhaka
      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        beforeMidnight,
        5
      );
      expect(result.newStreak).toBe(6);
    });

    it('CRITICAL: Same day multiple quizzes AND reviews', () => {
      setNow('2026-01-26T04:00:00Z');
      const morning = new Date();

      // Same day, different time
      setNow('2026-01-26T14:00:00Z');
      const evening = new Date();

      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        morning,
        evening,
        5
      );
      expect(result.newStreak).toBe(5);
      expect(result.streakIncremented).toBe(false);
    });

    it('CRITICAL: Optimization prevents duplicate checks', () => {
      setNow('2026-01-26T10:00:00Z');
      const lastCheck = new Date();

      for (let i = 0; i < 100; i++) {
        const shouldCheck = StreakUtils.shouldCheckStreak(
          'Asia/Dhaka',
          lastCheck
        );
        expect(shouldCheck).toBe(false);
      }
    });
  });
});
