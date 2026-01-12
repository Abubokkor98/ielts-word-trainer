/**
 * Backfill Script: Populate searchableText for existing words
 *
 * Run this ONCE after deploying the searchableText field
 * This updates all existing words in the database
 *
 * Usage: npx tsx scripts/backfill-searchable-text.ts
 */

import mongoose from 'mongoose';
import { Word } from '../src/modules/words/words.model';
import dotenv from 'dotenv';

dotenv.config();

async function backfillSearchableText() {
  try {
    if (!process.env.MONGODB_URI || !process.env.MONGODB_DBNAME) {
      throw new Error(
        'Missing MONGODB_URI or MONGODB_DBNAME environment variables'
      );
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DBNAME,
    });

    console.log('Connected to MongoDB');

    // Fetch all words without searchableText or with empty searchableText
    const words = await Word.find({
      $or: [
        { searchableText: { $exists: false } },
        { searchableText: '' },
        { searchableText: null },
      ],
    });

    console.log(`Found ${words.length} words to update`);

    if (words.length === 0) {
      console.log('✅ All words already have searchableText populated!');
      await mongoose.connection.close();
      process.exit(0);
    }

    let updated = 0;

    // Update each word - the pre-save hook will populate searchableText
    for (const word of words) {
      // Force the pre-save hook to run by marking as modified
      word.markModified('searchableText');
      await word.save();
      updated++;

      if (updated % 100 === 0) {
        console.log(`Updated ${updated}/${words.length} words...`);
      }
    }

    console.log(`✅ Successfully updated ${updated} words`);
    console.log('searchableText field is now populated for all existing words');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

backfillSearchableText();
