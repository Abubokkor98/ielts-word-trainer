import bcrypt from 'bcryptjs';
import { Admin, IAdmin } from './admin.model';
import { AdminRole } from '@ielts/shared';
import { User } from '../users/users.model';
import { Word } from '../words/words.model';
import { QuizAttempt } from '../quiz/quiz-attempt.model';

export class AdminService {
  static async createAdmin(data: Partial<IAdmin>): Promise<IAdmin> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.passwordHash as string, salt); // Expecting raw password in passwordHash field for convenience, or separate field

    // Actually, let's assume the controller passes raw password in a property, say 'password'
    // But adhering to the interface, let's assume 'passwordHash' in data signifies the raw password to be hashed
    // Or better, let's just take raw 'password' as argument if possible, but standard is data object.

    const admin = new Admin({
      ...data,
      passwordHash,
    });
    return admin.save();
  }

  static async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email });
  }

  static async findById(id: string): Promise<IAdmin | null> {
    return Admin.findById(id);
  }

  static async findAll(): Promise<IAdmin[]> {
    return Admin.find({}, '-passwordHash -refreshToken');
  }

  static async deleteAdmin(id: string): Promise<void> {
    await Admin.findByIdAndDelete(id);
  }

  static async updateAdmin(
    id: string,
    data: Partial<IAdmin>
  ): Promise<IAdmin | null> {
    return Admin.findByIdAndUpdate(id, data, { new: true });
  }

  static async getDashboardStats() {
    const [
      totalUsers,
      totalWords,
      totalQuizAttempts,
      wordsByDifficulty,
      quizStats,
    ] = await Promise.all([
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
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
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
}
