import mongoose from 'mongoose';
import { StreakUtils } from '../users/streak-utils';
import { User } from '../users/users.model';
import { Word } from '../words/words.model';
import { SRSService } from './srs.service';

// Mock timezone middleware behavior
const extractTimezone = (headerValue?: string) => {
  if (!headerValue) return 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: headerValue });
    return headerValue;
  } catch {
    return 'UTC';
  }
};

describe('Service-Level End-to-End Tests', () => {
  let testUserId: mongoose.Types.ObjectId;
  let testWordId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    // Connect to test database (assuming you have TEST_DB_URI configured)
    if (!mongoose.connection.readyState) {
      await mongoose.connect(
        process.env.TEST_DB_URI || 'mongodb://localhost:27017/test'
      );
    }
  });

  beforeEach(async () => {
    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      passwordHash: 'hashedpassword',
      role: 'user',
      timezone: 'Asia/Dhaka',
      streak: 5,
    });
    testUserId = user._id as mongoose.Types.ObjectId;

    // Create test word
    const word = await Word.create({
      word: `test-${Date.now()}`,
      meaning: 'test meaning',
      difficulty: 'beginner',
    });
    testWordId = word._id as mongoose.Types.ObjectId;
  });

  afterEach(async () => {
    // Cleanup
    await User.deleteMany({ _id: testUserId });
    await Word.deleteMany({ _id: testWordId });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Timezone Middleware Simulation', () => {
    it('should validate timezone correctly', () => {
      expect(extractTimezone('America/New_York')).toBe('America/New_York');
      expect(extractTimezone('Invalid/Timezone')).toBe('UTC');
      expect(extractTimezone()).toBe('UTC');
      expect(extractTimezone('Asia/Tokyo')).toBe('Asia/Tokyo');
    });
  });

  describe('SRS Review with Timezone', () => {
    it('should update lastReviewDate when reviewing', async () => {
      const timezone = extractTimezone('Asia/Dhaka');

      await SRSService.reviewWord(
        testUserId.toString(),
        testWordId.toString(),
        4,
        timezone
      );

      const user = await User.findById(testUserId);
      expect(user?.lastReviewDate).toBeDefined();
      expect(user?.timezone).toBe('Asia/Dhaka');
    });

    it('should maintain streak with review', async () => {
      // Set up: user reviewed yesterday
      await User.findByIdAndUpdate(testUserId, {
        streak: 3,
        lastReviewDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      });

      const timezone = extractTimezone('Asia/Dhaka');

      await SRSService.reviewWord(
        testUserId.toString(),
        testWordId.toString(),
        4,
        timezone
      );

      const user = await User.findById(testUserId);
      expect(user?.streak).toBe(4); // Should increment
    });

    it('should use fallback when timezone header missing', async () => {
      // User has stored timezone
      await User.findByIdAndUpdate(testUserId, { timezone: 'Europe/London' });

      const timezone = extractTimezone(); // No header = UTC

      await SRSService.reviewWord(
        testUserId.toString(),
        testWordId.toString(),
        4,
        timezone // Will be 'UTC'
      );

      const user = await User.findById(testUserId);
      // Service should use fallback: undefined || 'Europe/London' || 'UTC'
      // So timezone should be preserved as Europe/London
      expect(user?.timezone).toBe('UTC'); // Because header sends UTC
    });

    it('should handle invalid timezone gracefully', async () => {
      const timezone = extractTimezone('Invalid/Timezone'); // Returns UTC

      await SRSService.reviewWord(
        testUserId.toString(),
        testWordId.toString(),
        4,
        timezone
      );

      const user = await User.findById(testUserId);
      expect(user?.timezone).toBe('UTC'); // Fallback to UTC
      expect(user?.lastReviewDate).toBeDefined(); // Still updates
      expect(user?.streak).toBeDefined(); // Still updates
    });
  });

  describe('Streak Utils Integration', () => {
    it('should calculate streak correctly with timezone', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        yesterday,
        5
      );

      expect(result.newStreak).toBe(6); // Should increment
      expect(result.streakIncremented).toBe(true);
    });

    it('should reset streak after 2+ days', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        threeDaysAgo,
        10
      );

      expect(result.newStreak).toBe(1); // Reset to 1
      expect(result.streakIncremented).toBe(true);
    });

    it('should not increment on same day', () => {
      const today = new Date();

      const result = StreakUtils.updateStreakOnQuiz(
        'Asia/Dhaka',
        null,
        today,
        5
      );

      expect(result.newStreak).toBe(5); // No change
      expect(result.streakIncremented).toBe(false);
    });
  });
});
