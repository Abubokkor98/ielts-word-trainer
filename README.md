# IELTS Vocabulary Platform

A complete modular monolith for mastering IELTS vocabulary.

## Tech Stack

- **Frontend**: Next.js 14, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express, Modular Monolith
- **Database**: MongoDB (Mongoose)
- **Monorepo**: Nx

## Prerequisites

- Node.js 18+
- pnpm (`npm i -g pnpm`)
- MongoDB Cluster

## Setup

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Environment Variables**

   - The `.env` file for backend is already generated in root.
   - The `.env.local` for frontend is in `apps/frontend`.

3. **Running Development Servers**
   To run both frontend and backend:

   ```bash
   pnpm nx run-many --target=serve --projects=frontend,backend
   ```

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:3333/api/v1](http://localhost:3333/api/v1)

## Project Structure

- `apps/frontend`: Next.js application
- `apps/backend`: Express application (Modular Monolith)
- `libs/shared`: Shared Zod schemas, types, utils
- `libs/ui`: Shared React components (Shadcn)

## Features & Verification

- **Vocabulary**: Navigate to `/vocabulary` to see the list (fetching from backend).
- **Quiz**: Navigate to `/quiz` to take a generated quiz.
- **Admin**: Use Postman/curl to POST to `/api/v1/words` (Protected, requires Admin token).

## Commands

- `pnpm build`: Build all apps
- `pnpm lint`: Lint code
