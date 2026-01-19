import mongoose from 'mongoose';
import { env } from '../config/env';
import { Word } from '../modules/words/words.model';

async function verifyTopics() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to database');
  console.log('Registered Models:', mongoose.modelNames());

  try {
    const word = await Word.findOne({ word: 'abandon' }).populate('topics');
    console.log('Word with populated topics:', JSON.stringify(word, null, 2));

    if (
      word?.topics &&
      Array.isArray(word.topics) &&
      word.topics.length > 0 &&
      typeof word.topics[0] === 'object' &&
      'name' in word.topics[0]
    ) {
      console.log('SUCCESS: Topics array is correctly populated with objects.');
    } else {
      console.log('FAILURE: Topics are not populated correctly.', word?.topics);
    }
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyTopics();
