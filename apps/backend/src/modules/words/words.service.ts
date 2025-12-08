import { Word } from './words.model';
import { CreateWordInput } from '@ielts/shared';
import { Topic } from '../topics/topics.model';

export class WordsService {
  static async create(input: CreateWordInput) {
    // If topic is provided, verify it exists
    if (input.topic) {
      const topicExists = await Topic.findById(input.topic);
      if (!topicExists) throw new Error('Topic not found');
    }
    return Word.create(input);
  }

  static async findAll(query: any, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const filter: any = {};

    if (query.module) filter.module = query.module;
    if (query.difficulty) filter.difficulty = query.difficulty;
    if (query.topic) filter.topic = query.topic;
    if (query.search) {
      filter.$or = [
        { word: { $regex: query.search, $options: 'i' } },
        { meaning: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [words, total] = await Promise.all([
      Word.find(filter).skip(skip).limit(limit).populate('topic'),
      Word.countDocuments(filter),
    ]);

    return { words, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async findById(id: string) {
    return Word.findById(id).populate('topic');
  }

  static async update(id: string, input: Partial<CreateWordInput>) {
    return Word.findByIdAndUpdate(id, input, { new: true });
  }

  static async delete(id: string) {
    return Word.findByIdAndDelete(id);
  }
}
