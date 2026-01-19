import mongoose from 'mongoose';
import { env } from '../config/env';
import { Topic } from '../modules/topics/topics.model';
import { Word } from '../modules/words/words.model';

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
      const legacyTopic = (word as any).topic; // Handle legacy field
      const currentTopics = word.topics || [];

      // If already has new format topics, skip
      if (currentTopics.length > 0 && mongoose.isValidObjectId(currentTopics[0])) {
        continue;
      }

      // If no legacy topic and no current topics, skip
      if (!legacyTopic && currentTopics.length === 0) {
        console.log(`Word "${word.word}" has no topic info. Skipping.`);
        continue;
      }

      let topicIdToLink: mongoose.Types.ObjectId | null = null;

      // Case 1: Legacy topic ID exists and is valid
      if (legacyTopic && mongoose.isValidObjectId(legacyTopic)) {
        topicIdToLink = legacyTopic;
      }
      // Case 2: Legacy topic is a string name
      else if (legacyTopic && typeof legacyTopic === 'string') {
        const topicName = String(legacyTopic);
        console.log(`Processing word "${word.word}" with legacy topic name "${topicName}"`);

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
        topicIdToLink = topic._id as mongoose.Types.ObjectId;
      }

      if (topicIdToLink) {
        // Update word to use array format, removing legacy field
        await Word.updateOne(
          { _id: word._id },
          {
            $set: { topics: [topicIdToLink] },
            $unset: { topic: '' },
          },
        );
        console.log(`Updated word "${word.word}" migrated to topics array.`);
      }
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
