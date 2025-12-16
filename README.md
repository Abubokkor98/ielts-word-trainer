# IELTS Vocabulary Learning Platform

A full-stack vocabulary learning application built with Next.js, Express, and MongoDB. Features include vocabulary browsing, adaptive quizzes, progress tracking, and analytics.

## 🚀 Features

- **1000+ IELTS Words**: Comprehensive vocabulary database with difficulty levels
- **Adaptive Quiz System**: Generate custom quizzes based on difficulty
- **Progress Tracking**: XP system, streaks, and detailed analytics
- **User Dashboard**: Personal stats, quick actions, and progress overview
- **Analytics**: Performance charts, accuracy by difficulty, quiz history
- **Profile Management**: Update profile, change password
- **Authentication**: JWT-based auth with access/refresh tokens
- **Responsive Design**: Dark theme, mobile-friendly interface

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI**: Chakra UI, custom UI library
- **State Management**: Zustand (auth, quiz results)
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios with interceptors
- **Charts**: Recharts

### Backend

- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: Zod schemas
- **Security**: Helmet, rate limiting, CORS
- **Logging**: Winston + Morgan

### Monorepo

- **Build Tool**: Nx
- **Package Manager**: pnpm
- **Linting**: Biome

## 📋 Prerequisites

- Node.js 18+
- pnpm 8+
- MongoDB (local or Atlas)

## 🔧 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd ielts-vocabs-app
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure:

- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `PORT`: Backend port (default: 3333)

4. **Build the backend**

```bash
pnpm build:backend
```

5. **Seed the database** (optional)

```bash
pnpm seed
```

## 🚀 Development

### Run both frontend and backend

```bash
pnpm dev
```

### Run individually

```bash
# Backend only
pnpm dev:backend

# Frontend only
pnpm dev:frontend
```

The app will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3333/api/v1

## 📦 Build

```bash
# Build everything
pnpm build

# Build backend only
pnpm build:backend

# Build frontend only
pnpm build:frontend
```

## 🚀 Production

```bash
# Start both services
pnpm start

# Or individually
pnpm start:backend
pnpm start:frontend
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Lint all code
pnpm lint
```

## 📁 Project Structure

```
ielts-vocabs-app/
├── apps/
│   ├── backend/          # Express API
│   │   ├── src/
│   │   │   ├── modules/  # Feature modules
│   │   │   ├── core/     # Shared utilities
│   │   │   └── config/   # Configuration
│   │   └── dist/         # Build output
│   └── frontend/         # Next.js app
│       └── src/
│           ├── app/      # App router pages
│           ├── components/
│           ├── store/    # Zustand stores
│           ├── hooks/    # Custom hooks
│           └── lib/      # Utilities
├── libs/
│   ├── ui/              # Shared UI components
│   ├── shared/          # Shared types
│   └── utils/           # Shared utilities
└── dist/                # Build outputs
```

## 🔑 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Words

- `GET /api/v1/words` - List words (pagination, filters)
- `GET /api/v1/words/:id` - Get word details

### Quiz

- `GET /api/v1/quiz/generate` - Generate quiz
- `POST /api/v1/quiz/attempts` - Save quiz attempt
- `GET /api/v1/quiz/attempts` - Get user attempts
- `GET /api/v1/quiz/analytics/me` - Get user analytics

### Users

- `GET /api/v1/users/profile` - Get user profile
- `PATCH /api/v1/users/profile` - Update profile
- `POST /api/v1/users/change-password` - Change password

## 🔐 Environment Variables

Required variables in `.env`:

```env
NODE_ENV=development
PORT=3333
MONGO_URI=mongodb://localhost:27017/ielts-vocab-app
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## 📊 Database Seeding

To populate the database with vocabulary words:

```bash
pnpm seed
```

This will:

- Create 1000+ IELTS vocabulary words
- Set difficulty levels (beginner, intermediate, advanced)
- Add example sentences, synonyms, antonyms
- Create sample admin user (if configured)

## 🎯 Key Features Explained

### Authentication Flow

1. User logs in → receives access token (1h) + refresh token (7d, httpOnly cookie)
2. Access token stored in Zustand + persisted to localStorage
3. Axios interceptor auto-attaches token to requests
4. On 401 error, attempts token refresh via `/auth/refresh`
5. On refresh failure, logs out user and redirects to login

### Quiz System

1. User generates quiz (10 questions, configurable difficulty)
2. Answers tracked in state
3. On completion, POST to `/quiz/attempts`
4. Backend calculates XP (10 XP per correct answer)
5. Updates user XP and streak
6. Frontend invalidates analytics queries for fresh data

### State Management

- **Zustand**: Auth state, quiz results (persisted)
- **TanStack Query**: All API data fetching (cached, auto-refetch)
- **Axios Interceptors**: Token injection, auto-refresh

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT

## 👥 Authors

IELTS Learning Platform Team

## 🙏 Acknowledgments

- IELTS vocabulary data sources
- Open source community
- Contributors and testers
