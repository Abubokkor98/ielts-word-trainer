# IELTS Vocabulary Learning Platform — Developer Guide

This document covers everything a developer or recruiter needs to understand the technical implementation, run the project locally, and contribute.

> **Looking for the user guide?** See the main [README.md](README.md) for learner-focused documentation.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Key Features Implementation](#key-features-implementation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Developer Setup Guide](#developer-setup-guide)
- [Performance & Scalability](#performance--scalability)
- [Security Implementation](#security-implementation)
- [Contributing](#contributing)
- [Developer FAQ](#developer-faq)
- [Roadmap & Future Plans](#roadmap--future-plans)
- [Acknowledgments](#acknowledgments)

---

## Architecture Overview

This project is built as an Nx monorepo containing three main applications that work together to deliver a comprehensive learning platform:

### Frontend Applications (Next.js 16)

- **User App**: Public-facing learning platform where students browse vocabulary, take quizzes, and track progress, fully styled with shadcn/ui and custom tailwind animations
- **Admin Panel**: Internal management dashboard for vocabulary CRUD operations, user management, admin RBAC, vocabulary analytics, and feedback management, migrated to the new design system using shadcn/ui

### Backend API (Express.js)

- RESTful API serving both frontend applications
- MongoDB database for persistent storage
- Dual-mode background job scheduling (Agenda.js for VPS/Render, Vercel Cron for serverless)
- Transactional email via Nodemailer SMTP and Brevo REST API
- JWT-based authentication with refresh token rotation
- Role-based access control with separate User and Admin models:
  - **Users**: Single role (`user`), status management (`active`/`inactive`/`banned`)
  - **Admins**: Three-tier roles (`super_admin`, `admin`, `viewer`) with write-access gating for demo/viewer accounts

### Shared Libraries

- Common TypeScript types and interfaces
- Shared validation schemas (Zod)
- Utility functions used across apps

### Design Decisions

- Monorepo structure for code sharing and unified development
- Separate user and admin apps for security and optimization
- Feature-based architecture for maintainability and scalability
- Client-side state management with Zustand for auth persistence
- Server state management with TanStack Query for caching and synchronization
- URL state management with nuqs for shareable, bookmarkable filter views
- **Design System Migration**: Transitioned from Chakra UI to shadcn/ui and Tailwind CSS to implement a modern, highly responsive design system with a clean, cohesive user interface and optimized accessibility (e.g. Radix UI primitives and semantic ARIA labeling)
- **Component Reusability**: Unification of user interface parts such as a single `ScrollspySidebar` for layout navigation and custom `BandTable` for rendering speaking and writing criteria grids

---

## Tech Stack

### Frontend

#### Framework & Libraries

- **Next.js 16**: React framework with App Router for server-side rendering and routing
- **React 19**: Latest React with improved concurrent features
- **TypeScript 5.9**: Type safety and developer experience
- **shadcn/ui**: Premium component library built on Radix UI primitives and Tailwind CSS
- **TanStack Query 5.x**: Server state management, caching, and synchronization
- **Zustand 5.x**: Lightweight client state management for auth and UI state
- **nuqs 2.x**: Type-safe URL query string state management for shareable filters
- **React Hook Form**: Performant form handling with validation
- **Zod**: Runtime type validation and schema parsing
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Data visualization for analytics

#### Styling & UI

- **Tailwind CSS**: Utility-first CSS framework
- **Tailwind CSS Animate**: Plugin for smooth transitions and modern web animations
- **Lucide React**: Icon library

#### Development Tools

- **Nx**: Monorepo tooling and build orchestration
- **Biome**: Fast linting and formatting
- **pnpm**: Efficient package management

### Backend

#### Server & Framework

- **Node.js 20**: Runtime environment
- **Express.js 4**: Web application framework
- **TypeScript**: Type-safe backend development

#### Database & ODM

- **MongoDB**: NoSQL database for flexible schema
- **Mongoose 9**: ODM for MongoDB with schema validation and middleware

#### Authentication & Security

- **JWT (jsonwebtoken)**: Stateless authentication tokens
- **bcryptjs**: Password hashing
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing configuration
- **express-rate-limit**: API rate limiting protection
- **HTTP Cache-Control**: Optimized caching strategy for performance and security

#### Email & Notifications

- **Nodemailer**: SMTP-based transactional emails (password reset, email verification, inactivity reminders)
- **Brevo REST API**: Bulk email sending for Vercel Cron inactivity sweeps (fast HTTP calls within serverless timeout)

#### Job Scheduling

- **Agenda.js** (`@agendajs/mongo-backend`): Persistent background job scheduling on VPS/Render (inactivity reminder chains: 3→7→10 days)
- **Vercel Cron**: HTTP-triggered daily sweep endpoint as serverless alternative to Agenda

#### File Processing & Media

- **Multer**: File upload handling for CSV imports
- **csv-parse**: CSV parsing for vocabulary imports
- **Cloudinary**: Cloud-based image storage for profile pictures (signed uploads with server-generated signatures)

#### Logging & Monitoring

- **Winston**: Structured logging
- **Morgan**: HTTP request logging

#### Development & Build

- **tsx**: TypeScript execution for development
- **SWC**: Fast TypeScript/JavaScript compilation
- **Nx**: Build and task orchestration

### DevOps & Deployment

- **Vercel**: Frontend hosting (user and admin apps)
- **Render**: Backend API hosting
- **MongoDB Atlas**: Cloud database hosting
- **Docker**: Containerization for backend deployment
- **Git**: Version control
- **GitHub**: Code repository and CI/CD

---

## Key Features Implementation

### Spaced Repetition Algorithm (SM-2 Variant)

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

### Quiz Generation Logic

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

### Authentication & Authorization Flow

**Registration:**

1. User submits registration form
2. Backend validates email uniqueness
3. Password hashed with bcrypt (10 salt rounds)
4. User document created in MongoDB
5. Verification email automatically sent (fire-and-forget)
6. Access token (15min) and refresh token (7 days) issued
7. Tokens sent via HTTP-only cookies

**Login:**

1. User submits credentials
2. Backend checks ban status before password validation (prevents information disclosure)
3. Backend verifies password
4. New token pair generated
5. Tokens sent via HTTP-only cookies

**Token Refresh:**

1. Frontend detects access token expiration (401 response)
2. Automatically sends refresh token to `/auth/refresh`
3. Backend validates refresh token against stored hashes
4. Old refresh token invalidated (rotation)
5. New token pair issued
6. Request retried with new token

**Email Verification:**

1. Verification token auto-generated during registration (SHA-256 hashed, 1-hour expiry)
2. User clicks email link → token validated → `isEmailVerified` set to `true`
3. On verification, Agenda schedules first inactivity reminder (3 days)
4. Users can resend verification from their profile
5. Verified email is required for password changes and receiving reminder emails

**Email Change:**

1. User provides new email + current password for security
2. Backend validates uniqueness (including pending changes by other users)
3. Security alert sent to current email
4. Verification link sent to new email (1-hour expiry)
5. On verification: email updated, all sessions invalidated, user must re-login

**Authorization:**

- Middleware verifies JWT on protected routes
- Separate User and Admin models with distinct role hierarchies
- **User roles**: `user` (single role, status-based gating: `active`/`inactive`/`banned`)
- **Admin roles**: `super_admin` (full access), `admin` (management access), `viewer` (read-only demo)
- `requireWriteAccess` middleware blocks create/update/delete for viewer accounts
- User context injected into request object

**Security Features:**

- **HTTP-only cookies** prevent XSS token theft
- **Refresh token rotation** prevents replay attacks
- **Hashed refresh tokens** stored in DB (bcrypt) — raw tokens never persisted
- **Ban enforcement** at login and token refresh
- **Rate limiting** on all auth endpoints
- **Secure cookie attributes** (partitioned, sameSite) for modern browsers

### Rate Limiting Strategy

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

### CSV Import/Export for Vocabulary

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

---

## Project Structure

```text
ielts-vocabs-app/
├── apps/
│   ├── backend/                  # Express API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/         # Authentication, email verification & email change
│   │   │   │   ├── users/        # User profile, password change, Cloudinary uploads
│   │   │   │   ├── words/        # Vocabulary CRUD
│   │   │   │   ├── topics/       # Topic management
│   │   │   │   ├── srs/          # Spaced repetition system
│   │   │   │   ├── quiz/         # Quiz generation & attempts
│   │   │   │   ├── word-list/    # Personal word lists & bookmarks
│   │   │   │   ├── feedback/     # User feedback (submit, admin review)
│   │   │   │   ├── cron/         # Vercel Cron inactivity email endpoint
│   │   │   │   └── admin/        # Admin auth, RBAC, dashboard metrics,
│   │   │   │                     #   vocabulary analytics, user export,
│   │   │   │                     #   admin CRUD, password reset
│   │   │   ├── core/
│   │   │   │   ├── errors/       # Custom AppError class
│   │   │   │   ├── middleware/   # Error handler, rate limiter, validation
│   │   │   │   └── services/     # EmailService (SMTP), BrevoApiService (REST)
│   │   │   ├── jobs/             # Agenda.js job definitions (inactivity reminders)
│   │   │   ├── middleware/       # Timezone extraction middleware
│   │   │   ├── shared/           # Shared enums, types, Zod schemas, SRS/quiz utils
│   │   │   ├── config/           # Env, MongoDB, Agenda.js, Cloudinary config
│   │   │   ├── utils/            # Logger and utility functions
│   │   │   ├── main.ts           # Application entry point (DB + Agenda init)
│   │   │   ├── server.ts         # Express app setup (CORS, Helmet, cache headers)
│   │   │   └── seed.ts           # Database seeding script
│   │   └── .env.example
│   │
│   ├── user/                     # User-facing Next.js app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/       # Auth pages
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   ├── verify/           # Email verification
│   │   │   │   │   ├── change-email/     # Email change verification
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   └── reset-password/
│   │   │   │   └── (main)/       # Main app pages
│   │   │   │       ├── dashboard/
│   │   │   │       ├── vocabulary/
│   │   │   │       ├── review/
│   │   │   │       ├── quiz/
│   │   │   │       ├── analytics/
│   │   │   │       ├── my-lists/
│   │   │   │       ├── profile/
│   │   │   │       ├── feedback/         # Feedback submission
│   │   │   │       ├── guides/
│   │   │   │       ├── about/
│   │   │   │       ├── contact/
│   │   │   │       ├── privacy/
│   │   │   │       └── terms/
│   │   │   ├── features/         # Feature modules
│   │   │   ├── components/       # Shared components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── types/            # TypeScript types
│   │   │   └── proxy.ts          # Next.js middleware for auth
│   │   └── .env.example
│   │
│   └── admin/                    # Admin panel Next.js app
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/       # Admin login, forgot/reset password
│       │   │   └── dashboard/    # Admin dashboard pages
│       │   │       ├── admins/           # Admin management (super_admin)
│       │   │       ├── users/            # User management & export
│       │   │       ├── vocabulary/       # Vocabulary CRUD & analytics
│       │   │       ├── problem-words/    # Low-accuracy word analysis
│       │   │       └── settings/         # Admin profile & password
│       │   ├── features/         # Feature modules
│       │   │   ├── dashboard/    # Dashboard metrics & charts
│       │   │   ├── vocabulary/   # Vocabulary management & analytics
│       │   │   ├── users/        # User management
│       │   │   ├── admins/       # Admin CRUD management
│       │   │   ├── problem-words/# Problem word analytics
│       │   │   └── settings/     # Admin settings
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

---

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

### Email Verification Endpoints

#### Send Verification Email

```http
POST /api/v1/auth/send-verification
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "message": "If eligible, verification email was sent"
}
```

#### Verify Email

```http
POST /api/v1/auth/verify
Content-Type: application/json

{
  "token": "verification_token_from_email"
}

Response: 200 OK
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Email Change Endpoints

#### Request Email Change

```http
POST /api/v1/auth/change-email/request
Authorization: Required (JWT cookie)
Content-Type: application/json

{
  "newEmail": "newemail@example.com",
  "currentPassword": "SecurePass123!"
}

Response: 200 OK
{
  "success": true,
  "message": "Verification email sent to new address"
}
```

#### Verify Email Change

```http
POST /api/v1/auth/change-email/verify
Content-Type: application/json

{
  "token": "change_email_token_from_email"
}

Response: 200 OK
{
  "success": true,
  "message": "Email changed successfully"
}
```

### User Profile Endpoints

#### Get Upload Signature (Cloudinary)

```http
POST /api/v1/users/cloudinary-signature
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "signature": "cloudinary_signature",
  "timestamp": 1706000000,
  "publicId": "user_abc123"
}
```

#### Delete Profile Picture

```http
DELETE /api/v1/users/picture
Authorization: Required (JWT cookie)

Response: 200 OK
{
  "success": true,
  "message": "Profile picture removed successfully"
}
```

### Feedback Endpoints

#### Submit Feedback

```http
POST /api/v1/feedback
Authorization: Required (JWT cookie)
Content-Type: application/json

{
  "feedbackType": "feature",
  "rating": 4,
  "message": "It would be great to have audio pronunciation for all words.",
  "email": "john@example.com",
  "deviceInfo": "Chrome 120 / Windows 11"
}

Response: 201 Created
{
  "success": true,
  "data": { /* feedback object */ },
  "message": "Feedback submitted successfully"
}
```

#### Get All Feedback (Admin)

```http
GET /api/v1/feedback?page=1&limit=20&feedbackType=bug&status=new
Authorization: Required (JWT cookie, Admin role)

Response: 200 OK
{
  "success": true,
  "data": {
    "feedbacks": [...],
    "pagination": { ... }
  }
}
```

#### Update Feedback Status (Admin)

```http
PATCH /api/v1/feedback/:id
Authorization: Required (JWT cookie, Admin role)
Content-Type: application/json

{
  "status": "reviewed"
}

Response: 200 OK
{
  "success": true,
  "data": { /* updated feedback */ },
  "message": "Feedback status updated successfully"
}
```

#### Delete Feedback (Admin)

```http
DELETE /api/v1/feedback/:id
Authorization: Required (JWT cookie, Admin role)

Response: 200 OK
{
  "success": true,
  "message": "Feedback record deleted successfully"
}
```

### Admin Endpoints

All admin endpoints require authentication and admin role. Viewer accounts have read-only access.

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
GET /api/v1/admin/stats
Authorization: Required (JWT cookie, Admin role)

Response: 200 OK
{
  "success": true,
  "data": {
    "totalUsers": 500,
    "totalWords": 1200,
    "totalQuizzes": 5000,
    "activeUsersToday": 45
  }
}
```

#### Get Dashboard Metrics (Week-over-Week)

```http
GET /api/v1/admin/dashboard-metrics?timeRange=7d
Authorization: Required (JWT cookie, Admin role)

Query Parameters:
- timeRange: '7d' | '30d' (default: '7d')

Response: 200 OK
{
  "success": true,
  "data": { /* metrics with week-over-week comparison */ }
}
```

#### Get Problem Words

```http
GET /api/v1/admin/problem-words?limit=20
Authorization: Required (JWT cookie, Admin role)

Response: 200 OK
{
  "success": true,
  "data": {
    "words": [ /* words with low quiz accuracy */ ],
    "count": 20
  }
}
```

#### Vocabulary Analytics

```http
GET /api/v1/admin/vocabulary/overview
GET /api/v1/admin/vocabulary/top-words?limit=20
GET /api/v1/admin/vocabulary/unused-words?limit=50
GET /api/v1/admin/vocabulary/usage-stats?limit=20
Authorization: Required (JWT cookie, Admin role)
```

#### Admin Management (Super Admin Only)

```http
GET    /api/v1/admin/admins           # List all admins
POST   /api/v1/admin/admins           # Create new admin
PUT    /api/v1/admin/admins/:id       # Update admin
DELETE /api/v1/admin/admins/:id       # Delete admin
Authorization: Required (JWT cookie, Super Admin role)
```

#### Export Users as CSV

```http
GET /api/v1/admin/users/export
Authorization: Required (JWT cookie, Admin role)

Response: 200 OK (Content-Type: text/csv)
```

#### Cron Endpoints (Vercel-Only)

```http
GET /api/v1/cron/daily-emails
Authorization: Bearer CRON_SECRET

Response: 200 OK
{
  "success": true,
  "totalSent": 15,
  "totalFailed": 0,
  "message": "Daily inactivity sweep complete. 15 sent, 0 failed."
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

---

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

##### Backend Environment

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ielts-vocab
MONGODB_DBNAME=ielts-vocab

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Server
PORT=3333
NODE_ENV=development

# CORS - Frontend URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Email (SMTP via Brevo or any SMTP provider)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM='"IELTS Vocabs" <noreply@yourdomain.com>'

# Cloudinary (for profile picture uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Brevo REST API (for bulk inactivity emails via Vercel Cron)
# BREVO_API_KEY=your-brevo-api-key

# Agenda.js (set to 'true' on VPS/Render, omit on Vercel)
# ENABLE_AGENDA=true

# Vercel Cron (generate a random secret)
# CRON_SECRET=your-cron-secret
```

##### User App Environment

```bash
cp apps/user/.env.example apps/user/.env.local
```

Edit `apps/user/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
NEXT_PUBLIC_USER_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_APP_URL=http://localhost:3001
```

##### Admin App Environment

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

##### Option A: Run all applications concurrently

```bash
pnpm dev
```

This starts:

- Backend API: <http://localhost:3333>
- User App: <http://localhost:3000>
- Admin Panel: <http://localhost:3001>

##### Option B: Run applications individually

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
# Ensure MONGODB_URI is correct
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

---

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

---

## Security Implementation

### Authentication Security

- JWT with short expiration (15 minutes)
- Refresh token rotation
- Secure, HTTP-only cookies
- CORS configured for known origins

### API Security

- Rate limiting on all endpoints
- Input validation with Zod schemas
- SQL injection protection (NoSQL via Mongoose)
- XSS protection via input sanitization
- CSRF protection via SameSite cookies

### Infrastructure Security

- HTTPS in production (enforced)
- Security headers via Helmet
- Environment variables for secrets
- Regular dependency updates

### Planned Enhancements

- Two-factor authentication (2FA)
- Session management dashboard
- Security audit logging

---

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

---

## Developer FAQ

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
A: JWT-based authentication with refresh token rotation. See [Authentication & Authorization Flow](#authentication--authorization-flow).

**Q: Can I run this in Docker?**
A: Yes, Docker configuration is available for the backend. See `Dockerfile` and `docker-compose.yml`.

**Q: How do I report security vulnerabilities?**
A: Please email security concerns privately to [mail.abubokkor@gmail.com](mailto:mail.abubokkor@gmail.com) rather than creating public issues.

---

## Roadmap & Future Plans

**Recently Shipped:**

- ✅ Email verification (auto-sent on registration)
- ✅ Email change with dual-email verification flow
- ✅ Profile picture uploads via Cloudinary
- ✅ Feedback system (submit, admin review/resolve)
- ✅ Smart inactivity reminder emails (3/7/10 day chains)
- ✅ Agenda.js background job scheduling (VPS mode)
- ✅ Vercel Cron + Brevo API (serverless mode)
- ✅ Three-tier admin RBAC (super_admin, admin, viewer)
- ✅ Admin CRUD management (super_admin only)
- ✅ Admin dashboard metrics with week-over-week comparisons
- ✅ Vocabulary analytics (top words, unused words, usage stats, problem words)
- ✅ User CSV export for admins
- ✅ User ban/status management

**Planned Features:**

- Native mobile apps (iOS & Android)
- Social features (study groups, leaderboards)
- Audio lessons and pronunciation practice
- Writing practice with AI feedback
- Speaking practice with speech recognition
- Personalized learning paths
- Offline mode for mobile apps
- Google OAuth social login

**Contributing:**
Want to help shape the future of this platform? We welcome feature suggestions and contributions!

---

## Acknowledgments

### Technologies & Libraries

This project would not be possible without these amazing open-source projects:

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Accessible headless UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Styling engine
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
