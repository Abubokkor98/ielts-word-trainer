# Deployment Guide

## Architecture Overview

| App       | Recommended Host | Port  | Notes                         |
| --------- | ---------------- | ----- | ----------------------------- |
| Backend   | Vercel / Docker  | 3333  | Express API                   |
| User App  | Vercel           | 3000  | Next.js (SSR)                 |
| Admin App | Vercel           | 3001  | Next.js (SSR)                 |
| Database  | MongoDB Atlas    | —     | Cloud-managed MongoDB         |

## Environment Variables

### Backend (`apps/backend/.env`)

| Variable        | Required | Default                      | Description                      |
| --------------- | -------- | ---------------------------- | -------------------------------- |
| `MONGODB_URI`   | Yes      | —                            | MongoDB connection string        |
| `MONGODB_DBNAME`| No       | `ielts_app`                  | Database name                    |
| `JWT_SECRET`    | Yes      | —                            | Secret for JWT signing           |
| `PORT`          | No       | `3333`                       | Server port                      |
| `NODE_ENV`      | No       | `development`                | `development` or `production`    |
| `CLIENT_URL`    | No       | `http://localhost:3000`      | User app URL (CORS)              |
| `ADMIN_URL`     | No       | `http://localhost:3001`      | Admin app URL (CORS)             |
| `CORS_ORIGINS`  | No       | Auto-derived from URLs       | Comma-separated allowed origins  |
| `SMTP_HOST`     | No       | —                            | Email server host                |
| `SMTP_PORT`     | No       | —                            | Email server port                |
| `SMTP_USER`     | No       | —                            | Email account username           |
| `SMTP_PASS`     | No       | —                            | Email account password           |
| `SMTP_FROM`     | No       | —                            | "From" address for emails        |

### User App (`apps/user/.env.local`)

| Variable                    | Required | Default                       | Description                   |
| --------------------------- | -------- | ----------------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL`       | Yes      | `http://localhost:3333/api/v1`| Backend API base URL          |
| `NEXT_PUBLIC_ADMIN_APP_URL` | No       | `http://localhost:3001`       | Admin app URL (cross-redirect)|
| `NEXT_PUBLIC_USER_APP_URL`  | No       | `http://localhost:3000`       | Self URL (for sharing)        |

### Admin App (`apps/admin/.env.local`)

| Variable                    | Required | Default                       | Description                   |
| --------------------------- | -------- | ----------------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL`       | Yes      | `http://localhost:3333/api/v1`| Backend API base URL          |
| `NEXT_PUBLIC_USER_APP_URL`  | No       | `http://localhost:3000`       | User app URL (cross-redirect) |

> **Production Note:** On Vercel, set `NEXT_PUBLIC_API_URL=/api/v1` (proxied by Next.js rewrites) instead of the full backend URL.

---

## Deployment Option 1: Vercel (Recommended)

### Backend on Vercel (Serverless)

The backend includes a Vercel serverless adapter at `apps/backend/api/index.ts`:

1. Push code to GitHub
2. Create a new Vercel project pointed at the repo
3. Set the **Root Directory** to `apps/backend`
4. Configure environment variables in the Vercel dashboard
5. The `vercel.json` in `apps/backend/` handles routing

### Frontend Apps on Vercel

1. Create a separate Vercel project for each frontend app
2. Set **Root Directory** to `apps/user` or `apps/admin`
3. Configure `NEXT_PUBLIC_API_URL=/api/v1` for production
4. Set up API rewrites in `next.config.js` to proxy to the backend

---

## Deployment Option 2: Docker (Backend)

### Dockerfile

**File:** `apps/backend/Dockerfile`

Multi-stage build using Node.js 20 Alpine:

1. **Base stage:** Installs pnpm, nx, and dumb-init
2. **Builder stage:** Installs all dependencies, builds with Nx, prunes to production deps
3. **Runner stage:** Copies built artifacts, creates non-root user, runs with dumb-init

```bash
# Build the Docker image
docker build -t ielts-backend -f apps/backend/Dockerfile .

# Run the container
docker run -p 3333:3000 --env-file apps/backend/.env ielts-backend
```

### Docker Compose

**File:** `docker-compose.yml`

```bash
# Start the backend service
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

The compose file:
- Maps `localhost:3333` → container port `3000`
- Loads env from `apps/backend/.env`
- Sets `NODE_ENV=production`
- Restarts unless stopped

---

## Database Setup

### MongoDB Atlas (Recommended)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Allow network access (IP whitelist or `0.0.0.0/0` for Vercel)
4. Get the connection string and set `MONGODB_URI`

### Seeding

Populate the database with initial vocabulary data:

```bash
pnpm seed
```

This runs `apps/backend/src/seed.ts`, which populates words, topics, and creates initial admin accounts.

---

## Production Checklist

- [ ] Set strong `JWT_SECRET` (minimum 32 characters, random)
- [ ] Configure `MONGODB_URI` with production cluster
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origins for production URLs
- [ ] Set up SMTP credentials for password reset emails
- [ ] Enable HTTPS on all domains
- [ ] Configure MongoDB Atlas IP allowlist
- [ ] Run `pnpm seed` for initial data
- [ ] Verify rate limiting works behind load balancer (`trust proxy` is enabled)
