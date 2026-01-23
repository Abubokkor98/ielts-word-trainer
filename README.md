# IELTS Vocabulary Learning Platform

A comprehensive, free web-based platform designed to help IELTS candidates master essential vocabulary through interactive learning, spaced repetition, and adaptive quizzes.

## Live Demo

**User App**: [https://ieltsvocabs.vercel.app](https://ieltsvocabs.vercel.app)  
**Admin Panel**: [https://admin-ieltsvocabs.vercel.app](https://admin-ieltsvocabs.vercel.app)

## Table of Contents

- [The Story Behind This Project](#the-story-behind-this-project)
- [For Learners & Users](#for-learners--users)
  - [Getting Started](#getting-started)
  - [Learning Features](#learning-features)
  - [Best Learning Practices](#best-learning-practices)
  - [Understanding Your Analytics](#understanding-your-analytics)
- [Quick Start](#quick-start)
- [For Developers](#for-developers)
  - [Architecture Overview](#architecture-overview)
  - [Tech Stack](#tech-stack)
  - [Key Features Implementation](#key-features-implementation)
  - [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Developer Setup Guide](#developer-setup-guide)
- [Performance & Scalability](#performance--scalability)
- [Accessibility](#accessibility)
- [Privacy & Data Security](#privacy--data-security)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)
- [Contact & Support](#contact--support)

## The Story Behind This Project

When I decided to improve my English and prepare for the IELTS exam, I searched for quality vocabulary learning resources. To my disappointment, I found that most available IELTS vocabulary apps were behind paywalls, with very few free alternatives that met my learning needs.

This frustration became my motivation. I realized that many aspiring IELTS candidates face the same challenge - the financial barrier to accessing quality learning resources. I didn't want others to experience the same hassle and stress I went through.

That's when I decided to build this platform: a completely free, comprehensive IELTS vocabulary learning website that would eliminate these barriers and provide everyone with the tools they need to succeed, without any cost or compromise on quality.

## For Learners & Users

### Getting Started

#### Creating Your Account

1. Navigate to the user app
2. Click on "Register" in the navigation bar
3. Fill in your details (name, email, password)
4. Log in to access your personalized dashboard

#### First-Time User Journey

After logging in, you'll see your dashboard with:

- **Your Stats**: XP (experience points), current streak, quiz performance
- **Review Cards**: Number of vocabulary words due for review today
- **Quick Actions**: Direct access to vocabulary library, review sessions, and quizzes

### Learning Features

#### Vocabulary Library

Browse and explore over 3500+ IELTS vocabulary words organized by:

- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **IELTS Modules**: Reading, Writing, Listening, Speaking
- **Topics**: Business, Education, Environment, Health, Technology, and more
- **Search**: Find specific words or filter by synonyms/antonyms

Each vocabulary entry includes:

- Word definition and meaning
- Example sentences in context
- Synonyms and antonyms
- Part of speech
- Audio pronunciation (UK English)

#### Spaced Repetition System (SRS)

Our SRS feature uses a scientifically-proven algorithm to optimize your learning retention:

**How It Works:**

1. When you first encounter a word, it's added to your learning queue
2. After reviewing, you rate how well you knew the word (1-5 scale)
3. Based on your rating, the system schedules the next review
4. Words you struggle with appear more frequently
5. Words you master appear less often, but at optimal intervals

**Review Schedule:**

- New words: Reviewed within 1 day
- Learning words: Reviewed every 1-10 days based on performance
- Reviewing words: Reviewed every 10-30 days
- Mastered words: Reviewed occasionally to maintain retention

**Quality Ratings:**

- **5 (Perfect)**: You knew the answer instantly and confidently
- **4 (Correct)**: You knew the answer after brief hesitation
- **3 (Difficult)**: You knew the answer but struggled significantly
- **2 (Wrong)**: You didn't know but recognized it after seeing the answer
- **1 (Blackout)**: Complete memory failure

#### Quiz System

Test your knowledge with adaptive quizzes:

**Difficulty Levels:**

- **Beginner**: Basic vocabulary with simpler questions
- **Intermediate**: Moderate difficulty with context-based questions
- **Advanced**: Challenging vocabulary and complex scenarios
- **Mixed**: Random difficulty for comprehensive practice

**Question Types:**

- Multiple choice definitions
- Synonym identification
- Antonym selection
- Fill-in-the-blank with context
- Meaning in context

**Scoring & XP:**

- Correct answers earn experience points (XP)
- Maintain daily streaks for bonus XP
- Quiz performance tracked in analytics
- Personalized difficulty recommendations based on performance

#### Progress Tracking

Monitor your learning journey through comprehensive analytics:

- **XP System**: Earn points for quizzes and reviews
- **Daily Streaks**: Build consistency with daily practice
- **Quiz Analytics**: Track accuracy, average scores, and improvement trends
- **SRS Statistics**: Monitor cards in different learning stages
- **Review Schedule**: See upcoming reviews for the next 7 days

#### Profile Management

Customize your learning experience:

- Update personal information
- Change password securely
- View learning statistics
- Track achievement milestones

### Best Learning Practices

#### Recommended Daily Routine

**Morning (10-15 minutes)**

1. Complete all due SRS reviews
2. Add 5-10 new words from the vocabulary library

**Afternoon/Evening (15-20 minutes)**

3. Take one quiz at your current difficulty level
4. Review any words you got wrong in the quiz
5. Browse vocabulary library for new words related to your weak topics

**Consistency Tips:**

- Maintain a daily streak, even if just 5 minutes
- Don't skip SRS reviews - they're scheduled at optimal intervals
- Quality over quantity: Better to learn 5 words well than 20 poorly

#### Maximizing SRS Effectiveness

1. **Be Honest with Ratings**: Accurate self-assessment is crucial

   - Don't inflate your ratings - it will hurt retention
   - If you hesitated, it's not a 5

2. **Review Context**: Always read the example sentence

   - Understanding usage is more important than memorizing definitions

3. **Use Active Recall**: Try to remember before looking at the answer

   - Cover the answer and test yourself
   - Engage with the word actively

4. **Regular Sessions**: Review daily, even if briefly

   - Consistency beats cramming
   - Spaced repetition works best with regular intervals

5. **Don't Reset Progress**: Stick with the schedule
   - Trust the algorithm
   - Temporary forgetting is part of the learning process

#### Combining Features for Maximum Impact

**Week 1-2: Foundation**

- Focus on beginner difficulty vocabulary
- Add 10-15 new words daily to SRS
- Take beginner quizzes to build confidence
- Aim for 80%+ accuracy before advancing

**Week 3-4: Progression**

- Mix beginner and intermediate vocabulary
- Maintain daily SRS reviews (critical phase)
- Take intermediate quizzes
- Review quiz mistakes and add to SRS

**Week 5+: Mastery**

- Focus on intermediate and advanced vocabulary
- Continue daily SRS reviews (this never stops)
- Take mixed difficulty quizzes
- Identify weak topics and target them specifically

#### Tips for Maximum Learning Outcomes

1. **Focus on Weak Areas**: Use analytics to identify struggling topics
2. **Context is King**: Always learn words in sentences, not isolation
3. **Regular Review**: Don't let SRS reviews pile up
4. **Active Usage**: Try using new words in writing practice
5. **Topic Clustering**: Learn related words together (e.g., all environment vocabulary)
6. **Patience**: Language learning is a marathon, not a sprint

#### Understanding Difficulty Progression

- **Beginner**: Common words, basic meanings (Band 5-6 level)
- **Intermediate**: Less common words, multiple meanings (Band 6.5-7 level)
- **Advanced**: Academic/sophisticated vocabulary (Band 7.5+ level)

Don't rush to advanced difficulty. Master each level thoroughly.

### Understanding Your Analytics

#### XP (Experience Points)

**What is XP?**
XP represents your overall learning effort and achievement on the platform.

**How to Earn XP:**

- Complete quizzes (XP based on score and difficulty)
- Maintain daily streaks (bonus XP)
- Review SRS cards (consistent practice)

**Why it Matters:**
XP reflects consistency and effort, not just correctness. It motivates regular practice.

#### Streak System

**What is a Streak?**
A streak counts consecutive days you've been active on the platform.

**How to Maintain:**

- Complete at least one quiz OR
- Review at least one SRS card per day

**Benefits:**

- Builds habit consistency
- Bonus XP multipliers
- Psychological motivation

**Streak Resets:**
Missing a day resets your streak to zero. Set daily reminders to maintain momentum.

#### Quiz Performance Metrics

**Average Score:**

- Your mean score across all quizzes
- Tracked separately by difficulty level
- Target: 80%+ before moving to next difficulty

**Total Quizzes:**

- Number of quizzes completed
- More practice = better retention

**Score Trends:**

- Upward trend indicates improvement
- Plateau suggests need for difficulty adjustment
- Downward trend may indicate too fast progression

#### SRS Statistics Interpretation

**Card Distribution:**

- **New**: Words you haven't reviewed yet
- **Learning**: Words you're actively learning (0-10 day intervals)
- **Reviewing**: Words you know but need periodic review (10-30 days)
- **Mastered**: Words with strong retention (30+ days)

**Healthy Distribution:**

- New: 5-10% (continuous fresh learning)
- Learning: 40-50% (active study phase)
- Reviewing: 30-40% (reinforcement phase)
- Mastered: 10-20% (achievement)

**Due Count:**
Number of cards scheduled for review today. Aim to complete all daily reviews for optimal results.

**Recommended Review Schedule:**
View your next 7 days of scheduled reviews to plan study time effectively.

## Quick Start

### Prerequisites

- Node.js 20 or higher
- pnpm 8 or higher
- MongoDB instance (local or cloud)

### Installation

```bash
# Clone the repository
git clone https://github.com/Abubokkor98/ielts-word-trainer.git
cd ielts-word-trainer

# Install dependencies
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/user/.env.example apps/user/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# Configure your environment variables
# Edit the .env files with your actual values

# Seed the database with sample vocabulary
pnpm seed

# Start all applications
pnpm dev
```

The applications will be available at:

- User App: <http://localhost:3000>
- Admin Panel: <http://localhost:3001>
- Backend API: <http://localhost:3333>

## For Developers

### Architecture Overview

This project is built as an Nx monorepo containing three main applications that work together to deliver a comprehensive learning platform:

**Frontend Applications (Next.js 16)**

- **User App**: Public-facing learning platform where students browse vocabulary, take quizzes, and track progress
- **Admin Panel**: Internal management dashboard for vocabulary CRUD operations, user management, and analytics

**Backend API (Express.js)**

- RESTful API serving both frontend applications
- MongoDB database for persistent storage
- JWT-based authentication with refresh token rotation
- Role-based access control (User, Admin, Super Admin)

**Shared Libraries**

- Common TypeScript types and interfaces
- Shared validation schemas (Zod)
- Utility functions used across apps

**Design Decisions:**

- Monorepo structure for code sharing and unified development
- Separate user and admin apps for security and optimization
- Feature-based architecture for maintainability and scalability
- Client-side state management with Zustand for auth persistence
- Server state management with TanStack Query for caching and synchronization

### Tech Stack

#### Frontend

**Framework & Libraries**

- **Next.js 16**: React framework with App Router for server-side rendering and routing
- **React 19**: Latest React with improved concurrent features
- **TypeScript 5.9**: Type safety and developer experience
- **Chakra UI 2.x**: Component library for consistent, accessible UI
- **TanStack Query 5.x**: Server state management, caching, and synchronization
- **Zustand 5.x**: Lightweight client state management for auth and UI state
- **React Hook Form**: Performant form handling with validation
- **Zod**: Runtime type validation and schema parsing
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Data visualization for analytics

**Styling & UI**

- **Tailwind CSS**: Utility-first CSS framework
- **Emotion**: CSS-in-JS for Chakra UI styling
- **Lucide React**: Icon library

**Development Tools**

- **Nx**: Monorepo tooling and build orchestration
- **Biome**: Fast linting and formatting
- **pnpm**: Efficient package management

#### Backend

**Server & Framework**

- **Node.js 20**: Runtime environment
- **Express.js 4**: Web application framework
- **TypeScript**: Type-safe backend development

**Database & ODM**

- **MongoDB**: NoSQL database for flexible schema
- **Mongoose 9**: ODM for MongoDB with schema validation and middleware

**Authentication & Security**

- **JWT (jsonwebtoken)**: Stateless authentication tokens
- **bcryptjs**: Password hashing
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing configuration
- **express-rate-limit**: API rate limiting protection

**File Processing**

- **Multer**: File upload handling for CSV imports
- **csv-parse**: CSV parsing for vocabulary imports

**Logging & Monitoring**

- **Winston**: Structured logging
- **Morgan**: HTTP request logging

**Development & Build**

- **tsx**: TypeScript execution for development
- **SWC**: Fast TypeScript/JavaScript compilation
- **Nx**: Build and task orchestration

#### DevOps & Deployment

- **Vercel**: Frontend hosting (user and admin apps)
- **Render**: Backend API hosting
- **MongoDB Atlas**: Cloud database hosting
- **Docker**: Containerization for backend deployment
- **Git**: Version control
- **GitHub**: Code repository and CI/CD

### Key Features Implementation

#### Spaced Repetition Algorithm (SM-2 Variant)

Our SRS implementation is based on the SuperMemo SM-2 algorithm with custom modifications:

**Algorithm Overview:**

```typescript
// Core calculation
interval = previousInterval * easeFactor;
easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
```

**Key Components:**

- **Interval**: Days until next review
- **Ease Factor**: Multiplier determining spacing growth (minimum 1.3)
- **Quality**: User rating from 1-5
- **Repetition Count**: Number of successful reviews
- **Lapse Count**: Number of times forgotten

**Implementation Details:**

- Initial interval: 1 day for new words
- Quality < 3 resets card to learning status
- Minimum ease factor: 1.3 (prevents cards from becoming too frequent)
- Maximum interval: 180 days (prevents indefinite spacing)

**Status Progression:**

- **New** → **Learning** (on first review)
- **Learning** → **Reviewing** (after 3 successful reviews with quality ≥ 3)
- **Reviewing** → **Mastered** (interval > 30 days)
- Any status → **Learning** (on quality < 3 - lapse)

#### Quiz Generation Logic

Adaptive quiz generation based on user performance and preferences:

**Question Pool Selection:**

1. Filter words by selected difficulty (or mixed)
2. Prioritize words from user's weak topics (based on past performance)
3. Include variety of question types for engagement
4. Ensure no duplicate words in same quiz

**Question Types Distribution:**

- 40% Definition-based questions
- 30% Synonym/Antonym questions
- 20% Context-based questions
- 10% Fill-in-the-blank

**Difficulty Recommendation:**

- Calculates average quiz performance
- Recommends level-up if 80%+ average in current level
- Recommends level-down if <60% average

**XP Calculation:**

```text
Base XP = 10 points per question
Difficulty Multiplier: Beginner (1x), Intermediate (1.5x), Advanced (2x)
XP Earned = (Correct Answers × Base XP × Multiplier)
Streak Bonus = (XP Earned × 0.1 × Streak Days) [capped at 2x]
```

#### Authentication & Authorization Flow

**Registration:**

1. User submits registration form
2. Backend validates email uniqueness
3. Password hashed with bcrypt (10 salt rounds)
4. User document created in MongoDB
5. Access token (15min) and refresh token (7 days) issued
6. Tokens sent via HTTP-only cookies

**Login:**

1. User submits credentials
2. Backend verifies email and password
3. New token pair generated
4. Existing refresh tokens for this user invalidated
5. Tokens sent via HTTP-only cookies

**Token Refresh:**

1. Frontend detects access token expiration (401 response)
2. Automatically sends refresh token to `/auth/refresh`
3. Backend validates refresh token
4. New access token issued
5. Request retried with new token

**Authorization:**

- Middleware verifies JWT on protected routes
- Role-based access control (RBAC) for admin endpoints
- User context injected into request object

**Security Features:**

- HTTP-only cookies prevent XSS token theft
- Refresh token rotation prevents replay attacks
- Old refresh tokens invalidated on new login
- Rate limiting on auth endpoints

#### Rate Limiting Strategy

**Tiered Rate Limiting:**

```typescript
// Strict: 10 requests per 10 minutes (expensive operations)
- Quiz generation
- CSV imports

// Moderate: 30 requests per minute (search/filter)
- Vocabulary search
- SRS statistics

// Light: 100 requests per minute (read operations)
- Single word lookup
- User profile

// Write operations: 100 requests per 10 minutes
- SRS reviews
- Quiz submissions
```

**Implementation:**

- Per-IP rate limiting for public endpoints
- Per-user rate limiting for authenticated endpoints
- Custom error messages for rate limit exceeded
- Headers expose rate limit info to clients

#### CSV Import/Export for Vocabulary

**Import Features:**

- Bulk vocabulary upload for admins
- Schema validation with Zod
- Atomic transactions (all-or-nothing import)
- Duplicate detection by word field
- Progress reporting for large files

**Export Features:**

- Export all vocabulary to CSV
- Filter exports by difficulty, module, or topic
- Include all word fields (meaning, synonyms, antonyms, etc.)

**CSV Schema:**

```csv
word,meaning,exampleSentence,synonyms,antonyms,partOfSpeech,difficulty,modules,topics
```

### Project Structure

```text
ielts-vocabs-app/
├── apps/
│   ├── backend/                  # Express API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/         # Authentication & authorization
│   │   │   │   ├── users/        # User management
│   │   │   │   ├── words/        # Vocabulary CRUD
│   │   │   │   ├── topics/       # Topic management
│   │   │   │   ├── srs/          # Spaced repetition system
│   │   │   │   ├── quiz/         # Quiz generation & attempts
│   │   │   │   └── admin/        # Admin-specific features
│   │   │   ├── core/             # Middleware, errors, services
│   │   │   ├── shared/           # Shared types & constants
│   │   │   ├── config/           # Environment & database config
│   │   │   ├── main.ts           # Application entry point
│   │   │   └── seed.ts           # Database seeding script
│   │   └── .env.example
│   │
│   ├── user/                     # User-facing Next.js app
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router pages
│   │   │   ├── features/         # Feature modules
│   │   │   │   ├── landing/      # Landing page components
│   │   │   │   ├── auth/         # Login, register, password reset
│   │   │   │   ├── dashboard/    # User dashboard
│   │   │   │   ├── vocabulary/   # Vocabulary library
│   │   │   │   ├── review/       # SRS review session
│   │   │   │   ├── quiz/         # Quiz interface
│   │   │   │   ├── analytics/    # User analytics
│   │   │   │   └── profile/      # User profile
│   │   │   ├── components/       # Shared components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── types/            # TypeScript types
│   │   │   └── proxy.ts          # Next.js middleware for auth
│   │   └── .env.example
│   │
│   └── admin/                    # Admin panel Next.js app
│       ├── src/
│       │   ├── app/              # Next.js App Router pages
│       │   ├── features/         # Feature modules
│       │   │   ├── dashboard/    # Admin dashboard
│       │   │   ├── vocabulary/   # Vocabulary management
│       │   │   └── users/        # User management
│       │   ├── components/       # Shared admin components
│       │   └── proxy.ts          # Admin auth middleware
│       └── .env.example
│
├── libs/
│   └── shared/                   # Shared libraries
│       ├── auth/                 # Auth utilities & stores
│       ├── ui/                   # Shared UI components
│       └── types/                # Shared TypeScript types
│
├── docs/                         # Additional documentation
├── .env.README.md                # Environment setup guide
├── package.json                  # Root package file
├── pnpm-workspace.yaml           # pnpm workspace config
├── nx.json                       # Nx workspace config
├── tsconfig.base.json            # Base TypeScript config
└── biome.json                    # Biome linter config
```

## API Documentation

Base URL: `http://localhost:3333/api/v1` (development)

All endpoints return JSON responses. Protected endpoints require JWT token in cookies.

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "xp": 0,
      "streak": 0
    }
  },
  "message": "User registered successfully"
}
```

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "xp": 150,
      "streak": 5
    }
  },
  "message": "Login successful"
}
```

#### Logout

```http
POST /api/v1/auth/logout

Response: 200 OK
{
  "success": true,
  "message": "Logout successful"
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh

Response: 200 OK
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

#### Password Reset Request

```http
POST /api/v1/password/request-reset
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset link sent to email"
}
```

#### Reset Password

```http
POST /api/v1/password/reset
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Password reset successful"
}
```

### Vocabulary Endpoints

#### Get All Words (with filters)

```http
GET /api/v1/words?page=1&limit=20&difficulty=intermediate&module=reading&topic=technology&search=innovate

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- difficulty: 'beginner' | 'intermediate' | 'advanced'
- module: 'reading' | 'writing' | 'listening' | 'speaking'
- topic: string (topic name or ID)
- search: string (searches word, synonyms, antonyms)

Response: 200 OK
{
  "success": true,
  "data": {
    "words": [
      {
        "id": "word_id",
        "word": "innovation",
        "meaning": "The introduction of new ideas or methods",
        "exampleSentence": "Technological innovation drives economic growth.",
        "synonyms": ["novelty", "invention", "breakthrough"],
        "antonyms": ["stagnation", "tradition"],
        "topics": ["technology", "business"],
        "partOfSpeech": "noun",
        "difficulty": "intermediate",
        "modules": ["reading", "writing"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 50,
      "totalWords": 1000,
      "limit": 20
    }
  }
}
```

#### Get Single Word

```http
GET /api/v1/words/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "word": {
      "id": "word_id",
      "word": "innovation",
      "meaning": "The introduction of new ideas or methods",
      "exampleSentence": "Technological innovation drives economic growth.",
      "synonyms": ["novelty", "invention", "breakthrough"],
      "antonyms": ["stagnation", "tradition"],
      "topics": ["technology", "business"],
      "partOfSpeech": "noun",
      "difficulty": "intermediate",
      "modules": ["reading", "writing"]
    }
  }
}
```

#### Get All Topics

```http
GET /api/v1/topics

Response: 200 OK
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": "topic_id",
        "name": "Technology",
        "slug": "technology",
        "description": "Words related to technology and innovation",
        "wordCount": 150
      }
    ]
  }
}
```

### SRS Endpoints

All SRS endpoints require authentication.

#### Get Due Words

```http
GET /api/v1/srs/due
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "data": {
    "dueWords": [
      {
        "id": "srs_item_id",
        "word": {
          "id": "word_id",
          "word": "innovation",
          "meaning": "The introduction of new ideas or methods",
          "exampleSentence": "...",
          "synonyms": [...],
          "antonyms": [...]
        },
        "nextReviewDate": "2026-01-22T00:00:00.000Z",
        "status": "learning",
        "repetition": 2
      }
    ],
    "count": 15
  }
}
```

#### Submit Review

```http
POST /api/v1/srs/review
Authorization: Required (JWT cookie)
Content-Type: application/json

{
  "wordId": "word_id",
  "quality": 4
}

Response: 200 OK
{
  "success": true,
  "data": {
    "srsItem": {
      "id": "srs_item_id",
      "wordId": "word_id",
      "status": "reviewing",
      "interval": 7,
      "nextReviewDate": "2026-01-29T00:00:00.000Z",
      "easeFactor": 2.6,
      "repetition": 3
    }
  },
  "message": "Review submitted successfully"
}
```

#### Get SRS Statistics

```http
GET /api/v1/srs/stats
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "data": {
    "stats": {
      "new": 50,
      "learning": 120,
      "reviewing": 80,
      "mastered": 30,
      "totalCards": 280,
      "dueToday": 15
    }
  }
}
```

#### Get Review Schedule

```http
GET /api/v1/srs/schedule?days=7
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "data": {
    "schedule": [
      {
        "date": "2026-01-23",
        "count": 15
      },
      {
        "date": "2026-01-24",
        "count": 12
      }
    ]
  }
}
```

#### Get Word SRS Status

```http
GET /api/v1/srs/word/:wordId
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "data": {
    "srsItem": {
      "status": "learning",
      "nextReviewDate": "2026-01-23T00:00:00.000Z",
      "interval": 3,
      "repetition": 1
    }
  }
}
```

### Quiz Endpoints

All quiz endpoints require authentication.

#### Generate Quiz

```http
GET /api/v1/quiz/generate?difficulty=intermediate&count=10
Authorization: Required (JWT cookie)

Query Parameters:
- difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed' (default: 'mixed')
- count: number (default: 10, max: 20)

Response: 200 OK
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "word_id",
        "type": "definition",
        "question": "What does 'innovation' mean?",
        "options": [
          "The introduction of new ideas or methods",
          "The process of maintaining tradition",
          "A type of business strategy",
          "An economic theory"
        ],
        "correctAnswer": "The introduction of new ideas or methods"
      }
    ]
  }
}
```

#### Save Quiz Attempt

```http
POST /api/v1/quiz/attempts
Authorization: Required (JWT cookie)
Content-Type: application/json

{
  "questions": [
    {
      "wordId": "word_id",
      "selectedAnswer": "The introduction of new ideas or methods",
      "correctAnswer": "The introduction of new ideas or methods",
      "isCorrect": true,
      "timeSpent": 5000,
      "questionType": "definition",
      "qualityRating": 5
    }
  ],
  "score": 8,
  "totalQuestions": 10,
  "startTime": "2026-01-22T10:00:00.000Z",
  "endTime": "2026-01-22T10:05:00.000Z",
  "totalTimeSpent": 300000,
  "difficulty": "intermediate"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "attemptId": "attempt_id",
    "xpEarned": 120,
    "newStreak": 6
  },
  "message": "Quiz attempt saved successfully"
}
```

#### Get User Quiz Attempts

```http
GET /api/v1/quiz/attempts?page=1&limit=10
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "data": {
    "attempts": [
      {
        "id": "attempt_id",
        "score": 8,
        "totalQuestions": 10,
        "difficulty": "intermediate",
        "xpEarned": 120,
        "createdAt": "2026-01-22T10:05:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "total": 50
    }
  }
}
```

#### Get User Analytics

```http
GET /api/v1/quiz/analytics/me
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "data": {
    "analytics": {
      "totalQuizzes": 25,
      "averageScore": 8.2,
      "totalQuestionsAnswered": 250,
      "correctAnswers": 205,
      "accuracy": 82,
      "byDifficulty": {
        "beginner": { "count": 10, "avgScore": 9.1 },
        "intermediate": { "count": 12, "avgScore": 8.0 },
        "advanced": { "count": 3, "avgScore": 6.3 }
      }
    }
  }
}
```

#### Get Recommended Difficulty

```http
GET /api/v1/quiz/recommend-difficulty
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "data": {
    "recommendedDifficulty": "advanced",
    "reason": "Your average score in intermediate is 85%"
  }
}
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Create Word

