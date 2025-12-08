import { SRSItem } from './srs.model';
import { getNextReviewDate } from '@ielts/shared';
import { SRSStatus } from '@ielts/shared';

export class SRSService {
  static async reviewWord(userId: string, wordId: string, quality: number) {
    let srsItem = await SRSItem.findOne({ user: userId, word: wordId });

    if (!srsItem) {
      srsItem = new SRSItem({
        user: userId,
        word: wordId,
        repetition: 0,
        interval: 0,
        status: SRSStatus.LEARNING,
      });
    }

    // Logic: If quality >= 2 (good), increment repetition. Else reset or keep.
    // User requested simpler fixed intervals: 1, 3, 7...

    if (quality >= 2) {
      // Good
      srsItem.repetition += 1;
      srsItem.status = SRSStatus.REVIEWING;
      if (srsItem.repetition >= 5) srsItem.status = SRSStatus.MASTERED;
    } else {
      // Forgot / Hard -> Reset or decrease?
      // For simplicity, if forgot (0), reset repetition to 0.
      if (quality === 0) srsItem.repetition = 0;
      // If hard (1), maybe keep repetition or decrement?
      // Let's reset on 0.
    }

    const { date, interval } = getNextReviewDate(srsItem.repetition);
    srsItem.nextReviewDate = date;
    srsItem.interval = interval;
    srsItem.lastReviewed = new Date();

    return srsItem.save();
  }

  static async getDueWords(userId: string) {
    return SRSItem.find({
      user: userId,
      nextReviewDate: { $lte: new Date() },
      status: { $ne: SRSStatus.MASTERED }, // Optional: Keep reviewing mastered words? Usually not immediately.
    }).populate('word');
  }
}
