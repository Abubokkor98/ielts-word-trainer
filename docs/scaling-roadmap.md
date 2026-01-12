# Scaling Triggers & Cost Roadmap

**Pay Only When These Thresholds Hit**

---

## 1. Trigger-Based Scaling Philosophy

> **Rule**: Don't pay for infrastructure until you hit a measurable threshold that proves you need it.

| Stage       | Users     | Monthly Cost | What You're Paying For |
| ----------- | --------- | ------------ | ---------------------- |
| **Stage 0** | 0-100     | **$0**       | Free tier everything   |
| **Stage 1** | 100-500   | **$0**       | Optimizations only     |
| **Stage 2** | 500-1500  | **$0-10**    | Optional Redis         |
| **Stage 3** | 1500-5000 | **$25-50**   | MongoDB M10            |
| **Stage 4** | 5000-20K  | **$100-200** | + Search + CDN         |
| **Stage 5** | 20K+      | **$500+**    | Full stack             |

---

## 2. Stage 0: Free Tier Baseline (0-100 Users)

### Current State

- MongoDB Free Tier (M0)
- No caching
- Basic rate limiting
- Vercel/Netlify free hosting

### Metrics to Monitor

```javascript
// Add this to track
{
  "daily_active_users": 0,
  "avg_response_time": 0,
  "slow_queries_percent": 0,  // Queries > 100ms
  "mongodb_cpu_usage": 0,
  "mongodb_connections": 0,
  "cache_hit_rate": 0
}
```

### Actions

✅ Implement all **free optimizations** from previous guides:

- Add missing indexes
- Fix SRS stats aggregation
- Implement caching strategy
- Add rate limiting
- Fix search queries

### Trigger to Next Stage

**When ANY of these hit**:

- ❌ Avg response time > 500ms consistently
- ❌ Slow queries > 20%
- ❌ MongoDB CPU > 50% sustained

**Action**: Move to Stage 1

---

## 3. Stage 1: Optimized Free Tier (100-500 Users)

### What You Have

- All Stage 0 optimizations applied
- Memory caching active
- React Query caching
- Proper indexes

### New Capabilities

- Handling 100-500 daily active users
- Response times < 200ms
- 80%+ cache hit rate

### Cost: **$0**

### Metrics to Monitor

```javascript
{
  "daily_active_users": 100-500,
  "peak_concurrent_users": 0,
  "avg_response_time": 150,
  "mongodb_cpu_usage": 30-40,
  "cache_hit_rate": 80,
  "search_queries_per_day": 0,
  "review_sessions_per_day": 0
}
```

### Trigger to Next Stage

**When ANY of these hit**:

- ❌ Peak concurrent users > 100
- ❌ MongoDB CPU > 60% during peaks
- ❌ Response time > 300ms during peaks
- ❌ Memory cache hit rate < 60%

**Action**: Consider Redis (Stage 2)

---

## 4. Stage 2: Add Redis (500-1500 Users)

### Why Add Redis?

- Multiple backend instances (horizontal scaling)
- Distributed rate limiting
- Persistent cache across restarts
- **Cost**: $5-10/month (Redis Cloud 30-100MB)

### Decision Matrix

| Indicator         | Stay Free | Add Redis |
| ----------------- | --------- | --------- |
| Backend instances | 1         | 2+        |
| Cache hit rate    | >70%      | <60%      |
| Memory pressure   | OK        | High      |
| Need pub/sub      | No        | Yes       |

### Redis Implementation

```typescript
// apps/backend/src/config/redis.ts
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

export { redis };
```

```typescript
// Replace memory cache with Redis
import { redis } from "../../config/redis";

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  static async delete(key: string): Promise<void> {
    await redis.del(key);
  }
}
```

### Cost: **$5-10/month**

### Trigger to Next Stage

**When ANY of these hit**:

- ❌ MongoDB storage > 400MB
- ❌ Daily queries > 500K
- ❌ Need more than M0 connections
- ❌ Response time > 500ms consistently

**Action**: Upgrade to paid MongoDB (Stage 3)

---

## 5. Stage 3: MongoDB M10 (1500-5000 Users)

### Why Upgrade MongoDB?

- More storage (10GB vs 512MB)
- Dedicated resources (2GB RAM)
- Better performance
- Backup & monitoring

### Cost: **$25-57/month** (M10 cluster)

### Migration Checklist

- [ ] Export current data
- [ ] Create M10 cluster
- [ ] Update connection string
- [ ] Test performance
- [ ] Monitor for 48 hours
- [ ] Decommission M0

### Performance Gains

| Metric         | M0 (Free)     | M10 (Paid)     |
| -------------- | ------------- | -------------- |
| Storage        | 512 MB        | 10 GB          |
| RAM            | 512 MB shared | 2 GB dedicated |
| vCPU           | Shared        | 2 vCPU         |
| Connections    | 500           | 1500           |
| Avg Query Time | 100-500ms     | 10-50ms        |

### Metrics to Monitor

```javascript
{
  "daily_active_users": 1500-5000,
  "storage_used_gb": 1-5,
  "avg_query_time_ms": 30,
  "peak_concurrent_users": 200-400,
  "search_usage_percent": 0,  // % of traffic doing search
}
```

### Trigger to Next Stage

**When ANY of these hit**:

- ❌ Search queries > 10K/day with slow performance
- ❌ Search response time > 1s
- ❌ Users complaining about search relevance

**Action**: Add search engine (Stage 4)

---

## 6. Stage 4: Add Search Engine (5000-20K Users)

### When to Add Elasticsearch/Algolia

**Elasticsearch**: Better for larger datasets, full control  
**Algolia**: Instant setup, great UX, expensive at scale

### Decision Tree

