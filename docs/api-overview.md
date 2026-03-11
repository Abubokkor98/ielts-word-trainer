# API Overview

## Base URL

```
/api/v1
```

All endpoints are prefixed with `/api/v1`. In development, the full URL is `http://localhost:3333/api/v1`.

## Route Groups

| Prefix       | Module         | Auth Required | Description                      |
| ------------ | -------------- | ------------- | -------------------------------- |
| `/auth`      | Auth           | Partial       | User registration, login, tokens |
| `/password`  | Password Reset | No            | Forgot/reset password            |
| `/users`     | User Profile   | Yes           | Profile CRUD, password change    |
| `/words`     | Words          | Partial       | Vocabulary CRUD (read: public)   |
| `/topics`    | Topics         | Partial       | Topic CRUD (read: public)        |
| `/quiz`      | Quiz           | Yes           | Quiz generation, attempts, analytics |
| `/srs`       | SRS            | Yes           | Spaced repetition review, stats  |
| `/admin`     | Admin          | Yes (Admin)   | Admin dashboard, user mgmt       |

## Response Format

All API responses follow a consistent structure:

```json
{
  "success": true,
  "data": { /* response payload */ },
  "message": "Optional message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

---

## Auth Endpoints (`/auth`)

| Method | Path               | Auth | Rate Limit | Description                   |
| ------ | ------------------ | ---- | ---------- | ----------------------------- |
| POST   | `/auth/register`   | No   | Strict     | Create new user account       |
| POST   | `/auth/login`      | No   | Strict     | Login with email/password     |
| POST   | `/auth/refresh`    | No*  | Moderate   | Refresh access token (cookie) |
| GET    | `/auth/verify-cookies` | No | None    | Check if auth cookies exist   |
| GET    | `/auth/me`         | Yes  | None       | Get current user profile      |
| POST   | `/auth/logout`     | Yes  | None       | Invalidate session            |

\* Requires valid `refreshToken` cookie

### Request/Response Examples

**POST `/auth/register`**
```json
// Request
{ "name": "John", "email": "john@example.com", "password": "secure123" }

// Response (201)
{
  "success": true,
  "accessToken": "eyJhbG...",
  "data": { "id": "...", "name": "John", "email": "john@example.com", "role": "user" }
}
```

**GET `/auth/me`**
```json
// Response
{
  "success": true,
  "data": {
    "id": "...", "name": "John", "email": "john@example.com",
    "role": "user", "xp": 150, "streak": 5, "lastQuizDate": "2025-03-01T..."
  }
}
```

---

## Password Reset Endpoints (`/password`)

| Method | Path                      | Auth | Rate Limit | Description              |
| ------ | ------------------------- | ---- | ---------- | ------------------------ |
| POST   | `/password/forgot-password` | No | Strict     | Send password reset email |
| POST   | `/password/reset-password`  | No | Strict     | Reset password with token |

---

## User Profile Endpoints (`/users`)

| Method | Path                    | Auth | Rate Limit | Description          |
| ------ | ----------------------- | ---- | ---------- | -------------------- |
| GET    | `/users/profile`        | Yes  | None       | Get detailed profile |
| PATCH  | `/users/profile`        | Yes  | None       | Update profile (name)|
| POST   | `/users/change-password`| Yes  | Strict     | Change password      |

---

## Words Endpoints (`/words`)

| Method | Path                    | Auth        | Rate Limit | Description                |
| ------ | ----------------------- | ----------- | ---------- | -------------------------- |
| GET    | `/words`                | No          | Moderate   | List/search words          |
| GET    | `/words/:id`            | No          | Light      | Get single word            |
| POST   | `/words`                | Admin       | None       | Create word (validated)    |
| POST   | `/words/upload`         | Admin       | None       | CSV upload (partial)       |
| POST   | `/words/upload-atomic`  | Admin       | None       | CSV upload (all-or-nothing)|
| PATCH  | `/words/:id`            | Admin       | None       | Update word                |
| DELETE | `/words/:id`            | Admin       | None       | Delete word                |

**Query Parameters for `GET /words`:**
- `search` — Full-text search across word, synonyms, antonyms
- `topic` — Filter by topic ID
- `difficulty` — Filter by difficulty level
- `module` — Filter by IELTS module
- `page`, `limit` — Pagination

---

## Topics Endpoints (`/topics`)

| Method | Path            | Auth  | Rate Limit | Description       |
| ------ | --------------- | ----- | ---------- | ----------------- |
| GET    | `/topics`       | No    | None       | List all topics   |
| POST   | `/topics`       | Admin | None       | Create topic      |
| PATCH  | `/topics/:id`   | Admin | None       | Update topic      |
| DELETE | `/topics/:id`   | Admin | None       | Delete topic      |

---

## Quiz Endpoints (`/quiz`)

| Method | Path                         | Auth | Rate Limit | Description                 |
| ------ | ---------------------------- | ---- | ---------- | --------------------------- |
| GET    | `/quiz/generate`             | Yes  | Strict     | Generate quiz questions     |
| POST   | `/quiz/attempts`             | Yes  | None       | Save quiz attempt result    |
| GET    | `/quiz/attempts`             | Yes  | None       | Get user's attempt history  |
| GET    | `/quiz/analytics/me`         | Yes  | None       | User quiz analytics         |
| GET    | `/quiz/analytics/global`     | Admin| None       | Global quiz analytics       |
| GET    | `/quiz/recommend-difficulty` | Yes  | None       | AI difficulty recommendation|

**Query Parameters for `GET /quiz/generate`:**
- `topic` — Filter to specific topic
- `difficulty` — beginner / intermediate / advanced
- `limit` — Number of questions (default: 10)

---

## SRS Endpoints (`/srs`)

All SRS endpoints require authentication and include timezone middleware.

| Method | Path                | Auth | Rate Limit           | Description             |
| ------ | ------------------- | ---- | -------------------- | ----------------------- |
| POST   | `/srs/review`       | Yes  | 100 per 10 min       | Submit review rating    |
| GET    | `/srs/due`          | Yes  | Moderate             | Get due words for review|
| GET    | `/srs/stats`        | Yes  | Moderate             | Get SRS statistics      |
| GET    | `/srs/word/:wordId` | Yes  | Moderate             | Get word's SRS status   |
| GET    | `/srs/schedule`     | Yes  | None                 | Get review schedule     |

**POST `/srs/review`**
```json
// Request (single review)
{ "wordId": "...", "quality": 4 }

