# API Documentation

## Base Configuration

```
Appwrite Endpoint: https://cloud.appwrite.io/v1
Appwrite Project ID: <configured in app.json / .env>
Region: Asia Pacific (apac-1)
```

## Appwrite SDK Client-Side API Usage

### Initialization

```typescript
// src/lib/appwrite.ts
import { Client, Account, Databases, Storage, Functions, Realtime } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export { client, Realtime };
```

### Authentication Endpoints

All auth operations use the `account` SDK methods directly from the client.

| Method                      | SDK Call                          | Description                  |
|-----------------------------|-----------------------------------|------------------------------|
| Register (email)            | `account.create()`                | Create user account          |
| Login (email)               | `account.createEmailSession()`    | Create email session         |
| Login (OAuth)               | `account.createOAuth2Session()`   | OAuth redirect flow          |
| Login (magic URL)           | `account.createMagicURLSession()` | Magic link flow              |
| Get current user            | `account.get()`                   | Validate + get session user  |
| Update name                 | `account.updateName()`            | Update display name          |
| Update email                | `account.updateEmail()`           | Requires password            |
| Update password             | `account.updatePassword()`        | Current + new password       |
| Delete session              | `account.deleteSession()`         | Logout                       |
| Delete all sessions         | `account.deleteSessions()`        | Logout all devices           |
| Create JWT                  | `account.createJWT()`             | Custom JWT for Functions     |

### Database Endpoints

```typescript
const DATABASE_ID = 'appmass_main';
const COLLECTIONS = {
  PROFILES: 'profiles',
  POSTS: 'posts',
  POST_LIKES: 'post_likes',
  POST_COMMENTS: 'post_comments',
  POST_REPOSTS: 'post_reposts',
  POLLS: 'polls',
  POLL_VOTES: 'poll_votes',
  FOLLOWS: 'follows',
  BOOKMARKS: 'bookmarks',
  STORIES: 'stories',
  STORY_VIEWS: 'story_views',
  HASHTAGS: 'hashtags',
  NOTIFICATIONS: 'notifications',
  BLOCKS: 'blocks',
  REPORTS: 'reports',
  AD_CAMPAIGNS: 'ad_campaigns',
};
```

#### Common Query Patterns

```typescript
// List posts for feed (paginated)
const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.POSTS, [
  Query.orderDesc('createdAt'),
  Query.limit(20),
  Query.offset(0),
]);

// Get single post by ID
const post = await databases.getDocument(DATABASE_ID, COLLECTIONS.POSTS, postId);

// Create post
const newPost = await databases.createDocument(
  DATABASE_ID,
  COLLECTIONS.POSTS,
  ID.unique(),
  { userId, content, mediaIds, hashtags }
);

// Update post
await databases.updateDocument(DATABASE_ID, COLLECTIONS.POSTS, postId, {
  content: updatedContent,
});

// Delete post
await databases.deleteDocument(DATABASE_ID, COLLECTIONS.POSTS, postId);

// Query with relationships (manual join in service layer)
```

**Important:** Appwrite Database does not support SQL JOINs. All relationship joins are performed client-side in service wrappers.

### Storage Endpoints

```typescript
const BUCKET_ID = {
  AVATARS: 'avatars',
  POST_MEDIA: 'post_media',
  STORY_MEDIA: 'story_media',
  COVERS: 'covers',
  AD_ASSETS: 'ad_assets',
};

// Upload file
const file = await storage.createFile(
  BUCKET_ID.POST_MEDIA,
  ID.unique(),
  selectedFile  // File object from expo-image-picker
);

// Get file preview URL
const previewUrl = storage.getFilePreview(BUCKET_ID.POST_MEDIA, fileId, {
  width: 600,
  height: 600,
});

// Get file download URL
const downloadUrl = storage.getFileDownload(BUCKET_ID.POST_MEDIA, fileId);

// Delete file
await storage.deleteFile(BUCKET_ID.POST_MEDIA, fileId);
```

## Custom Appwrite Functions Endpoints

Functions are deployed as Node.js 18 serverless functions. They act as internal API endpoints for operations requiring server-side logic.

### Function: `check-username-availability`

| Property     | Value                              |
|-------------|------------------------------------|
| Method      | `POST`                             |
| Auth        | JWT (authenticated user)           |
| Input       | `{ username: string }`             |
| Output      | `{ available: boolean, suggestions?: string[] }` |
| Description | Validates username uniqueness across profiles collection |

### Function: `generate-presigned-url`

| Property     | Value                              |
|-------------|------------------------------------|
| Method      | `POST`                             |
| Auth        | JWT (authenticated user)           |
| Input       | `{ bucketId: string, fileName: string }` |
| Output      | `{ url: string, fileId: string }`  |
| Description | Generates direct-upload URL for large files (videos > 10MB) |

### Function: `cleanup-expired-stories`

| Property     | Value                              |
|-------------|------------------------------------|
| Type        | Scheduled (cron) — every 60 min    |
| Description | Queries stories with `expiresAt < now()`, deletes from DB and Storage |

### Function: `create-push-notification`

| Property     | Value                              |
|-------------|------------------------------------|
| Method      | `POST`                             |
| Auth        | JWT (authenticated user/server)    |
| Input       | `{ userId: string, title: string, body: string, data: object }` |
| Output      | `{ success: boolean, messageId?: string }` |
| Description | Sends push via Appwrite Messaging (APNs/FCM) |