```
Search queries/day < 5K → Stay with MongoDB text search
                    ↓
Search queries/day > 10K → Need dedicated search
                    ↓
    Budget < $50/mo → Elasticsearch self-hosted
    Want managed solution → Algolia
```

### Elasticsearch Integration

```typescript
// apps/backend/src/config/elasticsearch.ts
import { Client } from "@elastic/elasticsearch";

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ES_USERNAME || "",
    password: process.env.ES_PASSWORD || "",
  },
});

export { esClient };
```

```typescript
// Sync words to Elasticsearch
export async function syncWordToES(word: IWord) {
  await esClient.index({
    index: "words",
    id: word._id.toString(),
    document: {
      word: word.word,
      meaning: word.meaning,
      synonyms: word.synonyms,
      antonyms: word.antonyms,
      difficulty: word.difficulty,
      topic: word.topic,
    },
  });
}

// Search via Elasticsearch
export async function searchWords(query: string) {
  const { hits } = await esClient.search({
    index: "words",
    body: {
      query: {
        multi_match: {
          query,
          fields: ["word^3", "meaning^2", "synonyms", "antonyms"],
          fuzziness: "AUTO",
        },
      },
    },
  });

  return hits.hits.map((hit) => hit._source);
}
```

### Cost Options

| Solution            | Cost/Month     | Best For          |
| ------------------- | -------------- | ----------------- |
| MongoDB Text Search | $0             | < 5K searches/day |
| Self-hosted ES      | $10-20         | Budget-conscious  |
| Elastic Cloud       | $45+           | Managed, scalable |
| Algolia             | $1/1K searches | Premium UX        |

### Trigger to Next Stage

- ❌ Traffic > 100K req/day
- ❌ Need CDN globally
- ❌ Need advanced analytics

**Action**: Full production stack (Stage 5)

---

## 7. Stage 5: Production Stack (20K+ Users)

### Full Stack Architecture

```
Cloudflare CDN (Free/Pro $20)
        ↓
Load Balancer ($10-20)
        ↓
Multiple Backend Instances (Kubernetes/ECS)
        ↓
Redis Cluster ($50-100)
        ↓
MongoDB M30+ ($150+)
        ↓
Elasticsearch Cluster ($100+)
```

### Estimated Monthly Costs

| Component              | Cost        | Negotiable?           |
| ---------------------- | ----------- | --------------------- |
| Hosting (3x instances) | $60         | ✅                    |
| MongoDB M30            | $150        | ✅                    |
| Redis (5GB)            | $50         | ✅                    |
| Elasticsearch          | $100        | ✅                    |
| CDN (Cloudflare Pro)   | $20         | ❌                    |
| Monitoring (DataDog)   | $30         | ✅                    |
| **Total**              | **$410/mo** | Can negotiate to $300 |

---

## 8. Monetization Triggers

### When to Start Charging Users

**Trigger**: When infrastructure costs > $100/month

### Pricing Tiers

```
Free Tier:
- 10 quizzes/day
- Basic vocabulary
- Ads-supported

Premium ($5-9/month):
- Unlimited quizzes
- Advanced SRS
- No ads
- Analytics

Pro ($15-19/month):
- Everything in Premium
- Custom word lists
- API access
```

### Revenue Projections

| Users  | Free % | Premium % | Monthly Revenue |
| ------ | ------ | --------- | --------------- |
| 1,000  | 90%    | 10%       | $500-900        |
| 5,000  | 85%    | 15%       | $3,750-6,750    |
| 10,000 | 80%    | 20%       | $10,000-18,000  |

**Break-even**: ~500 paid users to cover $300-400/month costs

---

## 9. Emergency Rollback Plan

### If You Overscale Too Early

**Scenario**: Upgraded to M10 ($57/month) but only have 200 users

**Rollback Strategy**:

1. Export data from M10
2. Migrate back to M0
3. Apply all optimizations from Stage 1
4. Save $57/month until truly needed

### When to Downgrade

- Users dropped below threshold for 2 consecutive months
- Cost > 30% of revenue
- Alternative optimization available

---

## 10. Practical Thresholds Summary

| Metric             | Free Tier OK | Consider Upgrade | Must Upgrade |
| ------------------ | ------------ | ---------------- | ------------ |
| **DAU**            | < 500        | 500-1500         | > 1500       |
| **DB CPU**         | < 50%        | 50-70%           | > 70%        |
| **Response Time**  | < 300ms      | 300-800ms        | > 800ms      |
| **Storage**        | < 400MB      | 400-480MB        | > 480MB      |
| **Search Queries** | < 5K/day     | 5K-10K/day       | > 10K/day    |
| **Monthly Cost**   | $0           | $10-30           | Justified    |

---

## 11. Decision Flowchart

```
Start
  ↓
Monitor metrics weekly
  ↓
Any threshold exceeded? → NO → Continue monitoring
  ↓ YES
Identify bottleneck
  ↓
Is it fixable with optimization? → YES → Apply fix
  ↓ NO                                      ↓
Do users complain? → NO → Defer upgrade    Monitor results
  ↓ YES                                      ↓
Can you monetize? → YES → Upgrade + Launch pricing
  ↓ NO
Seek funding or apply free optimizations
```

---

## Final Advice

### ✅ DO

- Monitor metrics religiously
- Apply free optimizations first
- Upgrade based on data, not assumptions
- Start monetization before infrastructure costs spike

### ❌ DON'T

- Upgrade "just in case"
- Over-engineer early
- Ignore free-tier optimizations
- Pay for Redis if single-instance
- Add search engine before 10K searches/day

**Bottom Line**: With proper optimizations, you can support 1000-1500 daily active users on **$0/month** infrastructure.
