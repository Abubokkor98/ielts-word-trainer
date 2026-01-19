import mongoose from 'mongoose';
import type { CreateWordInput } from '../../shared';
import { Topic } from '../topics/topics.model';
import { Word } from './words.model';

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
        },
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

// Resolve multiple topics at once
export async function resolveTopics(topicInputs: string[]): Promise<string[]> {
  const resolvedTopicIds: string[] = [];

  for (const topicInput of topicInputs) {
    const topicId = await resolveTopic(topicInput);
    resolvedTopicIds.push(topicId);
  }

  // Remove duplicates
  return [...new Set(resolvedTopicIds)];
}

export class WordsService {
  static async create(input: CreateWordInput) {
    // If topics are provided, handle them (they might be names or IDs)
    if (input.topics && Array.isArray(input.topics) && input.topics.length > 0) {
      input.topics = await resolveTopics(input.topics as string[]);
    }
    return Word.create(input);
  }

  static async findAll(query: any, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const filter: any = {};
    const andConditions: any[] = [];

    // Filter by module (MongoDB automatically matches if array contains value)
    if (query.module) filter.modules = query.module;
    if (query.difficulty) filter.difficulty = query.difficulty;

    // Direct topic ID filter (MongoDB automatically matches if array contains value)
    if (query.topic) filter.topics = query.topic;

    // Search by topic Name
    if (query.topicName) {
      const escapedTopicName = query.topicName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const topics = await Topic.find({
        name: { $regex: escapedTopicName, $options: 'i' },
      }).select('_id');

      const topicIds = topics.map((t) => t._id);

      // If a topic name was requested but no matching topics found,
      // we should return no results (or results that match nothing)
      if (topicIds.length > 0) {
        andConditions.push({ topics: { $in: topicIds } });
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
      Word.find(filter).skip(skip).limit(limit).populate('topics'),
      Word.countDocuments(filter),
    ]);

    return { words, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async findById(id: string) {
    return Word.findById(id).populate('topics');
  }

  static async update(id: string, input: Partial<CreateWordInput>) {
    const updateDoc: Partial<CreateWordInput> = { ...input };

    if (
      updateDoc.topics &&
      Array.isArray(updateDoc.topics) &&
      (updateDoc.topics as string[]).length > 0
    ) {
      updateDoc.topics = await resolveTopics(updateDoc.topics as string[]);
    }

    const word = await Word.findById(id);
    if (!word) {
      throw new Error('Word not found');
    }

    Object.assign(word, updateDoc);
    return word.save();
  }

  static async delete(id: string) {
    return Word.findByIdAndDelete(id);
  }
}
