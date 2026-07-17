# Request / Response Formats

## Base URL

```
https://api.appmass.com/v1
```

## Headers

| Header | Value | Required |
|--------|-------|----------|
| `Content-Type` | `application/json` | Yes |
| `Authorization` | `Bearer <session_token>` | For authenticated routes |
| `X-Appwrite-Project` | `<project_id>` | Yes |
| `X-Request-Id` | `<uuid>` | Recommended (idempotency) |

---

## Success Response

### Standard Wrapper

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

### With Pagination

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### Single Object

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "content": "Hello world",
    "createdAt": "2026-07-15T10:30:00.000Z"
  }
}
```

### Action Confirmation

```json
{
  "success": true,
  "data": {
    "message": "Post deleted successfully"
  }
}
```

---

## Error Response

### Standard Error Wrapper

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {}
  }
}
```

### Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body validation failed",
    "details": {
      "content": "Content must be between 1 and 500 characters",
      "media": "Each file must be a valid file ID"
    }
  }
}
```

### Authentication Error

```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

### Not Found Error

```json
{
  "success": false,
  "error": {
    "code": "POST_001",
    "message": "Post not found",
    "details": {
      "postId": "abc123"
    }
  }
}
```

### Rate Limit Error

```json
{
  "success": false,
  "error": {
    "code": "RATE_001",
    "message": "Too many requests",
    "details": {
      "retryAfter": 60
    }
  }
}
```

---

## Pagination

### Request Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 20 | Items per page (max 100) |
| `sort` | string | `createdAt` | Field to sort by |
| `order` | string | `desc` | Sort direction (`asc` | `desc`) |

### Response Meta

```json
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```

### Cursor Pagination (Messages)

Used for messaging to avoid offset drift.

| Param | Type | Description |
|-------|------|-------------|
| `before` | string (ISO date) | Get messages before this date |
| `after` | string (ISO date) | Get messages after this date |
| `limit` | integer | Items per page (max 50) |

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 100,
    "hasMore": true,
    "cursor": "2026-07-15T10:30:00.000Z"
  }
}
```

---

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthenticated |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 409 | Conflict (e.g., already following) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Idempotency

Mutations (POST, PUT, DELETE) accept an optional `Idempotency-Key` header. When provided, duplicate requests within 24 hours return the original response.

```json
{
  "success": true,
  "data": {},
  "meta": {
    "idempotent": true
  }
}
```
