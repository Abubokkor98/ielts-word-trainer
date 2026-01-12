import mongoose from 'mongoose';
import { env } from '../config/env';
import { Word } from '../modules/words/words.model';

async function verifyTopics() {
  await mongoose.connect(env.MONGODB_URI);
  console.log('Connected to database');
  console.log('Registered Models:', mongoose.modelNames());

  try {
    const word = await Word.findOne({ word: 'abandon' }).populate('topic');
    console.log('Word with populated topic:', JSON.stringify(word, null, 2));

    if (word?.topic && typeof word.topic === 'object' && 'name' in word.topic) {
      console.log('SUCCESS: Topic is correctly populated as an object.');
    } else {
      console.log('FAILURE: Topic is not populated correctly.', word?.topic);
    }
  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

verifyTopics();
