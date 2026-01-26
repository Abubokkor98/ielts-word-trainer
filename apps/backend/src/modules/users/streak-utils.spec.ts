import { StreakUtils } from './streak-utils';

describe('StreakUtils - Production Tests', () => {
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
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
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
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
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
      const today = new Date();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Quiz today, review 3 days ago - should NOT reset
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
      const today = new Date();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Quiz 3 days ago, review today - should NOT reset
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
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
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
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
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
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
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
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
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
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      // Review yesterday, quiz 3 days ago - should increment
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
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
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
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
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
      const result = StreakUtils.shouldCheckStreak('Asia/Dhaka', null);
      expect(result).toBe(true);
    });

    it('should return false if already checked today', () => {
      const today = new Date();
      const result = StreakUtils.shouldCheckStreak('Asia/Dhaka', today);
      expect(result).toBe(false);
    });

    it('should return true if last check was yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = StreakUtils.shouldCheckStreak('Asia/Dhaka', yesterday);
      expect(result).toBe(true);
    });
  });

  describe('Production Scenarios with Reviews', () => {
    it('CRITICAL: Quiz maintains streak, then review next day', () => {
      // Day 1: Quiz
      const day1 = new Date('2026-01-25T10:00:00Z');
      let result = StreakUtils.updateStreakOnQuiz('Asia/Dhaka', null, null, 0);
      expect(result.newStreak).toBe(1);

      // Day 2: Review (last quiz = day1, last review = null)
      result = StreakUtils.updateStreakOnQuiz('Asia/Dhaka', day1, null, 1);
      expect(result.newStreak).toBe(2);
      expect(result.streakIncremented).toBe(true);
    });

    it('CRITICAL: Review maintains streak, then quiz next day', () => {
      // Day 1: Review
      const day1 = new Date('2026-01-25T10:00:00Z');
      let result = StreakUtils.updateStreakOnQuiz('Asia/Dhaka', null, null, 0);
      expect(result.newStreak).toBe(1);

      // Day 2: Quiz (last quiz = null, last review = day1)
      result = StreakUtils.updateStreakOnQuiz('Asia/Dhaka', null, day1, 1);
      expect(result.newStreak).toBe(2);
      expect(result.streakIncremented).toBe(true);
    });

    it('CRITICAL: Mixed quiz and review over 5 days', () => {
      const day1 = new Date('2026-01-20T10:00:00Z');
      const day2 = new Date('2026-01-21T10:00:00Z');
      const day3 = new Date('2026-01-22T10:00:00Z');
      const day4 = new Date('2026-01-23T10:00:00Z');

      // Day 1: Quiz
      let lastQuiz: Date | null = day1;
      let lastReview: Date | null = null;
      let streak = 1;

      // Day 2: Review
      lastReview = day2;
      let result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        lastQuiz,
        lastReview,
        streak
      );
      expect(result.newStreak).toBe(2);
      streak = result.newStreak;

      // Day 3: Quiz
      lastQuiz = day3;
      result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        lastQuiz,
        lastReview,
        streak
      );
      expect(result.newStreak).toBe(3);
      streak = result.newStreak;

      // Day 4: Review
      lastReview = day4;
      result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        lastQuiz,
        lastReview,
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
        const reviewDate = new Date('2026-01-20T10:00:00Z');
        reviewDate.setDate(reviewDate.getDate() + day);

        const result = StreakUtils.updateStreakOnQuiz(
          'Asia/Dhaka',
          null,
          lastReview,
          streak
        );
        streak = result.newStreak;
        lastReview = reviewDate;
      }

      expect(streak).toBe(7);
    });

    it('CRITICAL: Midnight boundary', () => {
      const beforeMidnight = new Date('2026-01-25T23:59:00+06:00');
      const afterMidnight = new Date('2026-01-26T00:01:00+06:00');

      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        beforeMidnight,
        5
      );
      expect(result.newStreak).toBe(6);
    });

    it('CRITICAL: Same day multiple quizzes AND reviews', () => {
      const morning = new Date('2026-01-26T04:00:00Z');
      const evening = new Date('2026-01-26T14:00:00Z');

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
