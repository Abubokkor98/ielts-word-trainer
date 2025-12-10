import dotenv from 'dotenv';
dotenv.config({ path: 'apps/backend/.env' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './modules/users/users.model';
import { Word } from './modules/words/words.model';
import { Topic } from './modules/topics/topics.model';
import { QuizAttempt } from './modules/quiz/quiz-attempt.model';
import { Quiz } from './modules/quiz/quiz.entity';
import { UserRole } from '@ielts/shared';

const MONGODB_URI = process.env['MONGODB_URI'];
const MONGODB_DBNAME = process.env['MONGODB_DBNAME'] || 'itelts-vocabs-app';

console.log('Starting seed script...');

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DBNAME,
    });
    console.log(`Connected to MongoDB - Database: ${MONGODB_DBNAME}`);

    // Clear existing data
    await User.deleteMany({});
    await Word.deleteMany({});
    await Topic.deleteMany({});
    await Quiz.deleteMany({});
    await QuizAttempt.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ielts.com',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
      xp: 1000,
      streak: 5,
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'John Doe',
      email: 'user@ielts.com',
      passwordHash: userPassword,
      role: UserRole.USER,
      emailVerified: true,
      xp: 500,
      streak: 3,
    });

    console.log('Created users');

    // Create topics
    const topics = await Topic.create([
      { name: 'Business', description: 'Business and workplace vocabulary' },
      { name: 'Education', description: 'Academic and learning vocabulary' },
      { name: 'Environment', description: 'Nature and environmental topics' },
      { name: 'Technology', description: 'Modern technology vocabulary' },
      { name: 'Health', description: 'Health and wellness vocabulary' },
    ]);

    console.log('Created topics');

    // Create vocabulary words
    const words = await Word.insertMany([
      {
        word: 'abandon',
        meaning: 'to leave behind or give up completely',
        exampleSentence: 'They had to abandon their home due to the flood.',
        difficulty: 'intermediate',
        topic: 'General',
        partOfSpeech: 'verb',
        pronunciation: 'əˈbændən',
        synonyms: ['desert', 'forsake', 'leave'],
        antonyms: ['keep', 'maintain', 'continue'],
      },
      {
        word: 'abundant',
        meaning: 'existing in large quantities',
        exampleSentence: 'The region has abundant natural resources.',
        difficulty: 'intermediate',
        topic: 'Environment',
        partOfSpeech: 'adjective',
        pronunciation: 'əˈbʌndənt',
        synonyms: ['plentiful', 'ample', 'copious'],
        antonyms: ['scarce', 'sparse', 'limited'],
      },
      {
        word: 'accomplish',
        meaning: 'to achieve or complete successfully',
        exampleSentence: 'She accomplished all her goals this year.',
        difficulty: 'intermediate',
        topic: 'General',
        partOfSpeech: 'verb',
        pronunciation: 'əˈkʌmplɪʃ',
        synonyms: ['achieve', 'complete', 'fulfill'],
        antonyms: ['fail', 'abandon', 'neglect'],
      },
      {
        word: 'innovative',
        meaning: 'featuring new methods or ideas',
        exampleSentence: 'The company is known for its innovative products.',
        difficulty: 'advanced',
        topic: 'Technology',
        partOfSpeech: 'adjective',
        pronunciation: 'ˈɪnəveɪtɪv',
        synonyms: ['creative', 'original', 'novel'],
        antonyms: ['conventional', 'traditional', 'outdated'],
      },
      {
        word: 'sustain',
        meaning: 'to maintain or keep going',
        exampleSentence: 'We need to sustain economic growth.',
        difficulty: 'advanced',
        topic: 'Business',
        partOfSpeech: 'verb',
        pronunciation: 'səˈsteɪn',
        synonyms: ['maintain', 'support', 'preserve'],
        antonyms: ['abandon', 'discontinue', 'halt'],
      },
      {
        word: 'comprehensive',
        meaning: 'complete and including everything',
        exampleSentence: 'The report provides a comprehensive analysis.',
        difficulty: 'advanced',
        topic: 'Education',
        partOfSpeech: 'adjective',
        pronunciation: 'ˌkɒmprɪˈhensɪv',
        synonyms: ['complete', 'thorough', 'extensive'],
        antonyms: ['partial', 'incomplete', 'limited'],
      },
      {
        word: 'vital',
        meaning: 'absolutely necessary or essential',
        exampleSentence: 'Regular exercise is vital for good health.',
        difficulty: 'intermediate',
        topic: 'Health',
        partOfSpeech: 'adjective',
        pronunciation: 'ˈvaɪtl',
        synonyms: ['essential', 'crucial', 'critical'],
        antonyms: ['unnecessary', 'unimportant', 'trivial'],
      },
      {
        word: 'establish',
        meaning: 'to set up or create something',
        exampleSentence: 'The company was established in 1995.',
        difficulty: 'intermediate',
        topic: 'Business',
        partOfSpeech: 'verb',
        pronunciation: 'ɪˈstæblɪʃ',
        synonyms: ['create', 'found', 'institute'],
        antonyms: ['abolish', 'destroy', 'dissolve'],
      },
    ] as any[]);

    console.log('Created vocabulary words');

    // Create sample quiz attempts
    await QuizAttempt.create([
      {
        userId: user._id,
        topic: 'Business',
        difficulty: 'intermediate',
        questions: [
          {
            wordId: words[4]._id,
            selectedAnswer: 'maintain',
            correctAnswer: 'maintain',
            isCorrect: true,
            timeSpent: 5000,
          },
          {
            wordId: words[7]._id,
            selectedAnswer: 'create',
            correctAnswer: 'create',
            isCorrect: true,
            timeSpent: 4500,
          },
        ],
        score: 2,
        totalQuestions: 2,
        startTime: new Date(Date.now() - 86400000),
        endTime: new Date(Date.now() - 86390000),
        totalTimeSpent: 9500,
      },
      {
        userId: user._id,
        topic: 'Technology',
        difficulty: 'advanced',
        questions: [
          {
            wordId: words[3]._id,
            selectedAnswer: 'creative',
            correctAnswer: 'creative',
            isCorrect: true,
            timeSpent: 6000,
          },
        ],
        score: 1,
        totalQuestions: 1,
        startTime: new Date(Date.now() - 172800000),
        endTime: new Date(Date.now() - 172794000),
        totalTimeSpent: 6000,
      },
    ]);

    console.log('Created quiz attempts');

    // Create Real Quiz Definitions
    await Quiz.create([
      {
        title: 'Business Vocabulary Basics',
        description: 'Test your knowledge of essential business terms.',
        topic: 'Business',
        difficulty: 'intermediate',
        duration: 20,
        isActive: true,
        questions: [
          {
            wordId: words[4]._id, // sustain
            questionText: 'Which word means to maintain or keep going?',
            options: ['sustain', 'abandon', 'create', 'ignore'],
            correctAnswer: 'sustain',
          },
          {
            wordId: words[7]._id, // establish
            questionText: 'Select the synonym for "found" or "institute".',
            options: ['establish', 'abolish', 'finish', 'hide'],
            correctAnswer: 'establish',
          },
        ],
      },
      {
        title: 'Advanced Technology Terms',
        description: 'Challenge yourself with advanced tech vocabulary.',
        topic: 'Technology',
        difficulty: 'advanced',
        duration: 15,
        isActive: true,
        questions: [
          {
            wordId: words[3]._id, // innovative
            questionText: 'What is the best definition for "innovative"?',
            options: [
              'featuring new methods',
              'old fashioned',
              'boring',
              'expensive',
            ],
            correctAnswer: 'featuring new methods',
          },
        ],
      },
    ]);
    console.log('Created quiz definitions');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('Admin: admin@ielts.com / admin123');
    console.log('User:  user@ielts.com / user123');
    console.log(`\nCreated ${words.length} vocabulary words`);
    console.log(`Created ${topics.length} topics`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
