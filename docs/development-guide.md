# Development Guide

## Prerequisites

- **Node.js:** v20 or later
- **pnpm:** v8 or later (`npm install -g pnpm`)
- **MongoDB:** Atlas cluster or local instance
- **Git**

## Initial Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd ielts-vocabs-app
pnpm install
```

### 2. Configure Environment Variables

Copy the example files and fill in your values:

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# User app
cp apps/user/.env.example apps/user/.env.local

# Admin app
cp apps/admin/.env.example apps/admin/.env.local
```

**Minimum required for local development:**

`apps/backend/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your-development-secret-key
```

`apps/user/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
```

`apps/admin/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api/v1
```

### 3. Seed the Database

```bash
pnpm seed
```

This populates the database with vocabulary words, topics, and initial admin accounts.

### 4. Start Development Servers

```bash
# Start all 3 apps concurrently
pnpm dev

# Or start individually
pnpm dev:backend    # Express API on :3333
pnpm dev:user       # User app on :3000
pnpm dev:admin      # Admin app on :3001
```

---

## Project Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start all apps concurrently              |
| `pnpm dev:backend`   | Start backend only                       |
| `pnpm dev:user`      | Start user app only                      |
| `pnpm dev:admin`     | Start admin app only                     |
| `pnpm build`         | Build all apps for production            |
| `pnpm build:backend` | Build backend                            |
| `pnpm build:user`    | Build user app                           |
| `pnpm build:admin`   | Build admin app                          |
| `pnpm start`         | Start all production builds              |
| `pnpm seed`          | Seed database with initial data          |
| `pnpm lint`          | Run Biome linter (check mode)            |
| `pnpm lint:fix`      | Auto-fix lint issues across all apps     |
| `pnpm test`          | Run all tests                            |
| `pnpm clean`         | Reset Nx cache and remove `dist/` + `node_modules/` |

---

## Understanding the Codebase

### Where to Start

1. **`docs/architecture.md`** — System overview and tech stack
2. **`docs/project-structure.md`** — File organization and module patterns
3. **Backend entry:** `apps/backend/src/main.ts` → `server.ts` → `api.routes.ts`
4. **Frontend entry:** `apps/user/src/app/layout.tsx` → individual page directories

### Key Patterns

**Backend — Module Pattern:**
Every backend feature follows `model → service → controller → routes`:
- **Model** (`*.model.ts`): Mongoose schema + TypeScript interface
- **Service** (`*.service.ts`): Business logic as static class methods
- **Controller** (`*.controller.ts`): HTTP request/response handling
- **Routes** (`*.routes.ts`): Express router with middleware chain

**Frontend — Feature Pattern:**
Frontend code is organized by feature in `src/features/`:
- Each feature folder contains components, hooks, and logic specific to that feature
- Shared components live in `src/components/` or `libs/ui/`
- App-level pages in `src/app/` import from features

**Shared Libraries:**
- `libs/auth` — Auth store (Zustand), API client (Axios), route protection HOCs
- `libs/shared` — Enums, Zod schemas, shared types, constants
- `libs/ui` — Reusable UI components (Sidebar, Pagination, Modals)
- `libs/utils` — General utility functions

---

## Adding a New Feature

### Backend

1. **Create module directory:** `apps/backend/src/modules/your-feature/`

2. **Define the model** (`your-feature.model.ts`):
   ```typescript
   import mongoose, { type Document, Schema } from 'mongoose';

   export interface IYourFeature extends Document {
     // Define fields
   }

   const YourFeatureSchema = new Schema<IYourFeature>({ /* ... */ });
   export const YourFeature = mongoose.model<IYourFeature>('YourFeature', YourFeatureSchema);
   ```

3. **Create the service** (`your-feature.service.ts`):
   ```typescript
   export class YourFeatureService {
     static async getAll() { /* ... */ }
     static async create(data: CreateInput) { /* ... */ }
   }
   ```

4. **Create the controller** (`your-feature.controller.ts`):
   ```typescript
   export class YourFeatureController {
     static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
       try {
         const data = await YourFeatureService.getAll();
         res.json({ success: true, data });
       } catch (err) {
         next(err);
       }
     }
   }
   ```

5. **Define routes** (`your-feature.routes.ts`):
   ```typescript
   const router = Router();
   router.get('/', authenticate, YourFeatureController.getAll);
   export default router;
   ```

6. **Register in `api.routes.ts`:**
   ```typescript
   import yourFeatureRoutes from './modules/your-feature/your-feature.routes';
   router.use('/your-feature', yourFeatureRoutes);
   ```

### Frontend

1. Create a feature directory: `apps/user/src/features/your-feature/`
2. Add components, hooks, and API calls within the feature
3. Create a page in `apps/user/src/app/your-feature/page.tsx`
4. If protected, wrap with `protectUserRoute` HOC

---

## Coding Conventions

Based on analysis of the codebase:

### TypeScript
- Strict TypeScript throughout — no `any` types (enforced by Biome)
- Interfaces for data models (`IUser`, `IWord`, etc.)
- Enums for fixed value sets (shared in `libs/shared/src/lib/enums.ts`)
- Zod schemas for runtime validation (shared in `libs/shared/src/lib/zod-schemas.ts`)

### Backend
- Services use **static class methods** (no instance state)
- Controllers follow `try/catch` with `next(err)` for error forwarding
- All errors go through `AppError` class with HTTP status codes
- Rate limiting applied at the route level via middleware

### Frontend
- **Zustand** for global state (auth, quiz results) — persisted to localStorage
- **TanStack React Query** for server state and caching
- **Chakra UI** for component styling
- Feature-based folder structure under `src/features/`

### Shared Code
- Shared between apps via `libs/` (Nx library projects)
- Enums, types, and constants in `libs/shared`
- Auth logic (store, API client, hooks) in `libs/auth`
- UI components in `libs/ui`

### Linting
- **Biome** v2 is used instead of ESLint/Prettier
- Run `pnpm lint` to check, `pnpm lint:fix` to auto-fix
- Config in `biome.json` at the root

---

## Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific project
nx test backend
nx test user
```

Tests use **Jest** with **ts-jest** for TypeScript support. Test files are located alongside source files (`*.spec.ts`) or in `__tests__/` directories.

---

## Troubleshooting

### Common Issues

| Problem                          | Solution                                            |
| -------------------------------- | --------------------------------------------------- |
| `CORS error` in browser          | Check `CORS_ORIGINS` in backend `.env`              |
| `MongoDB connection error`       | Verify `MONGODB_URI` and IP allowlist in Atlas       |
| `JWT invalid token`              | Ensure `JWT_SECRET` is the same across restarts      |
| `Module not found` for libs      | Run `pnpm install` and check `tsconfig.base.json` paths |
| Nx cache issues                  | Run `pnpm clean` to reset                           |
| Port already in use              | Kill the process on ports 3000/3001/3333             |
| Streak not updating              | Check `X-User-Timezone` header in browser devtools   |
