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
    const andConditions: any[] = [];

    if (query.module) filter.module = query.module;
    if (query.difficulty) filter.difficulty = query.difficulty;

    // Direct topic ID filter
    if (query.topic) filter.topic = query.topic;

    // Search by topic Name
    if (query.topicName) {
      const topics = await Topic.find({
        name: { $regex: query.topicName, $options: 'i' },
      }).select('_id');

      const topicIds = topics.map((t) => t._id);

      andConditions.push({
        $or: [
          { topic: { $in: topicIds } },
          { topic: { $regex: query.topicName, $options: 'i' } },
        ],
      });
    }

    // General Word Search (Word, Synonyms, Antonyms)
    if (query.search) {
      const searchRegex = { $regex: query.search, $options: 'i' };
      andConditions.push({
        $or: [
          { word: searchRegex },
          { synonyms: searchRegex },
          { antonyms: searchRegex },
        ],
      });
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
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
