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
      xp: 500,
      streak: 3,
    });

    console.log('Created users');

    // Create topics
    const topics = await Topic.create([
      { name: 'General', description: 'General everyday vocabulary' },
      { name: 'Business', description: 'Business and workplace vocabulary' },
      { name: 'Education', description: 'Academic and learning vocabulary' },
      { name: 'Environment', description: 'Nature and environmental topics' },
      { name: 'Technology', description: 'Modern technology vocabulary' },
      { name: 'Health', description: 'Health and wellness vocabulary' },
    ]);

    console.log('Created topics');

    const topicMap = topics.reduce((acc, topic) => {
      acc[topic.name] = topic._id;
      return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    // Fail fast if a seed word references a missing topic key
    if (!topicMap['General'])
      throw new Error('Seed misconfig: missing topic "General"');

    // Create vocabulary words
    const words = await Word.insertMany([
      // BEGINNER LEVEL WORDS (10 words)
      {
        word: 'important',
        meaning: 'of great value or significance',
        exampleSentence: 'It is important to study every day.',
        difficulty: 'beginner',
        topic: topicMap['General'],
        partOfSpeech: 'adjective',
        synonyms: ['significant', 'valuable', 'essential'],
        antonyms: ['unimportant', 'trivial', 'minor'],
      },
      {
        word: 'simple',
        meaning: 'easy to understand or do',
        exampleSentence: 'The instructions are very simple.',
        difficulty: 'beginner',
        topic: topicMap['General'],
        partOfSpeech: 'adjective',
        synonyms: ['easy', 'basic', 'straightforward'],
        antonyms: ['complex', 'complicated', 'difficult'],
      },
      {
        word: 'happy',
        meaning: 'feeling pleasure or contentment',
        exampleSentence: 'She was happy to see her friends.',
        difficulty: 'beginner',
        topic: topicMap['General'],
        partOfSpeech: 'adjective',
        synonyms: ['joyful', 'pleased', 'content'],
        antonyms: ['sad', 'unhappy', 'miserable'],
      },
      {
        word: 'learn',
        meaning: 'to gain knowledge or skill',
        exampleSentence: 'Children learn quickly.',
        difficulty: 'beginner',
        topic: topicMap['Education'],
        partOfSpeech: 'verb',
        synonyms: ['study', 'acquire', 'grasp'],
        antonyms: ['forget', 'unlearn', 'ignore'],
      },
      {
        word: 'healthy',
        meaning: 'in good physical condition',
        exampleSentence: 'Eating vegetables helps you stay healthy.',
        difficulty: 'beginner',
        topic: topicMap['Health'],
        partOfSpeech: 'adjective',
        synonyms: ['fit', 'well', 'strong'],
        antonyms: ['unhealthy', 'sick', 'ill'],
      },
      {
        word: 'clean',
        meaning: 'free from dirt or pollution',
        exampleSentence: 'We need clean water to drink.',
        difficulty: 'beginner',
        topic: topicMap['Environment'],
        partOfSpeech: 'adjective',
        synonyms: ['pure', 'tidy', 'spotless'],
        antonyms: ['dirty', 'polluted', 'messy'],
      },
      {
        word: 'work',
        meaning: 'activity involving effort',
        exampleSentence: 'He goes to work every morning.',
        difficulty: 'beginner',
        topic: topicMap['Business'],
        partOfSpeech: 'noun/verb',
        synonyms: ['job', 'labor', 'employment'],
        antonyms: ['rest', 'leisure', 'play'],
      },
      {
        word: 'use',
        meaning: 'to employ for a purpose',
        exampleSentence: 'We use computers every day.',
        difficulty: 'beginner',
        topic: topicMap['Technology'],
        partOfSpeech: 'verb',
        synonyms: ['utilize', 'employ', 'apply'],
        antonyms: ['discard', 'abandon', 'waste'],
      },
      {
        word: 'big',
        meaning: 'of considerable size',
        exampleSentence: 'They live in a big house.',
        difficulty: 'beginner',
        topic: topicMap['General'],
        partOfSpeech: 'adjective',
        synonyms: ['large', 'huge', 'enormous'],
        antonyms: ['small', 'tiny', 'little'],
      },
      {
        word: 'help',
        meaning: 'to assist or aid',
        exampleSentence: 'Can you help me with this?',
        difficulty: 'beginner',
        topic: topicMap['General'],
        partOfSpeech: 'verb',
        synonyms: ['assist', 'aid', 'support'],
        antonyms: ['hinder', 'obstruct', 'harm'],
      },

      // INTERMEDIATE LEVEL WORDS (15 words)
      {
        word: 'abandon',
        meaning: 'to leave behind or give up completely',
        exampleSentence: 'They had to abandon their home due to the flood.',
        difficulty: 'intermediate',
        topic: topicMap['General'],
        partOfSpeech: 'verb',
        synonyms: ['desert', 'forsake', 'leave'],
        antonyms: ['keep', 'maintain', 'continue'],
      },
      {
        word: 'abundant',
        meaning: 'existing in large quantities',
        exampleSentence: 'The region has abundant natural resources.',
        difficulty: 'intermediate',
        topic: topicMap['Environment'],
        partOfSpeech: 'adjective',
        synonyms: ['plentiful', 'ample', 'copious'],
        antonyms: ['scarce', 'sparse', 'limited'],
      },
      {
        word: 'accomplish',
        meaning: 'to achieve or complete successfully',
        exampleSentence: 'She accomplished all her goals this year.',
        difficulty: 'intermediate',
        topic: topicMap['General'],
        partOfSpeech: 'verb',
        synonyms: ['achieve', 'complete', 'fulfill'],
        antonyms: ['fail', 'abandon', 'neglect'],
      },
      {
        word: 'vital',
        meaning: 'absolutely necessary or essential',
        exampleSentence: 'Regular exercise is vital for good health.',
        difficulty: 'intermediate',
        topic: topicMap['Health'],
        partOfSpeech: 'adjective',
        synonyms: ['essential', 'crucial', 'critical'],
        antonyms: ['unnecessary', 'unimportant', 'trivial'],
      },
      {
        word: 'establish',
        meaning: 'to set up or create something',
        exampleSentence: 'The company was established in 1995.',
        difficulty: 'intermediate',
        topic: topicMap['Business'],
        partOfSpeech: 'verb',
        synonyms: ['create', 'found', 'institute'],
        antonyms: ['abolish', 'destroy', 'dissolve'],
      },
      {
        word: 'efficient',
        meaning: 'achieving maximum productivity',
        exampleSentence: 'Solar panels are an efficient energy source.',
        difficulty: 'intermediate',
        topic: topicMap['Technology'],
        partOfSpeech: 'adjective',
        synonyms: ['effective', 'productive', 'capable'],
        antonyms: ['inefficient', 'wasteful', 'unproductive'],
      },
      {
        word: 'diverse',
        meaning: 'showing variety or differences',
        exampleSentence: 'The city has a diverse population.',
        difficulty: 'intermediate',
        topic: topicMap['General'],
        partOfSpeech: 'adjective',
        synonyms: ['varied', 'different', 'assorted'],
        antonyms: ['uniform', 'similar', 'identical'],
      },
      {
        word: 'evaluate',
        meaning: 'to assess the value or quality',
        exampleSentence: 'Teachers evaluate student performance.',
        difficulty: 'intermediate',
        topic: topicMap['Education'],
        partOfSpeech: 'verb',
        synonyms: ['assess', 'judge', 'appraise'],
        antonyms: ['ignore', 'overlook', 'disregard'],
      },
      {
        word: 'responsible',
        meaning: 'accountable for something',
        exampleSentence: 'We are responsible for protecting the environment.',
        difficulty: 'intermediate',
        topic: topicMap['Environment'],
        partOfSpeech: 'adjective',
        synonyms: ['accountable', 'liable', 'answerable'],
        antonyms: ['irresponsible', 'reckless', 'careless'],
      },
      {
        word: 'maintain',
        meaning: 'to keep in good condition',
        exampleSentence: 'It is important to maintain good health.',
        difficulty: 'intermediate',
        topic: topicMap['Health'],
        partOfSpeech: 'verb',
        synonyms: ['preserve', 'sustain', 'uphold'],
        antonyms: ['neglect', 'abandon', 'destroy'],
      },
      {
        word: 'achieve',
        meaning: 'to successfully reach a goal',
        exampleSentence: 'She worked hard to achieve success.',
        difficulty: 'intermediate',
        topic: topicMap['General'],
        partOfSpeech: 'verb',
        synonyms: ['accomplish', 'attain', 'reach'],
        antonyms: ['fail', 'lose', 'miss'],
      },
      {
        word: 'develop',
        meaning: 'to grow or cause to grow',
        exampleSentence: 'Countries develop their economies over time.',
        difficulty: 'intermediate',
        topic: topicMap['Business'],
        partOfSpeech: 'verb',
        synonyms: ['expand', 'grow', 'advance'],
        antonyms: ['decline', 'deteriorate', 'regress'],
      },
      {
        word: 'contribute',
        meaning: 'to give or add to',
        exampleSentence: 'Everyone should contribute to society.',
        difficulty: 'intermediate',
        topic: topicMap['General'],
        partOfSpeech: 'verb',
        synonyms: ['donate', 'provide', 'supply'],
        antonyms: ['withhold', 'take', 'receive'],
      },
      {
        word: 'benefit',
        meaning: 'an advantage or profit',
        exampleSentence: 'Exercise has many health benefits.',
        difficulty: 'intermediate',
        topic: topicMap['Health'],
        partOfSpeech: 'noun',
        synonyms: ['advantage', 'gain', 'profit'],
        antonyms: ['disadvantage', 'loss', 'harm'],
      },
      {
        word: 'impact',
        meaning: 'a strong effect or influence',
        exampleSentence: 'Technology has a huge impact on daily life.',
        difficulty: 'intermediate',
        topic: topicMap['Technology'],
        partOfSpeech: 'noun',
        synonyms: ['effect', 'influence', 'consequence'],
        antonyms: ['insignificance', 'triviality'],
      },

      // ADVANCED LEVEL WORDS (10 words)
      {
        word: 'innovative',
        meaning: 'featuring new methods or ideas',
        exampleSentence: 'The company is known for its innovative products.',
        difficulty: 'advanced',
        topic: topicMap['Technology'],
        partOfSpeech: 'adjective',
        synonyms: ['creative', 'original', 'novel'],
        antonyms: ['conventional', 'traditional', 'outdated'],
      },
      {
        word: 'sustain',
        meaning: 'to maintain or keep going',
        exampleSentence: 'We need to sustain economic growth.',
        difficulty: 'advanced',
        topic: topicMap['Business'],
        partOfSpeech: 'verb',
        synonyms: ['maintain', 'support', 'preserve'],
        antonyms: ['abandon', 'discontinue', 'halt'],
      },
      {
        word: 'comprehensive',
        meaning: 'complete and including everything',
        exampleSentence: 'The report provides a comprehensive analysis.',
        difficulty: 'advanced',
        topic: topicMap['Education'],
        partOfSpeech: 'adjective',
        synonyms: ['complete', 'thorough', 'extensive'],
        antonyms: ['partial', 'incomplete', 'limited'],
      },
      {
        word: 'deteriorate',
        meaning: 'to become progressively worse',
        exampleSentence: 'Air quality continues to deteriorate in cities.',
        difficulty: 'advanced',
        topic: topicMap['Environment'],
        partOfSpeech: 'verb',
        synonyms: ['decline', 'worsen', 'degrade'],
        antonyms: ['improve', 'enhance', 'develop'],
      },
      {
        word: 'implement',
        meaning: 'to put a plan into action',
        exampleSentence: 'The government will implement new policies.',
        difficulty: 'advanced',
        topic: topicMap['Business'],
        partOfSpeech: 'verb',
        synonyms: ['execute', 'apply', 'enforce'],
        antonyms: ['abandon', 'cancel', 'discard'],
      },
      {
        word: 'mitigate',
        meaning: 'to make less severe or serious',
        exampleSentence: 'Measures to mitigate climate change are essential.',
        difficulty: 'advanced',
        topic: topicMap['Environment'],
        partOfSpeech: 'verb',
        synonyms: ['alleviate', 'reduce', 'lessen'],
        antonyms: ['aggravate', 'worsen', 'intensify'],
      },
      {
        word: 'resilient',
        meaning: 'able to recover quickly from difficulties',
        exampleSentence: 'Resilient people overcome challenges easily.',
        difficulty: 'advanced',
        topic: topicMap['Health'],
        partOfSpeech: 'adjective',
        synonyms: ['robust', 'strong', 'tough'],
        antonyms: ['weak', 'fragile', 'vulnerable'],
      },
      {
        word: 'scrutinize',
        meaning: 'to examine closely and critically',
        exampleSentence: 'Researchers scrutinize data carefully.',
        difficulty: 'advanced',
        topic: topicMap['Education'],
        partOfSpeech: 'verb',
        synonyms: ['examine', 'inspect', 'analyze'],
        antonyms: ['ignore', 'overlook', 'skim'],
      },
      {
        word: 'paradigm',
        meaning: 'a typical example or pattern',
        exampleSentence: 'The new technology represents a paradigm shift.',
        difficulty: 'advanced',
        topic: topicMap['Technology'],
        partOfSpeech: 'noun',
        synonyms: ['model', 'pattern', 'framework'],
        antonyms: ['anomaly', 'exception', 'deviation'],
      },
      {
        word: 'integral',
        meaning: 'necessary to make something complete',
        exampleSentence: 'Technology is integral to modern business.',
        difficulty: 'advanced',
        topic: topicMap['Business'],
        partOfSpeech: 'adjective',
        synonyms: ['essential', 'fundamental', 'vital'],
        antonyms: ['peripheral', 'unnecessary', 'optional'],
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
