# Founder Implementation Roadmap

**Solo Developer Edition: Maximize Impact, Minimize Time**

---

## 🎯 Your Situation

**Reality Check**:

- ✅ You built a working IELTS vocabulary platform
- ✅ Using free tier (MongoDB M0, Vercel/Netlify)
- ✅ NX monorepo with Express + Next.js
- ❌ System will crash at 500+ concurrent users
- ❌ No caching, inefficient queries, public endpoints

**Goal**: Make it bulletproof on free tier, then scale smartly when revenue justifies it.

---

## 📋 Priority Matrix

| Priority  | Task                            | Impact       | Time    | Cost |
| --------- | ------------------------------- | ------------ | ------- | ---- |
| **P0** 🔴 | Add missing indexes             | **Massive**  | 10 min  | $0   |
| **P0** 🔴 | Add auth to /quiz/generate      | **Critical** | 15 min  | $0   |
| **P0** 🔴 | Fix SRS stats aggregation       | **High**     | 30 min  | $0   |
| **P1** 🟡 | Add rate limiting               | **High**     | 1 hour  | $0   |
| **P1** 🟡 | Implement caching (React Query) | **High**     | 2 hours | $0   |
| **P1** 🟡 | Fix word search                 | **Medium**   | 1 hour  | $0   |
| **P2** 🟢 | Add bulk writes                 | **Medium**   | 1 hour  | $0   |
| **P2** 🟢 | Implement in-memory cache       | **Medium**   | 2 hours | $0   |
| **P3** ⚪ | Add circuit breaker             | **Low**      | 2 hours | $0   |
| **P3** ⚪ | Monitoring/metrics              | **Low**      | 3 hours | $0   |

**Total Time for P0-P1**: ~5-6 hours  
**Total Cost**: **$0**  
**Impact**: Support 1000+ users on free tier

---

## 🚀 Week 1: Emergency Fixes (5-6 Hours)

### Day 1: Critical Database Fixes (2 hours)

#### Task 1.1: Add Missing Indexes (10 min)

```bash
# Connect to MongoDB Atlas
# Database > Browse Collections > Open mongo shell

# Paste these commands:
db.words.createIndex({ difficulty: 1 });
db.words.createIndex({ module: 1 });
db.words.createIndex({ difficulty: 1, module: 1 });
db.srsitems.createIndex({ user: 1, status: 1 });
db.srsitems.createIndex({ user: 1, nextReviewDate: 1, status: 1 });
db.quizattempts.createIndex({ userId: 1, createdAt: -1 });
```

**Expected Result**: Query time drops from 2-5s to <100ms

#### Task 1.2: Secure Quiz Endpoint (15 min)

```typescript
// apps/backend/src/modules/quiz/quiz.routes.ts

// BEFORE (❌ PUBLIC)
router.get('/generate', QuizController.generate);

// AFTER (✅ PROTECTED)
router.get('/generate', authenticate, QuizController.generate);
```

**Expected Result**: Prevents bot attacks, saves massive DB load

#### Task 1.3: Fix SRS Stats Query (30 min)

**File**: `apps/backend/src/modules/srs/srs.service.ts`

