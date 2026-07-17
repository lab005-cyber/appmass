# Appwrite Permission Model

## Overview

Appmass uses Appwrite's built-in permission system to control access at three levels:

1. **Collection-level permissions** — Who can perform CRUD on the collection
2. **Document-level permissions** — Who can read/write individual documents
3. **File storage permissions** — Who can upload/download files

---

## Permission Types in Appwrite

| Permission Type | Value | Description |
|----------------|-------|-------------|
| `read` | `"string"` | Ability to read the resource |
| `write` | `"string"` | Ability to create/update/delete the resource |
| `create` | `"string"` | Ability to create documents (collection-level) |
| `update` | `"string"` | Ability to update an existing document |
| `delete` | `"string"` | Ability to delete a document |

### Permission Roles

| Role String | Description |
|-------------|-------------|
| `*` | Any user (including guests) |
| `role:all` | Any authenticated user |
| `role:guest` | Unauthenticated users only |
| `role:member` | Authenticated users with a session |
| `user:{userId}` | Specific user |
| `team:{teamId}` | Members of a specific Appwrite team |
| `team:{teamId}/{role}` | Team members with a specific team role |

---

## Collection-Level Permissions

### `profiles`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `user:{userId}` (created on signup) |
| `read` | `*` (public profiles), `role:member` (private fields) |
| `update` | `user:{ownerId}`, `team:admins` |
| `delete` | `team:admins` |

### `posts`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `*` (public posts), `role:member` (private/blocked) |
| `update` | `user:{authorId}` (within 24h), `team:moderators`, `team:admins` |
| `delete` | `user:{authorId}`, `team:moderators`, `team:admins` |

### `comments`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `*` |
| `update` | `user:{authorId}` |
| `delete` | `user:{authorId}`, `team:moderators`, `team:admins` |

### `likes`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `*` |
| `update` | None (likes are immutable) |
| `delete` | `user:{ownerId}` |

### `follows`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `*` |
| `update` | None (follows are immutable) |
| `delete` | `user:{ownerId}` |

### `stories`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `role:member` (friends only enforced via query) |
| `update` | `user:{authorId}` |
| `delete` | `user:{authorId}`, `team:moderators`, `team:admins` |

### `storyViews`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `user:{storyAuthorId}` |
| `update` | None (views are immutable) |
| `delete` | None (never deleted, auto-purged) |

### `conversations`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `user:{participantId}` |
| `update` | `user:{participantId}` |
| `delete` | `user:{participantId}`, `team:admins` |

### `messages`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `user:{senderId}` |
| `read` | `user:{conversationParticipantId}` |
| `update` | None (messages are immutable) |
| `delete` | `user:{senderId}` (within 1 hour), `team:admins` |

### `bookmarks`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `user:{ownerId}` |
| `update` | None (bookmarks toggle, not update) |
| `delete` | `user:{ownerId}` |

### `notifications`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:all` (system-created) |
| `read` | `user:{targetUserId}` |
| `update` | `user:{targetUserId}` (mark as read) |
| `delete` | `team:admins` (auto-purge after 90 days) |

### `reports`

| Permission | Allowed Roles |
|------------|---------------|
| `create` | `role:member` |
| `read` | `team:moderators`, `team:admins` |
| `update` | `team:moderators`, `team:admins` |
| `delete` | `team:admins` |

---

## Document-Level Permissions

Document-level permissions override collection defaults. Set on create for each document.

### Example: Creating a Post

```javascript
const post = await databases.createDocument(
  'posts',
  'unique()',
  {
    authorId: userId,
    content: 'Hello world',
  },
  [
    // Read: anyone
    Permission.read(Role.any()),
    // Write: author + moderators + admins
    Permission.update(Role.user(userId)),
    Permission.update(Role.team('moderators')),
    Permission.update(Role.team('admins')),
    Permission.delete(Role.user(userId)),
    Permission.delete(Role.team('moderators')),
    Permission.delete(Role.team('admins')),
  ]
);
```

### Example: Creating a Private Post

```javascript
const privatePost = await databases.createDocument(
  'posts',
  'unique()',
  {
    authorId: userId,
    content: 'Private thought',
    visibility: 'private',
  },
  [
    // Read: only author
    Permission.read(Role.user(userId)),
    // Write: author only
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ]
);
```

