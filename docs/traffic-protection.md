# Traffic Spike Protection Strategy

**Survive Reddit/HN Front Page Without Crashing**

---

## 1. Current Vulnerabilities

### 🔴 Critical Exposure

- **Public quiz endpoint** (`GET /quiz/generate`) - NO authentication
- **Global rate limit** only: 100 req/15min per IP
- **No per-endpoint limits**
- **No request deduplication**
- **No graceful degradation**

### What Happens During Spike

1. 1000+ users hit site simultaneously
2. All smash "Start Quiz" button
3. 1000 quiz generation queries hit MongoDB
4. Free tier CPU spikes to 100%
5. Auto-throttling kicks in
6. Everything slows to 10s+ per request
7. **Total system lockup**

---

## 2. Multi-Layer Rate Limiting

### Layer 1: Aggressive Per-Endpoint Limits

```typescript
// apps/backend/src/core/middleware/rate-limit.middleware.ts
import rateLimit from "express-rate-limit";

// Strict limits for expensive operations
export const strictRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: "Too many requests, please slow down",
  standardHeaders: true,
  legacyHeaders: false,
  // Use Redis store when scaling
  // store: new RedisStore({ client: redisClient })
});

// Moderate limits for read operations
export const moderateRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many requests, please try again shortly",
});

// Light limits for cached endpoints
export const lightRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Rate limit exceeded",
});

// Per-user limits (authenticated)
export const createUserRateLimit = (max: number, windowMinutes = 15) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    keyGenerator: (req) => {
      // Use user ID if authenticated, fallback to IP
      return (req as any).user?.id || req.ip;
    },
    skip: (req) => {
      // Skip for admins
      return (req as any).user?.role === "admin";
    },
  });
};
```

### Apply to Dangerous Endpoints

```typescript
// apps/backend/src/modules/quiz/quiz.routes.ts
import {
  strictRateLimit,
  moderateRateLimit,
  createUserRateLimit,
} from "../../core/middleware/rate-limit.middleware";

const router = Router();

// PUBLIC quiz generation - VERY strict
router.get(
  "/generate",
  strictRateLimit, // 5 per minute per IP
  QuizController.generate
);

// Quiz attempts - per-user limit
router.post(
  "/attempts",
  authenticate,
  createUserRateLimit(20, 30), // 20 quizzes per 30 min
  QuizAttemptController.create
);

// Analytics - moderate
router.get(
  "/analytics/me",
  authenticate,
  moderateRateLimit,
  QuizAnalyticsController.getUserAnalytics
);
```

```typescript
// apps/backend/src/modules/words/words.routes.ts
router.get(
  "/",
  moderateRateLimit, // 30 searches per minute
  WordsController.getAll
);

// Individual word - light limit (cacheable)
router.get("/:id", lightRateLimit, WordsController.getOne);
```

```typescript
// apps/backend/src/modules/srs/srs.routes.ts
router.post(
  "/review",
  authenticate,
  createUserRateLimit(100, 10), // 100 reviews per 10 min
  SRSController.review
);

router.get("/stats", authenticate, moderateRateLimit, SRSController.getStats);
```

---

## 3. Request Deduplication (Prevent Stampede)

### Problem

100 users on dashboard = 300 simultaneous identical API calls

- 100x `GET /auth/me`
- 100x `GET /srs/stats`
- 100x `GET /quiz/analytics/me`

### Solution: Request Collapsing

```typescript
// apps/backend/src/core/middleware/request-dedup.middleware.ts

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class RequestDeduplicator {
  private pending = new Map<string, PendingRequest>();
  private maxAge = 1000; // 1 second

  async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Check if identical request is in-flight
    const existing = this.pending.get(key);

    if (existing && Date.now() - existing.timestamp < this.maxAge) {
      // Return the existing promise
      return existing.promise as Promise<T>;
    }

    // Execute new request
    const promise = fn();
    this.pending.set(key, { promise, timestamp: Date.now() });

    // Cleanup after completion
    promise.finally(() => {
      setTimeout(() => this.pending.delete(key), this.maxAge);
    });

    return promise;
  }
}

export const requestDedup = new RequestDeduplicator();
```

