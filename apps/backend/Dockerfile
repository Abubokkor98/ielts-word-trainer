# Multi-stage build for efficient image size
FROM node:20-alpine AS base

# Install pnpm and system dependencies
RUN npm install -g pnpm nx
RUN apk add --no-cache dumb-init

# Builder Stage
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json ./
COPY apps ./apps
COPY libs ./libs

RUN pnpm install --frozen-lockfile
RUN nx build backend --configuration=production

# Prune dependencies to keep only production ones
# Set CI=true to skip pnpm interactive checks
ENV CI=true
RUN pnpm prune --prod

# Runner Stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy dumb-init from base
COPY --from=base /usr/bin/dumb-init /usr/bin/dumb-init

# Copy built artifacts and production node_modules
COPY --from=builder /app/dist/apps/backend ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
USER expressjs

EXPOSE 3000

# Use dumb-init as entrypoint to handle signals (SIGTERM/SIGINT) correcly
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main.js"]
