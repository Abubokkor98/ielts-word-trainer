# Project Structure

## Root Layout

```
ielts-vocabs-app/
├── apps/
│   ├── backend/          # Express API server
│   ├── user/             # Next.js user-facing app (port 3000)
│   └── admin/            # Next.js admin dashboard (port 3001)
├── libs/
│   ├── auth/             # Auth store, API client, hooks
│   ├── shared/           # Enums, schemas, shared state
│   ├── ui/               # Reusable UI components
│   └── utils/            # Utility functions
├── docs/                 # Project documentation
├── nx.json               # Nx workspace configuration
├── package.json          # Root package.json (scripts, dependencies)
├── pnpm-workspace.yaml   # pnpm workspace definition
├── biome.json            # Biome linter/formatter config
├── tsconfig.base.json    # Base TypeScript configuration
├── docker-compose.yml    # Docker composition for backend
└── .env.README.md        # Environment variables guide
```

## Backend (`apps/backend/`)

```
apps/backend/
├── src/
│   ├── main.ts                    # Entry point — starts server
│   ├── server.ts                  # Express app creation, middleware setup
│   ├── api.routes.ts              # Central route registry (/api/v1)
│   ├── seed.ts                    # Database seeding script
│   ├── config/
│   │   ├── env.ts                 # Environment variable configuration
│   │   └── mongo.ts               # MongoDB connection manager
│   ├── core/
│   │   ├── errors/
│   │   │   └── AppError.ts        # Custom error class
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts # Global error handler
│   │   │   ├── logger.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   ├── upload.middleware.ts  # Multer file upload
│   │   │   └── validate.middleware.ts # Zod validation
│   │   └── services/
│   │       └── email.service.ts   # Nodemailer email sending
│   ├── middleware/
│   │   ├── timezone.middleware.ts  # Extracts X-User-Timezone header
│   │   └── request-with-timezone.ts
│   ├── modules/
│   │   ├── auth/                  # User authentication
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.middleware.ts  # authenticate, authorize, requireWriteAccess
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── password-reset.controller.ts
│   │   │   └── password-reset.routes.ts
│   │   ├── admin/                 # Admin management
│   │   │   ├── admin.model.ts
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   ├── admin.routes.ts
│   │   │   ├── admin-dashboard.controller.ts
│   │   │   ├── admin-vocabulary.controller.ts
│   │   │   ├── admin-vocabulary.service.ts
│   │   │   ├── csv-export.service.ts
│   │   │   └── csv-import.service.ts
│   │   ├── quiz/                  # Quiz generation & analytics
│   │   │   ├── quiz.model.ts
│   │   │   ├── quiz.service.ts     # Question generation logic
│   │   │   ├── quiz.controller.ts
│   │   │   ├── quiz.routes.ts
│   │   │   ├── quiz-attempt.model.ts
│   │   │   ├── quiz-attempt.schema.ts
│   │   │   ├── quiz-attempt.service.ts
│   │   │   ├── quiz-attempt.controller.ts
│   │   │   ├── quiz-analytics.service.ts
│   │   │   └── quiz-analytics.controller.ts
│   │   ├── srs/                   # Spaced Repetition System
│   │   │   ├── srs.model.ts
│   │   │   ├── srs.service.ts     # SM-2 algorithm integration
│   │   │   ├── srs.controller.ts
│   │   │   └── srs.routes.ts
│   │   ├── topics/                # Vocabulary topics
│   │   │   ├── topics.model.ts
│   │   │   ├── topics.service.ts
│   │   │   ├── topics.controller.ts
│   │   │   └── topics.routes.ts
│   │   ├── users/                 # User profiles & streaks
│   │   │   ├── users.model.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users-profile.controller.ts
│   │   │   ├── users-profile.routes.ts
│   │   │   └── streak-utils.ts    # Timezone-aware streak logic
│   │   └── words/                 # Vocabulary words
│   │       ├── words.model.ts
│   │       ├── words.service.ts
│   │       ├── words.controller.ts
│   │       └── words.routes.ts
│   ├── shared/                    # Backend-only shared code
│   │   ├── cookies.ts             # Cookie helper (set/clear auth cookies)
│   │   └── lib/
│   │       └── srs-utils.ts       # SM-2 algorithm implementation
│   └── utils/
│       └── lib/                   # Backend utility functions
├── api/
│   └── index.ts                   # Vercel serverless entry point
├── .env.example                   # Backend environment template
├── Dockerfile                     # Multi-stage Docker build
├── vercel.json                    # Vercel deployment config
└── webpack.config.js              # Build configuration
```