### Apply to High-Traffic Endpoints

```typescript
// apps/backend/src/modules/srs/srs.service.ts
import { requestDedup } from '../../core/middleware/request-dedup.middleware';

export class SRSService {
  static async getStats(userId: string) {
    const cacheKey = `srs:stats:${userId}`;

    // Check memory cache
    const cached = memoryCache.get<any>(cacheKey);
    if (cached) return cached;

    // Deduplicate simultaneous requests
    return requestDedup.deduplicate(cacheKey, async () => {
      const stats = await SRSItem.aggregate([...]);
      memoryCache.set(cacheKey, stats, 120);
      return stats;
    });
  }
}
```

**Impact**: 100 simultaneous identical requests → 1 database query

---

## 4. Graceful Degradation

### Circuit Breaker Pattern

```typescript
// apps/backend/src/core/resilience/circuit-breaker.ts

enum CircuitState {
  CLOSED, // Normal operation
  OPEN, // Failing, reject requests
  HALF_OPEN, // Testing if recovered
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private threshold = 5; // Open after 5 failures
  private timeout = 30000; // Try again after 30s
  private resetTime = 60000; // Reset counter after 60s

  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => T
  ): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        if (fallback) return fallback();
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) return fallback();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = CircuitState.OPEN;
      console.error("Circuit breaker opened!");
    }
  }
}

export const dbCircuitBreaker = new CircuitBreaker();
```

### Fallback Responses

```typescript
// apps/backend/src/modules/srs/srs.controller.ts

export class SRSController {
  static async getStats(req: Request, res: Response) {
    try {
      const stats = await dbCircuitBreaker.execute(
        () => SRSService.getStats(req.user!.id),
        () => ({
          // Fallback: return cached/stale data or defaults
          totalWords: 0,
          learning: 0,
          reviewing: 0,
          mastered: 0,
          dueToday: 0,
          newToday: 0,
          _degraded: true, // Flag for frontend
        })
      );

      res.json({ success: true, data: stats });
    } catch (error) {
      handleError(error, res);
    }
  }
}
```

---

## 5. Bot Protection

### Identify and Block Scrapers

```typescript
// apps/backend/src/core/middleware/bot-protection.middleware.ts

export const botProtection = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userAgent = req.get("user-agent") || "";

  // Block known scrapers
  const blockedBots = [
    "curl",
    "wget",
    "python-requests",
    "scrapy",
    "bot",
    "crawler",
    "spider",
  ];

  const isBot = blockedBots.some((bot) =>
    userAgent.toLowerCase().includes(bot)
  );

  if (isBot) {
    // Log for monitoring
    console.warn(`Blocked bot: ${userAgent} from ${req.ip}`);

    return res.status(403).json({
      error: "Automated access detected. Please use the web interface.",
    });
  }

  next();
};

// apps/backend/src/modules/quiz/quiz.routes.ts
router.get(
  "/generate",
  botProtection, // Block bots
  strictRateLimit, // 5 req/min
  QuizController.generate
);
```

### Honeypot Trap

```typescript
// Add fake endpoints to catch bots
router.get("/api/v1/admin-credentials", (req, res) => {
  // Log the IP for blocking
  console.error(`Honeypot triggered by ${req.ip}`);

  // Add to blocklist
  // redisClient.sadd('blocked-ips', req.ip);

  res.status(404).json({ error: "Not found" });
});
```

---

## 6. Request Timeout & Fail-Fast

### Prevent Long-Running Queries

```typescript
// apps/backend/src/config/mongo.ts
import mongoose from "mongoose";

export const connectToDatabase = async () => {
  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DBNAME,
    serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
    socketTimeoutMS: 10000, // Timeout queries after 10s
  });
};
```

### Middleware Timeout

