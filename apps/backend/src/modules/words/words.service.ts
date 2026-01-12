import { Word } from './words.model';
import { CreateWordInput } from '@ielts/shared';
import { Topic } from '../topics/topics.model';
import mongoose from 'mongoose';

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function resolveTopic(topicInput: string): Promise<string> {
  const isObjectId = mongoose.isValidObjectId(topicInput);

  if (isObjectId) {
    const topicExists = await Topic.findById(topicInput);
    if (!topicExists) throw new Error('Topic not found');
    return topicInput;
  } else {
    // It's likely a topic name
    const cleanedTopic = topicInput.trim();
    try {
      const topic = await Topic.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${escapeRegex(cleanedTopic)}$`, 'i') },
        },
        {
          $setOnInsert: { name: cleanedTopic },
        },
        {
          new: true,
          upsert: true,
        }
      );
      return topic._id.toString();
    } catch (error: any) {
      // Handle race condition: if duplicate key error (E11000), strictly retry finding the topic
      // The other process just created it, so simple find will succeed now.
      if (error.code === 11000) {
        const existingTopic = await Topic.findOne({
          name: { $regex: new RegExp(`^${escapeRegex(cleanedTopic)}$`, 'i') },
        });
        if (existingTopic) {
          return existingTopic._id.toString();
        }
      }
      throw error;
    }
  }
}

export class WordsService {
  static async create(input: CreateWordInput) {
    // If topic is provided, handle it (it might be a name or an ID)
    if (input.topic) {
      input.topic = await resolveTopic(input.topic);
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
      const escapedTopicName = query.topicName.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );
      const topics = await Topic.find({
        name: { $regex: escapedTopicName, $options: 'i' },
      }).select('_id');

      const topicIds = topics.map((t) => t._id);

      // If a topic name was requested but no matching topics found,
      // we should return no results (or results that match nothing)
      if (topicIds.length > 0) {
        andConditions.push({ topic: { $in: topicIds } });
      } else {
        // Force empty result if topic name was searched but not found
        // using a condition that will always be false
        andConditions.push({ _id: { $exists: false } });
      }
    }

    // Search across word, meaning, synonyms, and antonyms using indexed searchableText
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      const escapedSearch = searchLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      andConditions.push({
        searchableText: { $regex: escapedSearch, $options: 'i' },
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
    const updateDoc: Partial<CreateWordInput> = { ...input };
    if (typeof updateDoc.topic === 'string') {
      updateDoc.topic = await resolveTopic(updateDoc.topic);
    }

    return Word.findByIdAndUpdate(id, updateDoc, {
      new: true,
      runValidators: true,
    });
  }

  static async delete(id: string) {
    return Word.findByIdAndDelete(id);
  }
}