### Example: Messaging Permissions

Conversation documents use dynamic participant permissions:

```javascript
const conversation = await databases.createDocument(
  'conversations',
  'unique()',
  { participants: [userId1, userId2] },
  [
    Permission.read(Role.user(userId1)),
    Permission.read(Role.user(userId2)),
    Permission.update(Role.user(userId1)),
    Permission.update(Role.user(userId2)),
    Permission.delete(Role.user(userId1)),
    Permission.delete(Role.user(userId2)),
  ]
);
```

---

## File Storage Permissions

### Bucket-Level

| Bucket | Read | Create | Write | Delete |
|--------|------|--------|-------|--------|
| `avatars` | `*` | `role:member` | `user:{ownerId}` | `user:{ownerId}`, `team:admins` |
| `post-media` | `*` | `role:member` | `user:{ownerId}` | `user:{ownerId}`, `team:moderators`, `team:admins` |
| `story-media` | `role:member` | `role:member` | `user:{ownerId}` | `user:{ownerId}`, `team:admins` |
| `message-attachments` | `user:{participantId}` | `role:member` | `user:{ownerId}` | `user:{ownerId}`, `team:admins` |

### File Upload Example

```javascript
const file = await storage.createFile(
  'post-media',     // bucketId
  'unique()',       // fileId
  fileInput,        // File
  [
    Permission.read(Role.any()),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
    Permission.delete(Role.team('moderators')),
    Permission.delete(Role.team('admins')),
  ]
);
```

---

## Custom Function Permissions

Appwrite Functions handle business logic that cannot be expressed with declarative permissions alone.

### Function Access Control

| Function | Trigger | Auth Check |
|----------|---------|------------|
| `create-post` | HTTP (POST /posts) | Verifies session, validates content, enforces 24h rules |
| `delete-post` | HTTP (DELETE /posts/:id) | Checks ownership + role |
| `send-message` | HTTP (POST /conversations/:id/messages) | Verifies participant, checks block list |
| `resolve-report` | HTTP (PUT /admin/reports/:id/resolve) | Requires moderator/admin team membership |
| `ban-user` | HTTP (POST /admin/users/:id/ban) | Requires admin team membership |
| `create-follow` | HTTP (POST /users/:id/follow) | Checks not self-following, not already following |

### Function Permission Pattern

```javascript
export default async function ({ req, res, log, databases, account }) {
  // 1. Verify authentication
  const user = await account.get();

  // 2. Check role (for admin functions)
  const memberships = await account.listMemberships();
  const isAdmin = memberships.teams.some(t => t.$id === 'admins');

  // 3. Execute business logic
  if (req.method === 'POST' && req.path === '/posts') {
    // Validate body
    // Create document
    // Return response
  }

  return res.json({ success: false, error: { code: 'MOD_001', message: 'Forbidden' } }, 403);
}
```

---

## Permission Matrix Summary

| Collection | Guest | User | Moderator | Admin |
|------------|-------|------|-----------|-------|
| profiles | R | R, W (own) | R, W (own) | R, W, D |
| posts | R | R, C, W/D (own) | R, C, W/D (own), D (any) | R, C, W, D |
| comments | R | R, C, D (own) | R, C, D (own), D (any) | R, C, W, D |
| likes | R | R, C, D (own) | R, C, D (own) | R, C, D |
| follows | R | R, C, D (own) | R, C, D (own) | R, C, D |
| stories | - | R, C, D (own) | R, C, D (own), R (any) | R, C, W, D |
| conversations | - | R, C, W, D (own) | R, C, W, D (own) | R, W, D |
| messages | - | C, R (own convos) | C, R (own), R (audit) | R, W, D |
| notifications | - | R, W (own) | R, W (own) | R, W, D |
| reports | - | C | R, W | R, W, D |
| files (avatars) | R | C, W/D (own) | C, W/D (own) | R, W, D |
| files (post-media) | R | C, W/D (own) | C, W/D (own), D (any) | R, W, D |
| files (messages) | - | C (own), R (own) | C (own), R (own+audit) | R, W, D |

**Legend:** R=Read, C=Create, W=Update, D=Delete, `own` = own content only
