# Caching Strategy: Zero to Low Cost

**No Redis Required (Until 5000+ Users)**

---

## 1. Three-Layer Caching Architecture

```
┌─────────────────────────────────────────────────┐
│  Layer 1: Browser Cache (React Query)          │
│  Cost: $0  │  Reduces: 70-80% of API calls     │
└─────────────────────────────────────────────────┘
              ↓ (20-30% traffic reaches backend)
┌─────────────────────────────────────────────────┐
│  Layer 2: HTTP Cache Headers (Express)         │
│  Cost: $0  │  Reduces: 50% of remaining calls  │
└─────────────────────────────────────────────────┘
              ↓ (10-15% traffic hits database)
┌─────────────────────────────────────────────────┐
│  Layer 3: In-Memory Cache (Node.js)             │
│  Cost: $0  │  Reduces: 80% of DB queries       │
└─────────────────────────────────────────────────┘
              ↓ (2-3% actually query MongoDB)
┌─────────────────────────────────────────────────┐
│  MongoDB Free Tier                              │
│  Final Load: 97% reduction                      │
└─────────────────────────────────────────────────┘
```

---

## 2. Layer 1: React Query Optimization (Frontend)

### Current State (❌ NO CACHING)

```typescript
// Dashboard loads 3 APIs every visit, no caching
useQuery(["user", "me"], () => axiosInstance.get("/auth/me"));
useQuery(["analytics", "me"], () => axiosInstance.get("/quiz/analytics/me"));
useQuery(["srs", "stats"], () => axiosInstance.get("/srs/stats"));
```

### Optimized (✅ WITH STALE-WHILE-REVALIDATE)

```typescript
// apps/user/src/app/dashboard/page.tsx

const { data: user } = useQuery({
  queryKey: ["user", "me"],
  queryFn: async () => {
    const { data } = await axiosInstance.get("/auth/me");
    return data.data;
  },
  staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
  cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  refetchOnWindowFocus: false, // Don't refetch on tab switch
});

const { data: srsStats } = useQuery({
  queryKey: ["srs", "stats"],
  queryFn: async () => {
    const { data } = await axiosInstance.get("/srs/stats");
    return data.data;
  },
  staleTime: 2 * 60 * 1000, // Fresh for 2 minutes
  cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  refetchOnWindowFocus: false,
});

const { data: analytics } = useQuery({
  queryKey: ["analytics", "me"],
  queryFn: async () => {
    const { data } = await axiosInstance.get("/quiz/analytics/me");
    return data.data;
  },
  staleTime: 10 * 60 * 1000, // Analytics rarely change
  cacheTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
});
```

### Vocabulary Page Cache

```typescript
// apps/user/src/app/vocabulary/page.tsx
const { data } = useQuery({
  queryKey: [
    "words",
    page,
    difficulty,
    debouncedWordSearch,
    debouncedTopicSearch,
  ],
  queryFn: async () => {
    const params = new URLSearchParams({ page: page.toString(), limit: "12" });
    if (difficulty !== "all") params.append("difficulty", difficulty);
    if (debouncedWordSearch) params.append("search", debouncedWordSearch);
    if (debouncedTopicSearch) params.append("topicName", debouncedTopicSearch);

    const { data } = await axiosInstance.get(`/words?${params.toString()}`);
    return data.data;
  },
  staleTime: 5 * 60 * 1000, // Word list stable
  cacheTime: 30 * 60 * 1000, // Keep popular searches
  keepPreviousData: true, // Smooth pagination
});
```

**Impact**: Dashboard visits: 3 API calls/visit → 3 API calls/10 minutes per user

---

## 3. Layer 2: HTTP Cache Headers (Backend)

### Cache Middleware

```typescript
// apps/backend/src/core/middleware/cache.middleware.ts

export const cacheControl = (maxAge: number, options = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const {
      public: isPublic = true,
      immutable = false,
      staleWhileRevalidate = 0,
    } = options;

    const directives = [
      isPublic ? "public" : "private",
      `max-age=${maxAge}`,
      staleWhileRevalidate > 0
        ? `stale-while-revalidate=${staleWhileRevalidate}`
        : "",
      immutable ? "immutable" : "",
    ].filter(Boolean);

    res.setHeader("Cache-Control", directives.join(", "));
    next();
  };
};

export const noCache = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
  }
  next();
};
```

### Apply to Routes

```typescript
// apps/backend/src/modules/words/words.routes.ts
import { cacheControl, noCache } from "../../core/middleware/cache.middleware";

const router = Router();

// Public word list - cache aggressively
router.get(
  "/",
  cacheControl(300, { staleWhileRevalidate: 600 }),
  WordsController.getAll
);

// Individual word - cache even longer
router.get(
  "/:id",
  cacheControl(600, { staleWhileRevalidate: 1800 }),
  WordsController.getOne
);

// Topics - rarely change
router.get("/topics", cacheControl(3600), TopicsController.getAll);
```

```typescript
// apps/backend/src/modules/srs/srs.routes.ts

// SRS stats - short cache, user-specific
router.get("/stats", cacheControl(120), SRSController.getStats); // 2 min cache

// Due words - can be slightly stale
router.get("/due", cacheControl(60), SRSController.getDue);

// Write operations - never cache
router.post("/review", noCache, SRSController.review);
```

```typescript
// apps/backend/src/modules/quiz/quiz.routes.ts

// Quiz generation - cache by params
router.get("/generate", cacheControl(180), QuizController.generate);

// Analytics - can be cached
router.get(
  "/analytics/me",
  cacheControl(300),
  QuizAnalyticsController.getUserAnalytics
);
```

---

## 4. Layer 3: In-Memory Cache (Node.js)

