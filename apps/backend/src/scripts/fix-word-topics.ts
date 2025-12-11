import mongoose from 'mongoose';
import { env } from '../config/env';
import { Word } from '../modules/words/words.model';
import { Topic } from '../modules/topics/topics.model';

async function connectToDatabase() {
  await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DBNAME });
  console.log('Connected to database');
}

async function fixWordTopics() {
  await connectToDatabase();

  try {
    // Use lean() to get raw JSON, otherwise Mongoose strips out the 'topic' string
    // because it doesn't match the Schema (ObjectId)
    const words = await Word.find({}).lean();
    console.log(`Found ${words.length} words to check.`);

    for (const word of words) {
      const currentTopic = word.topic;

      if (!currentTopic) {
        console.log(`Word "${word.word}" has no topic. Skipping.`);
        continue;
      }

      // Check if it's already a valid ObjectId
      if (mongoose.isValidObjectId(currentTopic)) {
        // Assume it's already migrated
        continue;
      }

      const topicName = String(currentTopic);
      console.log(
        `Processing word "${word.word}" with legacy topic "${topicName}"`
      );

      // Find or create topic
      let topic = await Topic.findOne({
        name: { $regex: new RegExp(`^${topicName}$`, 'i') },
      });

      if (!topic) {
        console.log(`Creating new topic: ${topicName}`);
        topic = await Topic.create({
          name: topicName,
          wordCount: 0,
        });
      }

      // Update word using updateOne to bypass schema validation of the "old" document
      await Word.updateOne({ _id: word._id }, { topic: topic._id });

      console.log(
        `Updated word "${word.word}" linked to topic "${topic.name}"`
      );
    }

    console.log('Migration complete.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

fixWordTopics();
