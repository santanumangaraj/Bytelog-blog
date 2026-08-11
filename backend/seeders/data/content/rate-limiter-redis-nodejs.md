## Why Rate Limiting Matters

Public APIs are exposed to unpredictable traffic. Without protection, a single client can send thousands of requests per second and degrade the experience for everyone else.

Rate limiting caps how many requests a client can make in a given time window, protecting your backend from abuse and accidental overload.

## A Simple Approach: Fixed Window Counter

Redis makes this easy because it already behaves like a fast, shared counter store.

```
Request arrives
   ↓
Build key: rate:<userId>:<currentMinute>
   ↓
INCR key
   ↓
count > limit?
   ├── Yes → Reject (429 Too Many Requests)
   │
   └── No → Allow request
```

Each key represents one time window (for example, one minute), and Redis's `INCR` command atomically increments the counter even under concurrent requests.

## Example in Node.js

```
const key = `rate:${userId}:${Math.floor(Date.now() / 60000)}`;

const requests = await redis.incr(key);

if (requests === 1) {
    await redis.expire(key, 60);
}

if (requests > 100) {
    throw new ApiError(429, "Too many requests, please try again later");
}
```

The first request in a new window sets an expiry on the key so it automatically resets after 60 seconds.

## Fixed Window vs Sliding Window

The fixed window approach is simple but has a weakness: a client can send a burst of requests right at the boundary of two windows and effectively double their limit.

A sliding window log or sliding window counter algorithm smooths this out, at the cost of extra Redis operations (usually a sorted set per client). For most applications, a fixed window with a reasonably short interval is a good enough starting point.

## Important Considerations

- Choosing the right window size and limit for your traffic pattern
- Whether to rate limit by user ID, IP address, or API key
- Returning clear `429` responses with a `Retry-After` header
- Making sure the limiter fails open (or closed) sensibly if Redis is unavailable
- Applying different limits to different routes (login vs read-only endpoints)

## Conclusion

Rate limiting is one of the simplest and most effective ways to protect a Node.js API, and Redis is a natural fit because of its atomic counters and built-in key expiry.

Start with a basic fixed-window limiter on your most sensitive routes (login, search, write endpoints) before reaching for more sophisticated algorithms.
