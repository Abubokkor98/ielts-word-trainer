import bcrypt from 'bcryptjs';
import { AppError } from '../../core/errors/AppError';
import { QuizAttempt } from '../quiz/quiz-attempt.model';
import { User } from '../users/users.model';
import { Word } from '../words/words.model';
import { Admin, type IAdmin } from './admin.model';

export class AdminService {
  static async createAdmin(data: Partial<IAdmin>, password?: string): Promise<IAdmin> {
    // If password is provided as separate argument, hash it
    let passwordHash = data.passwordHash;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    if (!passwordHash) {
      throw new AppError('Password is required', 400);
    }

    const admin = new Admin({
      ...data,
      passwordHash,
    });
    return admin.save();
  }

  static async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email });
  }

  static async findOne(query: any): Promise<IAdmin | null> {
    return Admin.findOne(query);
  }

  static async findById(id: string): Promise<IAdmin | null> {
    return Admin.findById(id);
  }

  static async findAll(): Promise<IAdmin[]> {
    return Admin.find({}, '-passwordHash -refreshToken');
  }

  static async deleteAdmin(id: string): Promise<void> {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }
  }

  static async updateAdmin(id: string, data: Partial<IAdmin>): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(id, data, { new: true });
  }

  static async getDashboardStats() {
    const [totalUsers, totalWords, totalQuizAttempts, wordsByDifficulty, quizStats] =
      await Promise.all([
        User.countDocuments(),
        Word.countDocuments(),
        QuizAttempt.countDocuments(),
        Word.aggregate([{ $group: { _id: '$difficulty', count: { $sum: 1 } } }]),
        QuizAttempt.aggregate([
          {
            $group: {
              _id: null,
              avgScore: {
                $avg: {
                  $multiply: [{ $divide: ['$score', '$totalQuestions'] }, 100],
                },
              },
            },
          },
        ]),
      ]);

    return {
      totalUsers,
      totalWords,
      totalQuizAttempts,
      wordsByDifficulty,
      quizStats: quizStats[0] || { avgScore: 0 },
    };
  }

  static async getUsers(page: number, limit: number, search?: string) {
    const query: any = {};

    if (search) {
      // Escape special characters to prevent ReDoS
      const sanitizedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: { $regex: sanitizedSearch, $options: 'i' } },
        { email: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUserStatus(userId: string, status: string) {
    return User.findByIdAndUpdate(userId, { status }, { new: true });
  }

  static async updatePassword(id: string, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await Admin.findByIdAndUpdate(id, { passwordHash });
  }
}
