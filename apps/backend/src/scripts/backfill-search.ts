import dotenv from 'dotenv';

dotenv.config({ path: 'apps/backend/.env' });

import mongoose from 'mongoose';
import { Word } from '../modules/words/words.model';

const MONGODB_URI = process.env['MONGODB_URI'];
const MONGODB_DBNAME = process.env['MONGODB_DBNAME'] || 'itelts-vocabs-app';

async function backfill() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DBNAME,
    });
    console.log(`Connected to database: ${MONGODB_DBNAME}`);

    console.log('Fetching all words...');
    const words = await Word.find({});
    console.log(`Found ${words.length} words. Updating searchableText...`);

    let updatedCount = 0;
    for (const word of words) {
      // Just saving triggers the pre('save') hook which regenerates searchableText
      await word.save();
      updatedCount++;
      if (updatedCount % 50 === 0) {
        process.stdout.write(`\rUpdated ${updatedCount}/${words.length}`);
      }
    }

    console.log(`\n✅ Successfully backfilled ${updatedCount} words.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  }
}

backfill();