```http
POST /api/v1/words
Authorization: Required (JWT cookie, Admin role)
Content-Type: application/json

{
  "word": "innovation",
  "meaning": "The introduction of new ideas or methods",
  "exampleSentence": "Technological innovation drives economic growth.",
  "synonyms": ["novelty", "invention", "breakthrough"],
  "antonyms": ["stagnation", "tradition"],
  "topics": ["topic_id_1", "topic_id_2"],
  "partOfSpeech": "noun",
  "difficulty": "intermediate",
  "modules": ["reading", "writing"]
}

Response: 201 Created
{
  "success": true,
  "data": {
    "word": { /* created word object */ }
  },
  "message": "Word created successfully"
}
```

#### Update Word

```http
PATCH /api/v1/words/:id
Authorization: Required (JWT cookie, Admin role)
Content-Type: application/json

{
  "meaning": "Updated meaning",
  "difficulty": "advanced"
}

Response: 200 OK
{
  "success": true,
  "data": {
    "word": { /* updated word object */ }
  },
  "message": "Word updated successfully"
}
```

#### Delete Word

```http
DELETE /api/v1/words/:id
Authorization: Required (JWT cookie, Admin role)

Response: 200 OK
{
  "success": true,
  "message": "Word deleted successfully"
}
```

#### Upload CSV (Atomic)