### Function: `process-report`

| Property     | Value                              |
|-------------|------------------------------------|
| Method      | `POST`                             |
| Auth        | Admin role only (Teams check)      |
| Input       | `{ reportId: string, action: 'dismiss' | 'warn' | 'suspend' | 'delete' }` |
| Output      | `{ success: boolean }`             |
| Description | Moderator action on a user report. Deletes content, suspends users |

### Function: `search-hashtags`

| Property     | Value                              |
|-------------|------------------------------------|
| Method      | `GET`                              |
| Auth        | None (public)                      |
| Input       | Query params: `?q=tech&limit=10`   |
| Output      | `{ results: { tag, postCount }[] }`|
| Description | Fuzzy search on hashtags collection |

## WebSocket / Realtime Subscriptions

### Connection Lifecycle

```typescript
import { Client } from 'appwrite';

// Client is already initialized with endpoint + project
// Realtime is enabled by default on the client instance

// Subscribe to channels
const unsubscribe = client.subscribe(
  [
    `databases.${DATABASE_ID}.collections.posts.documents`,
    `databases.${DATABASE_ID}.collections.notifications.documents`,
    'messaging.push',
    'calls',
  ],
  (response) => {
    const { event, payload, channels, timestamp } = response;
    // Handle event
  }
);

// Unsubscribe when leaving screen
unsubscribe();
```

### Available Channels

| Channel Pattern                                   | Purpose                           |
|---------------------------------------------------|-----------------------------------|
| `databases.{dbId}.collections.posts.documents`    | New posts (feed updates)          |
| `databases.{dbId}.collections.post_likes.documents` | Like/unlike events               |
| `databases.{dbId}.collections.post_comments.documents` | New comments                    |
| `databases.{dbId}.collections.notifications.documents`| Real-time notifications         |
| `databases.{dbId}.collections.messages.documents` | New direct messages               |
| `messaging.push`                                  | Push notification status          |
| `calls`                                           | Voice call signaling              |

### Event Types

| Event Pattern                              | Description                          |
|--------------------------------------------|--------------------------------------|
| `database.documents.create`                | Document created                     |
| `database.documents.update`                | Document updated                     |
| `database.documents.delete`                | Document deleted                     |
| `messaging.push.create`                    | Push sent                            |
| `messaging.push.failure`                   | Push delivery failure                |
| `users.*`                                  | User status changes (coming soon)    |

### Subscription Scoping

Subscribe to specific document updates by ID:

```typescript
// Subscribe to changes on a specific post
client.subscribe(
  `databases.${DATABASE_ID}.collections.posts.documents.${postId}`,
  (response) => { /* only this post */ }
);
```

## Request/Response Formats

### Standard Response Envelope

```typescript
// Success
{
  "$id": "abc123",
  "$createdAt": "2025-01-15T10:30:00.000+00:00",
  "$updatedAt": "2025-01-15T10:30:00.000+00:00",
  "$permissions": ["read(\"any\")", "write(\"user:abc123\")"],
  // ... document attributes
}

// List response
{
  "total": 42,
  "documents": [ /* ... */ ]
}

// Error (Client-side SDK throws AppwriteException)
{
  "type": "general_error",
  "message": "Document with the requested ID already exists",
  "code": 409,
  "version": "1.5.x"
}
```

### Service Layer Wrapper Pattern

```typescript
// src/services/posts.ts
export const getFeedPosts = async (limit = 20, offset = 0): Promise<Post[]> => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.POSTS, [
      Query.orderDesc('createdAt'),
      Query.limit(limit),
      Query.offset(offset),
    ]);

    // Enrich with user profiles and like status
    const enriched = await Promise.all(
      response.documents.map(enrichPost)
    );

    return enriched;
  } catch (error) {
    if (error instanceof AppwriteException) {
      if (error.code === 429) {
        // Rate limited — retry after delay
        await delay(1000);
        return getFeedPosts(limit, offset);
      }
    }
    throw error;
  }
};
```

## Rate Limiting

Appwrite Cloud applies rate limits at the project level:

| Limit Type           | Default Rate     | Scope          |
|----------------------|------------------|----------------|
| Requests per IP      | 60 req/min       | Per IP address |
| Auth creation        | 10 req/min       | Per IP address |
| Database writes      | 120 req/min      | Per project    |
| Database reads       | 300 req/min      | Per project    |
| Storage uploads      | 20 req/min       | Per project    |
| Storage downloads    | 100 req/min      | Per project    |
| Realtime connections | 200 concurrent   | Per project    |
| Functions execution  | 50 req/min       | Per project    |

### Client-Side Rate Limit Handling

```typescript
import { AppwriteException } from 'appwrite';

export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 429) {
        if (attempt === maxRetries) throw error;
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 500;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Unreachable');
};
```

## Error Codes

| Code | HTTP Status | Meaning                              |
|------|-------------|--------------------------------------|
| 400  | Bad Request | Invalid payload or validation error  |
| 401  | Unauthorized| Missing or invalid session/JWT       |
| 403  | Forbidden   | Insufficient permissions             |
| 404  | Not Found   | Resource does not exist              |
| 409  | Conflict    | Duplicate (e.g., unique constraint)  |
| 429  | Too Many    | Rate limit exceeded                  |
| 500  | Server      | Appwrite internal error              |
