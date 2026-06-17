import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Load the .env file from apps/backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Topic model
import { Topic } from '../src/modules/topics/topics.model';

async function fixSlugs() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set in apps/backend/.env');

    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch (e) {
      console.warn('Failed to set custom DNS servers:', e);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DBNAME || 'itelts-vocabs-app',
    });
    console.log('Connected!');

    console.log('Finding topics without slugs...');
    const topics = await Topic.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' },
      ],
    });

    if (topics.length === 0) {
      console.log('✅ All topics already have slugs.');
    } else {
      console.log(`Found ${topics.length} topics missing slugs. Fixing...`);
      for (const topic of topics) {
        const normalized = topic.name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-');
        topic.slug = normalized || `topic-${topic._id.toString()}`;
        await topic.save();
        console.log(`✅ Fixed slug for topic: "${topic.name}" -> "${topic.slug}"`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fixing slugs:', error);
    process.exit(1);
  }
}

fixSlugs();
