import mongoose from 'mongoose';
import { Feedback, type IFeedback } from './feedback.model';

export class FeedbackService {
  static async create(data: Partial<IFeedback> & { userId: string }): Promise<IFeedback> {
    const feedback = new Feedback({
      ...data,
      userId: new mongoose.Types.ObjectId(data.userId),
    });
    return await feedback.save();
  }

  static async findAll(
    filters: { feedbackType?: string; status?: string },
    page = 1,
    limit = 20
  ): Promise<{ feedbacks: IFeedback[]; total: number; pages: number; page: number }> {
    const query: Record<string, unknown> = {};

    if (filters.feedbackType) {
      query.feedbackType = filters.feedbackType;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const skip = (page - 1) * limit;
    const total = await Feedback.countDocuments(query);
    const feedbacks = await Feedback.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      feedbacks,
      total,
      pages: Math.ceil(total / limit),
      page,
    };
  }

  static async updateStatus(id: string, status: 'new' | 'reviewed' | 'resolved'): Promise<IFeedback | null> {
    return await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).exec();
  }

  static async delete(id: string): Promise<IFeedback | null> {
    return await Feedback.findByIdAndDelete(id).exec();
  }
}