Replace lines 113-154 with aggregation pipeline from [`mongodb-optimization-guide.md`](./mongodb-optimization-guide.md#2-fix-srs-stats-query-critical)

**Test**:

```bash
# Hit the endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/srs/stats
```

**Expected Result**: Response time 800ms → 20ms

#### Task 1.4: Add Per-Endpoint Rate Limiting (1 hour)

1. Create `apps/backend/src/core/middleware/rate-limit.middleware.ts`
2. Copy code from [`traffic-protection.md`](./traffic-protection.md#layer-1-aggressive-per-endpoint-limits)
3. Apply to routes:
   - `/quiz/generate`: 5 req/min
   - `/words`: 30 req/min
   - `/srs/review`: 100 req/10min

**Test**: Make 6 rapid requests to `/quiz/generate`

```bash
for i in {1..6}; do curl http://localhost:5000/api/v1/quiz/generate; done
```

**Expected Result**: 5 succeed, 6th returns 429 Too Many Requests

---

### Day 2: Frontend Caching (2 hours)

#### Task 2.1: Add React Query Caching (2 hours)

Update these files with caching configs from [`caching-strategy.md`](./caching-strategy.md#2-layer-1-react-query-optimization-frontend):

1. `apps/user/src/app/dashboard/page.tsx`
   - Add `staleTime`, `cacheTime`, `refetchOnWindowFocus: false`
2. `apps/user/src/app/vocabulary/page.tsx`
   - Add `staleTime: 5 * 60 * 1000`
   - Add `keepPreviousData: true`

**Test**:

1. Open dashboard
2. Check Network tab (should see 3 API calls)
3. Navigate away and back
4. Network tab should show 0 API calls (cached)

**Expected Result**: Dashboard visits generate 90% fewer API calls

---

### Day 3: Search Optimization (1-2 hours)

#### Task 3.1: Add Searchable Text Field (1-2 hours)

**File**: `apps/backend/src/modules/words/words.model.ts`

Add from [`mongodb-optimization-guide.md`](./mongodb-optimization-guide.md#3-fix-word-search-eliminate-regex-on-arrays):

1. Add `searchableText` field to schema
2. Add pre-save hook
3. Create index in MongoDB

**File**: `apps/backend/src/modules/words/words.service.ts`

Replace regex search with indexed field search

**Backfill existing data**:

```typescript
// Run this script once
const words = await Word.find();
for (const word of words) {
  word.searchableText = [word.word, word.meaning, ...(word.synonyms || []), ...(word.antonyms || [])].join(' ').toLowerCase();
  await word.save();
}
```

**Test**: Search for "happy" in vocabulary page

**Expected Result**: Search time 2-5s → <100ms

---

## 🛡️ Week 2: Protection & Resilience (Optional, 4-6 hours)

### Task 4.1: In-Memory Cache (2 hours)

Create `apps/backend/src/core/cache/memory-cache.ts` from [`caching-strategy.md`](./caching-strategy.md#4-layer-3-in-memory-cache-nodejs)

Apply to:

- Word queries
- SRS stats
- Analytics

### Task 4.2: Bulk Write Optimization (1 hour)

Update `apps/backend/src/modules/quiz/quiz-attempt.service.ts` with bulk write from [`mongodb-optimization-guide.md`](./mongodb-optimization-guide.md#5-batch-write-optimization)

### Task 4.3: Bot Protection (30 min)

Add bot detection middleware from [`traffic-protection.md`](./traffic-protection.md#5-bot-protection)

### Task 4.4: HTTP Cache Headers (1 hour)

Add cache control middleware from [`caching-strategy.md`](./caching-strategy.md#3-layer-2-http-cache-headers-backend)

---

## 📊 Testing Your Changes

### Test 1: Load Test (Free Tool)

```bash
# Install k6
brew install k6  # or download from k6.io

# Create test script: load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 50 },   // Stay at 50
    { duration: '1m', target: 100 },  // Ramp to 100
    { duration: '2m', target: 100 },  // Stay at 100
    { duration: '1m', target: 0 },    // Ramp down
  ],
};

export default function () {
  const res = http.get('http://localhost:5000/api/v1/words');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

# Run test
k6 run load-test.js
```

**Success Criteria**:

- ✅ 95% of requests < 500ms
- ✅ 0% error rate
- ✅ No MongoDB throttling

### Test 2: Cache Hit Rate

```typescript
// Add to your memory cache class
private hits = 0;
private misses = 0;

get<T>(key: string): T | null {
  const entry = this.cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) {
    this.misses++;
    return null;
  }
  this.hits++;
  return entry.data;
}

getHitRate(): number {
  const total = this.hits + this.misses;
  return total === 0 ? 0 : (this.hits / total) * 100;
}
```

**Success Criteria**: Cache hit rate > 70%

---

## 💰 When to Consider Paid Services

### Trigger Checklist

**Do NOT pay for anything until you hit these**:

| Metric             | Free Tier OK | Consider Paid | Must Upgrade |
| ------------------ | ------------ | ------------- | ------------ |
| Daily Active Users | < 500        | 500-1000      | > 1500       |
| MongoDB CPU        | < 50%        | 50-70%        | > 70%        |
| Response Time      | < 300ms      | 300-800ms     | > 800ms      |
| Storage Used       | < 400MB      | 400-480MB     | > 480MB      |

**First Paid Service**: MongoDB M10 ($25-57/month) when you hit >1500 DAU

See [`scaling-roadmap.md`](./scaling-roadmap.md) for full decision tree.

---

## 🎓 Educational Resources

### Learn While You Build

- **MongoDB Aggregation**: [MongoDB University M121](https://university.mongodb.com/)
- **Caching Strategies**: [Web.dev Caching Guide](https://web.dev/http-cache/)
- **Rate Limiting**: [Express Rate Limit Docs](https://github.com/express-rate-limit/express-rate-limit)

### Monitoring Tools (Free)

- MongoDB Atlas Charts (built-in)
- Vercel Analytics (free tier)
- React Query Devtools (already installed)

---

## 🏁 Success Metrics (After Week 1)

| Before                      | After                  | Improvement       |
| --------------------------- | ---------------------- | ----------------- |
| Dashboard load: 3 API calls | 0.3 API calls (cached) | **10x less**      |
| Word search: 2-5s           | <100ms                 | **20-50x faster** |
| SRS stats: 800ms            | 20ms                   | **40x faster**    |
| Quiz submit: 10 writes      | 1 bulk write           | **10x faster**    |
| Supports users: ~100        | 1000+                  | **10x capacity**  |
| Monthly cost: $0            | $0                     | **Still free!**   |

---

## 🚨 Emergency Contacts

### If Something Breaks

1. **Check MongoDB**: Atlas > Metrics
2. **Check Logs**: `pm2 logs` or Vercel deployment logs
3. **Rollback**: `git revert HEAD && git push`

### Community Help

- MongoDB Forums: community.mongodb.com
- NX Discord: nx.dev/community
- Stack Overflow: Tag `mongodb`, `express`, `nextjs`

---

## ✅ Final Checklist

### Before Going Live

- [ ] All P0 tasks completed
- [ ] Load tested with k6
- [ ] Cache hit rate > 70%
- [ ] MongoDB indexes verified
- [ ] Rate limiting active
- [ ] Error handling tested
- [ ] Backup strategy (MongoDB Atlas auto-backup)

### Ongoing Monitoring (Weekly)

- [ ] Check MongoDB CPU usage
- [ ] Review slow query logs
- [ ] Monitor error rates
- [ ] Track daily active users
- [ ] Verify cache performance

**Next**: When you hit 1000 DAU, revisit [`scaling-roadmap.md`](./scaling-roadmap.md) for next steps.

---

**Remember**: Perfect is the enemy of shipped. Do Week 1, launch, iterate based on real user data.
