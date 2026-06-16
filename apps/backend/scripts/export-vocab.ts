import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import dns from 'dns';

// Load the .env file from apps/backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import the Word and Topic models
import { Word } from '../src/modules/words/words.model';
import { Topic } from '../src/modules/topics/topics.model'; // Need to import this so mongoose knows the schema

async function exportVocab() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set in apps/backend/.env');
    }

    // Apply custom DNS to avoid ECONNREFUSED with MongoDB SRV records
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

    console.log('Fetching vocabulary words (with topics)...');
    // Ensure Topic model is registered before populating
    Topic.init(); 
    const words = await Word.find().populate('topics', 'name slug thumbnail wordCount').lean().exec();

    // Clean up the mongoose objects (remove _id, __v, stringify ObjectIds)
    const processedWords = words.map((w: any) => {
      const obj = { ...w, id: w._id.toString() };
      delete obj._id;
      delete obj.__v;
      
      // Clean up the nested populated topics
      if (Array.isArray(obj.topics)) {
        obj.topics = obj.topics.map((t: any) => {
          if (t && t._id) {
            const topicObj = { ...t, id: t._id.toString() };
            delete topicObj._id;
            delete topicObj.__v;
            return topicObj;
          }
          return t;
        });
      }
      
      return obj;
    });

    // Define the output path in the frontend app
    const outputDir = path.resolve(__dirname, '../../../apps/user/src/data');
    const outputPath = path.join(outputDir, 'vocabulary.json');

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write the JSON file
    fs.writeFileSync(outputPath, JSON.stringify(processedWords, null, 2));

    console.log(`✅ Successfully exported ${processedWords.length} words to:`);
    console.log(outputPath);
    
    process.exit(0);
  } catch (error) {
    console.error('Error exporting vocabulary:', error);
    process.exit(1);
  }
}

exportVocab();
