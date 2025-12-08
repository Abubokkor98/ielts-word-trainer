import { Request, Response } from 'express';
import { QuizAttemptService } from './quiz-attempt.service';
import { QuizAttemptSchema } from './quiz-attempt.schema';
import { User } from '../users/users.model';
import mongoose from 'mongoose';

export class QuizAttemptController {
  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      // Validate request body
      const validatedData = QuizAttemptSchema.parse(req.body);

      // Convert wordIds to ObjectId
      const questionsWithObjectIds = validatedData.questions.map((q) => ({
        ...q,
        wordId: new mongoose.Types.ObjectId(q.wordId),
      }));

      // Create quiz attempt
      const attempt = await QuizAttemptService.createAttempt({
        ...validatedData,
        questions: questionsWithObjectIds,
        userId: new mongoose.Types.ObjectId(userId),
        startTime: new Date(validatedData.startTime),
        endTime: new Date(validatedData.endTime),
      });

      // Calculate XP earned (10 XP per correct answer)
      const xpEarned = validatedData.score * 10;

      // Update user XP and streak
      await User.findByIdAndUpdate(userId, {
        $inc: { xp: xpEarned },
        $set: { lastQuizDate: new Date() },
      });

      // TODO: Implement streak logic based on consecutive days
      // For now, we'll increment streak if quiz taken today

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

  static async getUserAttempts(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const limit = parseInt(req.query.limit as string) || 10;
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
