# Error Codes & Meanings

## Authentication Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `AUTH_001` | 401 | Invalid credentials | Email/password combination is incorrect |
| `AUTH_002` | 401 | Session expired | JWT token has expired; client must re-authenticate |
| `AUTH_003` | 403 | Email not verified | Action requires verified email address |
| `AUTH_004` | 401 | Invalid token | OAuth token or verification code is invalid |
| `AUTH_005` | 409 | Account already exists | Email is already registered |
| `AUTH_006` | 403 | Account banned | User account has been suspended by admin |

## Post Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `POST_001` | 404 | Post not found | Post does not exist or has been deleted |
| `POST_002` | 403 | Cannot edit post after 24h | Edit window has expired |
| `POST_003` | 403 | Not authorized to modify this post | User is not the author or an admin |
| `POST_004` | 400 | Content exceeds max length | Post content exceeds 500 character limit |
| `POST_005` | 400 | Cannot repost own content | Users cannot repost their own posts |
| `POST_006` | 409 | Already liked | User has already liked this post |

## User Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `USER_001` | 404 | User not found | User profile does not exist |
| `USER_002` | 409 | Already following | User is already in your following list |
| `USER_003` | 409 | Not following | Cannot unfollow a user you don't follow |
| `USER_004` | 403 | Cannot follow yourself | Users cannot follow their own account |
| `USER_005` | 404 | Profile not found | Profile document does not exist |

## Messaging Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `MSG_001` | 403 | Cannot send message to blocked user | Recipient has blocked the sender |
| `MSG_002` | 404 | Conversation not found | Conversation does not exist |
| `MSG_003` | 403 | Not a participant | User is not a member of this conversation |
| `MSG_004` | 400 | Message too long | Message exceeds character limit |
| `MSG_005` | 403 | Cannot message self | Conversations must have different participants |

## File Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `FILE_001` | 413 | File too large | Upload exceeds maximum file size (10MB for images, 50MB for video) |
| `FILE_002` | 415 | Unsupported file type | File format is not accepted |
| `FILE_003` | 500 | Upload failed | File could not be processed by storage service |
| `FILE_004` | 404 | File not found | Referenced file does not exist |

## Rate Limit Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `RATE_001` | 429 | Too many requests | Rate limit exceeded; check `Retry-After` header |
| `RATE_002` | 429 | Auth rate limit exceeded | Too many authentication attempts |

## Moderation Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `MOD_001` | 403 | Insufficient permissions | User does not hold required role |
| `MOD_002` | 400 | Report already resolved | Report has already been actioned |
| `MOD_003` | 404 | Report not found | Report does not exist |
| `MOD_004` | 400 | Invalid moderation action | Specified action is not recognized |

## Validation Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `VAL_001` | 400 | Validation failed | One or more fields failed validation |
| `VAL_002` | 400 | Missing required field | A required field was not provided |
| `VAL_003` | 400 | Invalid format | Field value does not match expected format |
| `VAL_004` | 400 | Invalid ID | Resource ID format is invalid |

## Server Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `SRV_001` | 500 | Internal server error | An unexpected error occurred |
| `SRV_002` | 503 | Service unavailable | Backend service is temporarily unavailable |
| `SRV_003` | 502 | Bad gateway | Upstream service returned an error |

---

## Error Response Shape

```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid email or password",
    "details": {
      "field": "email",
      "attemptsRemaining": 3,
      "retryAfter": 60
    }
  }
}
```

The `details` object is optional and may contain additional context depending on the error type.