```typescript
// apps/backend/src/core/middleware/timeout.middleware.ts

export const timeout = (ms: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          error: "Request timeout",
          message: "The server is under heavy load. Please try again.",
        });
      }
    }, ms);

    res.on("finish", () => clearTimeout(timer));
    next();
  };
};

// Apply globally
app.use(timeout(30000)); // 30 second timeout
```

---

## 7. Queue System for Writes (Advanced)

### Problem

100 simultaneous quiz submissions = 1000 SRS writes

### Solution: Queue Heavy Operations

```typescript
// apps/backend/src/core/queue/simple-queue.ts

class SimpleQueue<T> {
  private queue: T[] = [];
  private processing = false;
  private concurrency = 5; // Process 5 at a time

  async add(item: T): Promise<void> {
    this.queue.push(item);
    if (!this.processing) {
      this.process();
    }
  }

  private async process(): Promise<void> {
    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.concurrency);
      await Promise.all(batch.map((item) => this.handler(item)));
    }

    this.processing = false;
  }

  constructor(private handler: (item: T) => Promise<void>) {}
}

// Usage: Queue SRS updates
const srsUpdateQueue = new SimpleQueue(async (update: any) => {
  await SRSService.reviewWord(update.userId, update.wordId, update.quality);
});

// In quiz attempt controller
srsUpdateQueue.add({ userId, wordId, quality });
```

---

## 8. Monitoring & Alerts

### Track System Health

```typescript
// apps/backend/src/core/monitoring/metrics.ts

class Metrics {
  private counters = new Map<string, number>();
  private lastReset = Date.now();

  increment(key: string, value = 1) {
    this.counters.set(key, (this.counters.get(key) || 0) + value);
  }

  get(key: string): number {
    return this.counters.get(key) || 0;
  }

  getAll() {
    const uptime = Date.now() - this.lastReset;
    return {
      uptime,
      counters: Object.fromEntries(this.counters),
    };
  }

  reset() {
    this.counters.clear();
    this.lastReset = Date.now();
  }
}

export const metrics = new Metrics();

// Middleware to track requests
app.use((req, res, next) => {
  metrics.increment("requests_total");
  metrics.increment(`requests_${req.method}`);

  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      metrics.increment("slow_requests");
    }
  });

  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    metrics: metrics.getAll(),
  });
});
```

---

## 9. Implementation Priority

### Week 1: Emergency Protection

- [ ] Add strict rate limits to `/quiz/generate`
- [ ] Add authentication requirement to quiz endpoint
- [ ] Implement bot protection
- [ ] Add request timeouts

### Week 2: Performance

- [ ] Implement request deduplication
- [ ] Add circuit breaker to DB queries
- [ ] Implement graceful degradation

### Week 3: Advanced

- [ ] Add queue system for writes
- [ ] Implement monitoring/metrics
- [ ] Set up alerting

---

## Traffic Spike Scenarios

### Scenario 1: Reddit Front Page (1000+ concurrent)

**Without Protection**: Total crash in 5 minutes  
**With Protection**:

- Rate limiting blocks excess requests
- Request dedup reduces DB load 100x
- Circuit breaker prevents cascade failure
- System degrades gracefully
- ✅ **Survives with reduced functionality**

### Scenario 2: Bot Scraper Attack

**Without Protection**: Database exhaustion  
**With Protection**:

- Bot detection blocks scrapers
- Honeypot identifies attackers
- Rate limiting prevents damage
- ✅ **System protected**

### Scenario 3: Legitimate Traffic Spike (500 users)

**Without Protection**: Slow, 10s+ responses  
**With Protection**:

- Caching handles 80% of requests
- Rate limiting ensures fair access
- Request dedup optimizes DB queries
- ✅ **Fast, responsive system**

---

## Cost

All protections above: **$0**

Optional upgrades:

- Redis for distributed rate limiting: $5-10/month (when multi-server)
- Background queue (BullMQ): $0 (same Redis)