### Simple LRU Cache

```typescript
// apps/backend/src/core/cache/memory-cache.ts

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 1000; // Max 1000 entries

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlSeconds: number): void {
    // Enforce max size - remove oldest
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();
```

### Cache Popular Queries

```typescript
// apps/backend/src/modules/words/words.service.ts
import { memoryCache } from "../../core/cache/memory-cache";

export class WordsService {
  static async findAll(query: any, page: number = 1, limit: number = 20) {
    // Create cache key from query params
    const cacheKey = `words:${JSON.stringify(query)}:${page}:${limit}`;

    // Check cache first
    const cached = memoryCache.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    // Execute query
    const skip = (page - 1) * limit;
    const filter: any = {};
    // ... build filter

    const [words, total] = await Promise.all([
      Word.find(filter).skip(skip).limit(limit).populate("topic").lean(),
      Word.countDocuments(filter),
    ]);

    const result = {
      words,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    // Cache for 5 minutes
    memoryCache.set(cacheKey, result, 300);

    return result;
  }
}
```

### Cache SRS Stats

```typescript
// apps/backend/src/modules/srs/srs.service.ts
export class SRSService {
  static async getStats(userId: string) {
    const cacheKey = `srs:stats:${userId}`;

    const cached = memoryCache.get<any>(cacheKey);
    if (cached) return cached;

    // Run aggregation (from MongoDB optimization guide)
    const stats = await SRSItem.aggregate([...]);

    // Cache for 2 minutes
    memoryCache.set(cacheKey, stats, 120);

    return stats;
  }

  static async reviewWord(userId: string, wordId: string, quality: number) {
    // ... save review

    // Invalidate user's stats cache
    memoryCache.delete(`srs:stats:${userId}`);
    memoryCache.delete(`srs:due:${userId}`);

    return srsItem.save();
  }
}
```

---

## 5. What to Cache & TTL Strategy

| Data Type            | Cache Layer  | TTL      | Invalidation       |
| -------------------- | ------------ | -------- | ------------------ |
| **Static Word List** | All 3 layers | 5-10 min | Admin word updates |
| **Topics**           | All 3 layers | 1 hour   | Rarely changes     |
| **SRS Stats**        | Layer 1 & 3  | 2 min    | On review submit   |
| **Quiz Analytics**   | All 3 layers | 5-10 min | On quiz submit     |
| **Due Words**        | Layer 3 only | 1 min    | On review submit   |
| **User Profile**     | Layer 1 & 2  | 5 min    | On profile update  |
| **Search Results**   | Layer 3 only | 5 min    | Admin word updates |
| **Quiz Generation**  | Layer 2 only | 3 min    | Never (stateless)  |

### ❌ What NOT to Cache

- Individual quiz attempts (user-specific)
- Real-time review submissions
- Auth tokens (security)
- Password reset tokens

---

## 6. Cache Invalidation Strategy

### Pattern-Based Invalidation

```typescript
// When admin updates a word
export class WordsService {
  static async update(id: string, input: Partial<CreateWordInput>) {
    const word = await Word.findByIdAndUpdate(id, input, { new: true });

    // Invalidate all word-related caches
    memoryCache.invalidatePattern("^words:");

    return word;
  }
}

// When user completes quiz
export class QuizAttemptService {
  static async createAttempt(data: Partial<IQuizAttempt>) {
    const attempt = await QuizAttempt.create(data);

    // Invalidate user-specific caches
    memoryCache.delete(`analytics:${data.userId}`);
    memoryCache.delete(`srs:stats:${data.userId}`);

    return attempt;
  }
}
```

---

## 7. Cloudflare Free Tier (Optional Premium Layer)

### Setup (If Using Custom Domain)

1. Add site to Cloudflare (free)
2. Enable caching for API endpoints
3. Set cache rules

### Cloudflare Configuration

```javascript
// Cloudflare Page Rule for /api/v1/words*
Cache Level: Cache Everything
Edge Cache TTL: 5 minutes
Browser Cache TTL: 2 minutes
```

### Benefits

- Global CDN edge caching
- DDoS protection (free)
- SSL/TLS (free)
- ~50% reduction in origin requests

**Cost**: $0 (on free plan)

---

## 8. Implementation Checklist

### Week 1: Quick Wins

- [ ] Add React Query `staleTime` to all queries (2 hours)
- [ ] Implement HTTP cache headers (1 hour)
- [ ] Create memory cache utility (30 min)
- [ ] Cache word queries (30 min)
- [ ] Cache SRS stats (30 min)

### Week 2: Full Implementation

- [ ] Cache all read queries
- [ ] Implement cache invalidation
- [ ] Add cache metrics/logging
- [ ] Test cache hit rates

### When to Add Redis

**Trigger**: When you need one of these

- Multiple backend servers (horizontal scaling)
- Cache persistence across restarts
- Pub/sub for realtime features
- User > 5000 active daily

**Cost**: $5-10/month (Redis Cloud free tier: 30MB)

---

## Performance Impact

| Metric              | Before Caching  | After Caching  | Improvement          |
| ------------------- | --------------- | -------------- | -------------------- |
| Dashboard API Calls | 3 per visit     | 3 per 5-10 min | **10-20x reduction** |
| Word Search Queries | Every keystroke | Cached results | **5-10x reduction**  |
| SRS Stats Queries   | Every page load | Every 2 min    | **10x reduction**    |
| MongoDB Reads       | 50K/day         | 5K/day         | **90% reduction**    |
| Response Time       | 200-500ms       | 20-50ms        | **4-10x faster**     |

**Result**: Support 1000+ concurrent users on free tier with caching alone.
