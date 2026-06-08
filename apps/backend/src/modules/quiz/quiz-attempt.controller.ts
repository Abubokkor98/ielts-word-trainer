/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
import type { Response } from 'express';
import mongoose from 'mongoose';
import type { AuthRequest } from '../auth/auth.middleware';
import { QuizAttemptSchema } from './quiz-attempt.schema';
import { QuizAttemptService } from './quiz-attempt.service';
import type { RequestWithTimezone } from '../../middleware/request-with-timezone';
import { agenda } from '../../config/agenda';

export class QuizAttemptController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log('📝 Quiz attempt create - User ID:', userId);
        console.log(
          '📝 Quiz attempt create - Request body:',
          JSON.stringify(req.body, null, 2)
        );
      }

      // Validate request body
      const validatedData = QuizAttemptSchema.parse(req.body);
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Validation passed');
      }

      // Convert wordIds to ObjectId
      const questionsWithObjectIds = validatedData.questions.map((q) => ({
        ...q,
        wordId: new mongoose.Types.ObjectId(q.wordId),
      }));

      // Extract user timezone from request header (set by middleware)
      const userTimezone = (req as RequestWithTimezone).userTimezone || 'UTC';

      // Create quiz attempt with timezone
      const attempt = await QuizAttemptService.createAttempt(
        {
          ...validatedData,
          questions: questionsWithObjectIds,
          userId: new mongoose.Types.ObjectId(userId),
          startTime: new Date(validatedData.startTime),
          endTime: new Date(validatedData.endTime),
        },
        userTimezone
      );

      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Quiz attempt saved to DB - ID:', attempt._id);
        console.log(
          '📊 Quiz stats - Score:',
          validatedData.score,
          '/',
          validatedData.totalQuestions
        );
      }

      // Calculate XP earned (10 XP per correct answer)
      const xpEarned = validatedData.score * 10;

      if (process.env.NODE_ENV !== 'production') {
        console.log(`✅ XP Calculate: ${xpEarned}`);
      }

      type AgendaCancelQuery = Parameters<typeof agenda.cancel>[0] & {
        'data.userId'?: string;
      };

      // 1. Cancel ANY existing inactivity reminders for this user
      await agenda.cancel({
        name: 'send-inactivity-reminder',
        'data.userId': userId,
      } as AgendaCancelQuery);

      // 2. Reschedule the 3-day clock from today!
      await agenda.schedule('in 3 days', 'send-inactivity-reminder', {
        userId,
        daysInactive: 3,
      });

      return res.status(201).json({
        success: true,
        message: 'Quiz attempt saved successfully',
        data: {
          attempt,
          xpEarned,
        },
      });
    } catch (error: any) {
      console.error('Error creating quiz attempt:', error);

      if (error.name === 'ZodError') {
        console.error(
          'Validation errors:',
          JSON.stringify(error.errors, null, 2)
        );
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to save quiz attempt',
        error: error.message,
      });
    }
  }

  static async getUserAttempts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const limit = parseInt(req.query.limit as string, 10) || 10;
      const attempts = await QuizAttemptService.getUserAttempts(userId, limit);

      return res.status(200).json({
        success: true,
        data: attempts,
      });
    } catch (error: any) {
      console.error('Error fetching user attempts:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch quiz attempts',
        error: error.message,
      });
    }
  }
}