```http
POST /api/v1/words/upload-atomic
Authorization: Required (JWT cookie, Admin role)
Content-Type: multipart/form-data

Body: FormData with 'file' field containing CSV

Response: 201 Created
{
  "success": true,
  "data": {
    "imported": 150,
    "failed": 0
  },
  "message": "CSV imported successfully"
}
```

#### Get Admin Dashboard Stats

```http
GET /api/v1/admin/dashboard/stats
Authorization: Required (JWT cookie, Admin role)

Response: 200 OK
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 500,
      "totalWords": 1200,
      "totalQuizzes": 5000,
      "activeUsersToday": 45
    }
  }
}
```

### Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

Common HTTP status codes:

- 400: Bad Request (validation errors)
- 401: Unauthorized (missing or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error

## Developer Setup Guide

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20 or higher ([Download](https://nodejs.org/))
- **pnpm**: Version 8 or higher
  ```bash
  npm install -g pnpm
  ```
- **MongoDB**: Local instance or cloud database (MongoDB Atlas)
  - Local: [Installation Guide](https://docs.mongodb.com/manual/installation/)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git**: For version control ([Download](https://git-scm.com/))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Abubokkor98/ielts-word-trainer.git
cd ielts-word-trainer
```

#### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo and all applications.

#### 3. Environment Setup

The project requires environment variables for each application. Example files are provided:

**Backend Environment**

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/ielts-vocab

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Server
PORT=3333
NODE_ENV=development

# CORS - Frontend URLs
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Email (Optional - for password reset)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
```

**User App Environment**

```bash
cp apps/user/.env.example apps/user/.env.local
```

Edit `apps/user/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
NEXT_PUBLIC_USER_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_APP_URL=http://localhost:3001
```

**Admin App Environment**

```bash
cp apps/admin/.env.example apps/admin/.env.local
```

Edit `apps/admin/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
NEXT_PUBLIC_USER_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_APP_URL=http://localhost:3001
```

For detailed environment variable documentation, see [.env.README.md](.env.README.md).

#### 4. Database Setup

**Start MongoDB** (if running locally):

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
# MongoDB should start automatically as a service
```

**Seed the Database** with sample vocabulary:

```bash
pnpm seed
```

This will populate your database with:

- Sample vocabulary words
- Topics
- An admin user (credentials will be displayed in console)

#### 5. Run Development Servers

**Option A: Run all applications concurrently**

```bash
pnpm dev
```

This starts:

- Backend API: <http://localhost:3333>
- User App: <http://localhost:3000>
- Admin Panel: <http://localhost:3001>

**Option B: Run applications individually**

In separate terminal windows:

```bash
# Terminal 1: Backend
pnpm dev:backend

# Terminal 2: User App
pnpm dev:user

# Terminal 3: Admin Panel
pnpm dev:admin
```

### Development Workflow

#### Project Commands

```bash
# Development
pnpm dev              # Run all apps (backend + user + admin)
pnpm dev:backend      # Run only backend
pnpm dev:user         # Run only user app
pnpm dev:admin        # Run only admin app

# Building
pnpm build            # Build all apps
pnpm build:backend    # Build backend
pnpm build:user       # Build user app
pnpm build:admin      # Build admin app

# Production
pnpm start            # Start all production builds
pnpm start:backend    # Start backend (requires build first)
pnpm start:user       # Start user app (requires build first)
pnpm start:admin      # Start admin app (requires build first)

# Database
pnpm seed             # Seed database with sample data

# Code Quality
pnpm lint             # Lint all applications
pnpm lint:fix         # Fix linting issues
pnpm lint:backend     # Lint only backend
pnpm lint:user        # Lint only user app
pnpm lint:admin       # Lint only admin app

# Testing
pnpm test             # Run all tests

# Cleanup
pnpm clean            # Remove build artifacts and node_modules
```

#### Code Standards

This project uses **Biome** for linting and formatting:

**Linting:**

```bash
pnpm lint:check       # Check for issues
pnpm lint:fix         # Auto-fix issues
```

**Pre-commit:**

- Ensure code passes linting before committing
- Run `pnpm lint:fix` to automatically fix common issues

**TypeScript:**

- All code must be type-safe
- No `any` types without justification
- Proper interface/type definitions

**Naming Conventions:**

- Components: PascalCase (`UserProfile.tsx`)
- Files: kebab-case (`user-profile.service.ts`)
- Variables/Functions: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)

#### Making Changes

**Feature Development:**

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make changes in appropriate app directory
3. Test locally
4. Lint and fix issues: `pnpm lint:fix`
5. Commit with descriptive message
6. Push and create pull request

**Database Migrations:**

- MongoDB is schema-less, but Mongoose schemas define structure
- When changing models, ensure backward compatibility
- Document breaking changes
- Update seed script if necessary

### Testing

**Running Tests:**

```bash
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode
```

**Test Structure:**

```text
apps/backend/src/**/__tests__/
apps/user/src/**/__tests__/
apps/admin/src/**/__tests__/
```

**Writing Tests:**

- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for React components

### Troubleshooting

#### Port Already in Use

```bash
# Find process using port 3000 (user app)
netstat -ano | findstr :3000    # Windows
lsof -ti:3000                   # macOS/Linux

# Kill the process
kill -9 <PID>                   # macOS/Linux
taskkill /PID <PID> /F          # Windows
```

#### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh  # Try connecting

# Check connection string in .env
# Ensure DATABASE_URL is correct
```

#### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Clear Nx cache
pnpm nx reset
```

#### Build Errors

```bash
# Clean build artifacts
pnpm clean

# Rebuild
pnpm install
pnpm build
```

#### Environment Variables Not Loading

- Ensure `.env` files exist in correct locations
- Check file names: `.env` for backend, `.env.local` for Next.js apps
- Restart development servers after changing env vars

### Database Management

#### Backup Database

```bash
# Create backup
mongodump --db ielts-vocab --out ./backup

# Restore backup
mongorestore --db ielts-vocab ./backup/ielts-vocab
```

#### Reset Database

```bash
# Drop database and reseed
mongosh ielts-vocab --eval "db.dropDatabase()"
pnpm seed
```

#### View Database

```bash
# Using MongoDB Shell
mongosh ielts-vocab

# View collections
show collections

# Query words
db.words.find().limit(5)

# Query users
db.users.find()
```

## Performance & Scalability

### Current Performance Metrics

**Frontend:**

- Lighthouse Score: 90+ (Performance)
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size optimized with code splitting

**Backend:**

- Average API response time: <100ms
- Database query optimization with indexes
- Rate limiting prevents abuse

### Scalability Considerations

**Horizontal Scaling:**

- Stateless backend enables multiple instances
- JWT authentication allows load balancing
- MongoDB supports replica sets and sharding

**Caching Strategy:**

- TanStack Query caches API responses on frontend
- Stale-while-revalidate for improved UX
- Consider Redis for backend caching in production

**Database Optimization:**

- Compound indexes on frequently queried fields
- Pagination for large result sets
- Aggregation pipelines for complex queries

**Future Enhancements:**

- CDN for static assets
- Image optimization with Next.js Image component
- Serverless functions for quiz generation
- WebSocket for real-time features

## Accessibility

### WCAG Compliance

This platform strives for WCAG 2.1 Level AA compliance:

**Implemented Features:**

- Semantic HTML structure
- ARIA labels and roles where necessary
- Color contrast ratios meet AA standards
- Focus indicators for keyboard navigation
- Alt text for images (when implemented)

**Keyboard Navigation:**

- Tab navigation through all interactive elements
- Enter/Space for button activation
- Escape to close modals
- Arrow keys for navigation where applicable

**Screen Reader Support:**

- Proper heading hierarchy
- Descriptive link text
- Form labels and error messages
- Status announcements for dynamic content

**Ongoing Improvements:**

- Regular accessibility audits
- User testing with assistive technologies
- Continuous refinement based on feedback

## Privacy & Data Security

### Data Handling Practices

**User Data Collection:**

- Minimal data collection (name, email, learning progress)
- No third-party tracking or analytics (currently)
- Data used solely for platform functionality

**Data Storage:**

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens in HTTP-only cookies
- Database hosted on secure MongoDB Atlas

**User Rights:**

- Account deletion on request
- Data export available on request
- No data sale or sharing with third parties

### Security Implementation

**Authentication Security:**

- JWT with short expiration (15 minutes)
- Refresh token rotation
- Secure, HTTP-only cookies
- CORS configured for known origins

**API Security:**

- Rate limiting on all endpoints
- Input validation with Zod schemas
- SQL injection protection (NoSQL via Mongoose)
- XSS protection via input sanitization
- CSRF protection via SameSite cookies

**Infrastructure Security:**

- HTTPS in production (enforced)
- Security headers via Helmet
- Environment variables for secrets
- Regular dependency updates

**Planned Enhancements:**

- Email verification for new accounts
- Two-factor authentication (2FA)
- Session management dashboard
- Security audit logging

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, improving documentation, or adding new features, your help is appreciated.

### How to Contribute

#### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy.

#### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/ielts-word-trainer.git
cd ielts-word-trainer
```

#### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates

#### 4. Make Your Changes

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new functionality
- Update documentation as needed

#### 5. Test Your Changes

```bash
# Run linter
pnpm lint:fix

# Run tests
pnpm test

# Test locally
pnpm dev
```

#### 6. Commit Your Changes

```bash
git add .
git commit -m "feat: add pronunciation feature for vocabulary"
```

Commit message format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build process or auxiliary tool changes

#### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

#### 8. Create Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Provide clear description of changes
- Link any related issues

### Pull Request Guidelines

**Before Submitting:**

- Ensure all tests pass
- Lint your code (`pnpm lint:fix`)
- Update documentation if needed
- Add screenshots for UI changes

**PR Description Should Include:**

- What changes were made
- Why these changes were necessary
- How to test the changes
- Any breaking changes or migration steps

**Review Process:**

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged

### Code Review Standards

**We Look For:**

- Code quality and readability
- Test coverage
- Documentation updates
- Performance considerations
- Security implications

**Common Feedback:**

- Simplify complex logic
- Add error handling
- Improve naming clarity
- Extract reusable functions
- Add type safety

### Reporting Issues

**Bug Reports:**

- Use the bug report template
- Include steps to reproduce
- Provide expected vs actual behavior
- Include screenshots if applicable
- Specify environment (OS, browser, Node version)

**Feature Requests:**

- Use the feature request template
- Clearly describe the feature
- Explain use case and benefits
- Consider implementation approach

### Community Guidelines

- Be respectful and constructive
- Help others learn and grow
- Welcome newcomers
- Focus on the code, not the person
- Assume good intentions

## FAQ

### For Learners

**Q: Is this platform completely free?**  
A: Yes, 100% free with no hidden costs or premium features. All vocabulary and features are available to everyone.

**Q: How many words are in the vocabulary library?**  
A: Currently 3500+ IELTS-relevant words, regularly updated with new content.

**Q: Do I need to create an account?**  
A: Yes, an account is required to track your progress, use SRS, and save quiz scores.

**Q: How does the spaced repetition system work?**  
A: SRS uses a scientifically-proven algorithm to schedule reviews at optimal intervals based on your performance. Words you struggle with appear more frequently.

**Q: Can I use this on mobile devices?**  
A: Yes, the web app is fully responsive and works on all devices. A native mobile app is planned for the future.

**Q: What happens if I miss a day of reviews?**  
A: Your streak resets, but your SRS progress remains intact. Overdue reviews accumulate, so try to catch up gradually.

**Q: Can I export my progress?**  
A: Currently not available, but this feature is planned for future releases.

**Q: Is my data safe?**  
A: Yes, we use industry-standard security practices. Passwords are hashed, and data is never shared with third parties.

### For Developers

**Q: What is the minimum Node.js version required?**  
A: Node.js 20 or higher is required.

**Q: Can I use npm or yarn instead of pnpm?**  
A: The project is optimized for pnpm. While npm/yarn might work, we recommend pnpm for consistency.

**Q: How do I contribute?**  
A: See the [Contributing](#contributing) section for detailed guidelines.

**Q: Where can I find API documentation?**  
A: See the [API Documentation](#api-documentation) section above.

**Q: Is there a staging environment?**  
A: Not currently. Development is local, and production is live. Staging environment is planned.

**Q: How are database migrations handled?**  
A: MongoDB is schema-less. Mongoose schemas define structure, and changes are handled through version control.

**Q: What testing framework is used?**  
A: Jest for unit and integration tests.

**Q: How is authentication implemented?**  
A: JWT-based authentication with refresh token rotation. See [Authentication Flow](#authentication--authorization-flow).

**Q: Can I run this in Docker?**  
A: Yes, Docker configuration is available for the backend. See `Dockerfile` and `docker-compose.yml`.

**Q: How do I report security vulnerabilities?**  
A: Please email security concerns privately to mail.abubokkor@gmail.com rather than creating public issues.

## License

This project is licensed under a custom proprietary license for **personal and educational use only**.

### License Summary

- **Allowed:** Personal and educational use.
- **Prohibited:** Commercial use, redistribution, modification and distribution of modified copies without explicit permission.

See the [LICENSE](LICENSE) file for full details.

## Acknowledgments

### Technologies & Libraries

This project would not be possible without these amazing open-source projects:

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Chakra UI](https://chakra-ui.com/) - Component library
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Zustand](https://github.com/pmndrs/zustand) - Client state management
- [Nx](https://nx.dev/) - Monorepo tooling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### Inspiration

- **SuperMemo SM-2 Algorithm**: Foundation for our spaced repetition system
- **Anki**: Inspiration for SRS implementation
- **Duolingo**: Gamification concepts (XP, streaks)

### Resources

- IELTS vocabulary sourced from Cambridge English and official IELTS preparation materials
- Algorithm research from [SuperMemo](https://www.supermemo.com/)
- Learning science principles from cognitive psychology research

## Contact & Support

### Get Help

**Documentation:**

- Read this README thoroughly
- Check the [FAQ](#faq) section
- Review [API Documentation](#api-documentation)

**Issues:**

- Report bugs via [GitHub Issues](https://github.com/Abubokkor98/ielts-word-trainer/issues)
- Search existing issues before creating new ones
- Provide detailed information and reproduction steps

**Discussions:**

- Ask questions in [GitHub Discussions](https://github.com/Abubokkor98/ielts-word-trainer/discussions)
- Share ideas and suggestions
- Help other community members

### Connect

**Developer:**

- GitHub: [@Abubokkor98](https://github.com/Abubokkor98)
- LinkedIn: [Abu Bokkor Siddik](https://www.linkedin.com/in/abubokkor)
- Email: mail.abubokkor@gmail.com

**Project Repository:**

- [https://github.com/Abubokkor98/ielts-word-trainer](https://github.com/Abubokkor98/ielts-word-trainer)

### Roadmap & Future Plans

**Planned Features:**

- Native mobile apps (iOS & Android)
- Social features (study groups, leaderboards)
- Audio lessons and pronunciation practice
- Writing practice with AI feedback
- Speaking practice with speech recognition
- Personalized learning paths
- Offline mode for mobile apps
- Advanced analytics and insights

**Contributing:**
Want to help shape the future of this platform? We welcome feature suggestions and contributions!

---

**Built with dedication to make IELTS preparation accessible to everyone.**

**Star this repository if you find it helpful!**