// Request (bulk review)
{ "reviews": [{ "wordId": "...", "quality": 3 }, { "wordId": "...", "quality": 5 }] }
```

---

## Admin Endpoints (`/admin`)

### Auth
| Method | Path              | Auth  | Description            |
| ------ | ----------------- | ----- | ---------------------- |
| POST   | `/admin/login`    | No    | Admin login            |
| POST   | `/admin/refresh`  | No*   | Refresh admin tokens   |
| GET    | `/admin/me`       | Admin | Get admin profile      |
| POST   | `/admin/logout`   | Admin | Admin logout           |

### User Management
| Method | Path                      | Auth         | Description           |
| ------ | ------------------------- | ------------ | --------------------- |
| GET    | `/admin/users`            | Admin/Viewer | List all users        |
| PATCH  | `/admin/users/:id/status` | Admin        | Ban/activate user     |
| GET    | `/admin/users/export`     | Admin        | Export users as CSV    |

### Admin Management (Super Admin only)
| Method | Path                | Auth        | Description          |
| ------ | ------------------- | ----------- | -------------------- |
| GET    | `/admin/admins`     | Admin/Viewer| List all admins      |
| POST   | `/admin/admins`     | Super Admin | Create admin         |
| PUT    | `/admin/admins/:id` | Super Admin | Update admin         |
| DELETE | `/admin/admins/:id` | Super Admin | Delete admin         |

### Dashboard Analytics
| Method | Path                            | Auth         | Description                |
| ------ | ------------------------------- | ------------ | -------------------------- |
| GET    | `/admin/stats`                  | Admin/Viewer | General statistics         |
| GET    | `/admin/dashboard-metrics`      | Admin/Viewer | Dashboard metrics          |
| GET    | `/admin/problem-words`          | Admin/Viewer | Words with low success     |
| GET    | `/admin/vocabulary/overview`    | Admin/Viewer | Vocabulary overview        |
| GET    | `/admin/vocabulary/top-words`   | Admin/Viewer | Most studied words         |
| GET    | `/admin/vocabulary/unused-words`| Admin/Viewer | Words never studied        |
| GET    | `/admin/vocabulary/usage-stats` | Admin/Viewer | Word usage statistics      |

---

## Rate Limiting Tiers

| Tier       | Window    | Max Requests | Applied To                    |
| ---------- | --------- | ------------ | ----------------------------- |
| **Light**  | 1 min     | 100          | Single word lookups           |
| **Moderate** | 1 min   | 30           | Search, SRS reads, refresh    |
| **Strict** | 15 min    | 5-10         | Register, login, quiz gen     |
| **Custom** | Varies    | Varies       | SRS reviews (100 per 10 min)  |

## Middleware Pipeline

Typical request passes through these middleware in order:

```
Request → CORS → Helmet → Morgan → Cookie Parser → Cache Headers
        → Rate Limiter → authenticate → authorize → extractTimezone
        → validateRequest → Controller → Global Error Handler
```
