# Rate Limiting Rules

## Algorithm

Token bucket algorithm with per-user and per-IP tracking.

- **Bucket capacity:** Maximum burst allowed
- **Refill rate:** Tokens added per minute
- **Violation threshold:** 100 violations within 5 minutes → IP ban (24h)

---

## Endpoint Rate Limits

### Authentication Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /auth/email/create` | 5 requests | 1 minute |
| `POST /auth/email/login` | 5 requests | 1 minute |
| `POST /auth/phone/send` | 3 requests | 1 minute |
| `POST /auth/phone/confirm` | 5 requests | 1 minute |
| `POST /auth/oauth/:provider` | 5 requests | 1 minute |
| `DELETE /auth/logout` | 10 requests | 1 minute |
| `GET /auth/me` | 30 requests | 1 minute |

### Post Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| `GET /posts` (feed) | 30 requests | 1 minute |
| `GET /posts/:id` | 30 requests | 1 minute |
| `POST /posts` (create) | 30 requests | 1 hour |
| `PUT /posts/:id` | 20 requests | 1 hour |
| `DELETE /posts/:id` | 10 requests | 1 hour |
| `POST /posts/:id/like` | 60 requests | 1 minute |
| `POST /posts/:id/comments` | 20 requests | 1 minute |
| `POST /posts/:id/repost` | 20 requests | 1 hour |

### Profile Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| `GET /users/:id` | 60 requests | 1 minute |
| `PUT /users/:id` | 10 requests | 1 minute |
| `GET /users/:id/followers` | 30 requests | 1 minute |
| `GET /users/:id/following` | 30 requests | 1 minute |
| `POST /users/:id/follow` | 30 requests | 1 minute |
| `DELETE /users/:id/unfollow` | 30 requests | 1 minute |

### Messaging Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| `GET /conversations` | 30 requests | 1 minute |
| `POST /conversations` | 20 requests | 1 minute |
| `GET /conversations/:id/messages` | 60 requests | 1 minute |
| `POST /conversations/:id/messages` | 30 requests | 1 minute |
| Realtime (typing) | 60 events | 1 minute |

### Story Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| `GET /stories` | 30 requests | 1 minute |
| `POST /stories` | 10 requests | 1 hour |
| `POST /stories/:id/view` | 60 requests | 1 minute |

### Notification Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| `GET /notifications` | 30 requests | 1 minute |
| `PUT /notifications/:id/read` | 30 requests | 1 minute |
| `PUT /notifications/read-all` | 10 requests | 1 minute |

### Admin / Moderation Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /reports` | 10 requests | 1 minute |
| `GET /admin/reports` | 30 requests | 1 minute |
| `PUT /admin/reports/:id/resolve` | 20 requests | 1 minute |
| `POST /admin/users/:id/ban` | 10 requests | 1 hour |
| `POST /admin/users/:id/verify` | 10 requests | 1 hour |

### General / Default

| Limit | Window |
|-------|--------|
| 100 requests | 1 minute |

---

## Rate Limit Headers

Every API response includes the following headers:

### Standard Rate Limit Headers

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1626360000
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in the window |
| `X-RateLimit-Remaining` | Requests remaining in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |

### Retry-After Header

When the rate limit is exceeded (HTTP 429), the response includes:

```
Retry-After: 60
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1626360060
```

`Retry-After` is in seconds. Clients MUST wait this duration before retrying.

---

## Rate Limit Categories

| Category | Default Limit | Description |
|----------|---------------|-------------|
| **Auth** | 5/min | Login, signup, phone verification |
| **Write** | 30/hour | Post, story, comment creation |
| **Read** | 60/min | Feed, profile, content retrieval |
| **General** | 100/min | All other authenticated requests |
| **Guest** | 20/min | Unauthenticated requests (stricter) |

---

## Implementation Notes

### Storage

- **In-memory cache** (Redis or Appwrite Functions cache) for rate limit counters
- **Persistent storage** (Appwrite Database) for banned IPs and user blocks
- Rate limit data TTL matches the window duration

### Scope

- **Authenticated requests:** Rate limit by `userId`
- **Unauthenticated requests:** Rate limit by IP address
- **Whitelist:** Admin users and internal services bypass rate limits

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_001",
    "message": "Too many requests",
    "details": {
      "retryAfter": 60,
      "limit": 5,
      "reset": 1626360060
    }
  }
}
```