## User App (`apps/user/`)

```
apps/user/
├── src/
│   ├── proxy.ts                   # Next.js middleware (route protection)
│   ├── app/                       # Next.js App Router pages
│   │   ├── layout.tsx             # Root layout (providers, metadata)
│   │   ├── page.tsx               # Landing page
│   │   ├── global.css
│   │   ├── not-found.tsx
│   │   ├── robots.ts              # SEO robots.txt
│   │   ├── sitemap.ts             # SEO sitemap
│   │   ├── login/                 # Auth pages
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── dashboard/             # Main user dashboard
│   │   ├── vocabulary/            # Word browsing
│   │   ├── quiz/                  # Quiz flow
│   │   ├── review/                # SRS review sessions
│   │   ├── analytics/             # Learning analytics
│   │   └── profile/               # User profile settings
│   ├── features/                  # Feature-organized modules
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   ├── quiz/
│   │   ├── review/
│   │   ├── vocabulary/
│   │   ├── analytics/
│   │   └── profile/
│   ├── components/                # Shared app components
│   ├── hooks/                     # Custom hooks
│   ├── lib/                       # App-level utilities
│   └── types/                     # TypeScript type definitions
├── public/                        # Static assets
├── .env.example                   # Frontend env template
├── next.config.js
└── tailwind.config.js
```

## Admin App (`apps/admin/`)

```
apps/admin/
├── src/
│   ├── proxy.ts                   # Next.js middleware (admin route protection)
│   ├── app/                       # Admin pages (login, dashboard, etc.)
│   ├── features/                  # Feature modules (similar to user app)
│   └── types/
├── .env.example
├── next.config.js
└── tailwind.config.js
```

## Shared Libraries (`libs/`)

```
libs/
├── auth/src/lib/
│   ├── api.ts                     # Axios instance with interceptors
│   ├── auth.store.ts              # Zustand auth state (persisted)
│   ├── auth.config.ts             # Auth configuration
│   ├── hooks.tsx                  # useAuth, protectUserRoute, protectAdminRoute
│   └── types.ts                   # Auth type definitions
├── shared/src/lib/
│   ├── enums.ts                   # UserRole, AdminRole, Difficulty, SRSStatus, etc.
│   ├── quiz-types.ts              # QuestionType enum
│   ├── quiz.store.ts              # Zustand quiz state (persisted)
│   ├── auth-constants.ts          # Token expiry durations
│   ├── date-utils.ts              # formatDate, formatRelativeTime
│   └── zod-schemas.ts             # Shared Zod validation schemas
├── ui/src/
│   ├── components/                # Sidebar, auth forms, UI primitives
│   ├── hooks/                     # useSpeechSynthesis, useViewerRestriction
│   ├── lib/                       # Pagination, WordDetailsModal, etc.
│   └── providers/                 # ChakraProvider, ReactQueryProvider
└── utils/src/                     # General utility functions
```

## Module Pattern

Each backend module follows a consistent structure:

```
module-name/
├── module.model.ts         # Mongoose schema & TypeScript interface
├── module.service.ts       # Business logic (static class methods)
├── module.controller.ts    # Request handling (req → service → res)
├── module.routes.ts        # Express router with middleware
└── module.types.ts         # Module-specific types (optional)
```

This separation ensures:
- **Models** define data shape only
- **Services** contain all business logic (testable in isolation)
- **Controllers** handle HTTP concerns (parsing, response formatting)
- **Routes** wire middleware chains (auth, validation, rate limiting)
