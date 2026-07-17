# Database Schema

## Overview

Appmass uses **Appwrite Database** (PostgreSQL-backed document store) with 18 collections. Each document is a JSON object with automatic `$id`, `$createdAt`, `$updatedAt`, `$permissions` fields.

**Conventions:**
- `$id` is auto-generated as a UUID by default, or manually set for single-document collections
- Timestamps are ISO 8601 strings
- All collections have `read("any")` for public reads where applicable
- Write permissions are scoped to the authenticated user (`user:$userId`)
- Indexes are created on frequently queried fields

---

## 1. `profiles`

User profile data. One document per user, created on registration.

| Attribute      | Type     | Required | Default | Constraints                          |
|----------------|----------|----------|---------|--------------------------------------|
| userId         | string   | yes      | —       | Appwrite user `$id`; unique          |
| displayName    | string   | yes      | —       | 1–50 chars                           |
| username       | string   | yes      | —       | **Index (unique)**; alphanumeric + `_`; 3–30 chars |
| bio            | string   | no       | ""      | max 500 chars                        |
| avatarId       | string   | no       | null    | Appwrite Storage file ID             |
| coverImageId   | string   | no       | null    | Appwrite Storage file ID             |
| website        | string   | no       | null    | URL format                           |
| location       | string   | no       | null    | Free text                            |
| birthDate      | datetime | no       | null    | ISO 8601                             |
| isVerified     | boolean  | no       | false   | Admin-only update                    |
| isPrivate      | boolean  | no       | false   | Private profile toggle               |
| publicKey      | string   | no       | null    | Base64-encoded Curve25519 public key |
| createdAt      | datetime | yes      | now()   | Auto-set                             |

**Indexes:**
- `username` — unique index
- `userId` — key index

**Permissions:**
- Read: `any` (for public profiles); `user:$userId` for private fields
- Write: `user:$userId` (user edits own profile)

---

## 2. `posts`

User-created posts (text, images, polls).

| Attribute         | Type     | Required | Default | Constraints                        |
|-------------------|----------|----------|---------|------------------------------------|
| userId            | string   | yes      | —       | References `profiles.userId`       |
| content           | string   | yes      | —       | max 4000 chars                     |
| mediaIds[]        | string[] | no       | []      | Array of Storage file IDs          |
| hashtags[]        | string[] | no       | []      | Array of hashtag strings (w/o `#`) |
| mentionIds[]      | string[] | no       | []      | Array of profile userIds           |
| pollId            | string   | no       | null    | References `polls.$id`             |
| isCommentDisabled | boolean  | no       | false   |                                   |
| isRepostDisabled  | boolean  | no       | false   |                                   |
| createdAt         | datetime | yes      | now()   | Auto-set                          |
| updatedAt         | datetime | yes      | now()   | Auto-updated                      |

**Indexes:**
- `userId` + `createdAt` (desc) — feed queries
- `hashtags[*]` — hashtag lookup
- `createdAt` (desc) — global feed

---

## 3. `post_likes`

Tracks reactions on posts. One document per user-per-post combination.

| Attribute      | Type     | Required | Default | Constraints                          |
|----------------|----------|----------|---------|--------------------------------------|
| postId         | string   | yes      | —       | References `posts.$id`              |
| userId         | string   | yes      | —       | References `profiles.userId`        |
| reactionType   | enum     | no       | "like"  | `like`, `love`, `laugh`, `surprise`, `sad`, `angry` |
| createdAt      | datetime | yes      | now()   |                                     |

**Indexes:**
- `postId` + `userId` — unique compound (prevent duplicate likes)
- `postId` + `createdAt` — like list display

**Permissions:**
- Read: `any`
- Write: `user:$userId` (user likes/unlikes)

---

## 4. `post_comments`

Comments on posts. Supports nested replies via `parentCommentId`.

| Attribute        | Type     | Required | Default | Constraints                        |
|------------------|----------|----------|---------|------------------------------------|
| postId           | string   | yes      | —       | References `posts.$id`             |
| userId           | string   | yes      | —       | References `profiles.userId`       |
| content          | string   | yes      | —       | max 1000 chars                     |
| mediaIds[]       | string[] | no       | []      |                                    |
| parentCommentId  | string   | no       | null    | Self-reference for threading       |
| createdAt        | datetime | yes      | now()   |                                    |

**Indexes:**
- `postId` + `createdAt` — comment display
- `parentCommentId` — threaded view

---

## 5. `post_reposts`

Repost/quote-post records.

| Attribute    | Type     | Required | Default | Constraints                        |
|--------------|----------|----------|---------|------------------------------------|
| postId       | string   | yes      | —       | References `posts.$id`             |
| userId       | string   | yes      | —       | References `profiles.userId`       |
| quoteContent | string   | no       | null    | max 400 chars; null = plain repost |
| createdAt    | datetime | yes      | now()   |                                    |

**Indexes:**
- `postId` + `userId` — unique compound
- `userId` + `createdAt` — user's repost list

---

## 6. `polls`

Poll definitions attached to posts.

| Attribute | Type     | Required | Default | Constraints                        |
|-----------|----------|----------|---------|------------------------------------|
| postId    | string   | yes      | —       | References `posts.$id`             |
| question  | string   | yes      | —       | max 300 chars                      |
| options[] | string[] | yes      | —       | 2–10 options, each max 100 chars   |
| endsAt    | datetime | yes      | —       | ISO 8601                           |
| createdAt | datetime | yes      | now()   |                                    |

---

## 7. `poll_votes`

Individual votes in polls.

| Attribute   | Type     | Required | Default | Constraints                        |
|-------------|----------|----------|---------|------------------------------------|
| pollId      | string   | yes      | —       | References `polls.$id`             |
| userId      | string   | yes      | —       | References `profiles.userId`       |
| optionIndex | integer  | yes      | —       | 0-based index into `options[]`     |
| createdAt   | datetime | yes      | now()   |                                    |

**Indexes:**
- `pollId` + `userId` — unique compound (one vote per user per poll)

---

## 8. `follows`

Follow relationships between users.

| Attribute   | Type     | Required | Default | Constraints                        |
|-------------|----------|----------|---------|------------------------------------|
| followerId  | string   | yes      | —       | References `profiles.userId`       |
| followingId | string   | yes      | —       | References `profiles.userId`       |
| createdAt   | datetime | yes      | now()   |                                    |

**Indexes:**
- `followerId` + `followingId` — unique compound
- `followingId` + `createdAt` — follower list

---

## 9. `bookmarks`

Saved/bookmarked posts.

| Attribute | Type     | Required | Default | Constraints                        |
|-----------|----------|----------|---------|------------------------------------|
| postId    | string   | yes      | —       | References `posts.$id`             |
| userId    | string   | yes      | —       | References `profiles.userId`       |
| createdAt | datetime | yes      | now()   |                                    |

**Indexes:**
- `userId` + `createdAt` — user's bookmark list
- `userId` + `postId` — unique compound

---

## 10. `stories`

Temporary story posts that expire after 24 hours.

| Attribute  | Type     | Required | Default | Constraints                        |
|------------|----------|----------|---------|------------------------------------|
| userId     | string   | yes      | —       | References `profiles.userId`       |
| mediaIds[] | string[] | yes      | —       | 1–20 Storage file IDs              |
| caption    | string   | no       | ""      | max 200 chars                      |
| expiresAt  | datetime | yes      | now()+24h | Auto-calculated                  |
| createdAt  | datetime | yes      | now()   |                                    |

**Indexes:**
- `expiresAt` — scheduled deletion (Appwrite Function runs hourly)
- `userId` + `createdAt` — story display order

---

## 11. `story_views`

View tracking for stories.

| Attribute | Type     | Required | Default | Constraints                        |
|-----------|----------|----------|---------|------------------------------------|
| storyId   | string   | yes      | —       | References `stories.$id`           |
| userId    | string   | yes      | —       | References `profiles.userId`       |
| viewedAt  | datetime | yes      | now()   |                                    |

**Indexes:**
- `storyId` + `userId` — unique compound

---

## 12. `hashtags`

Hashtag aggregation and metadata.

| Attribute  | Type     | Required | Default | Constraints                          |
|------------|----------|----------|---------|--------------------------------------|
| tag        | string   | yes      | —       | **Index (unique)**; lowercase, no `#` |
| postCount  | integer  | no       | 0       | Updated via Function on post create  |
| lastUsedAt | datetime | yes      | now()   |                                      |

---

## 13. `notifications`

In-app notification records.

| Attribute   | Type     | Required | Default | Constraints                          |
|-------------|----------|----------|---------|--------------------------------------|
| userId      | string   | yes      | —       | Recipient - references `profiles.userId` |
| actorId     | string   | yes      | —       | Triggering user - references `profiles.userId` |
| type        | enum     | yes      | —       | `follow`, `like`, `comment`, `repost`, `mention`, `story_reply`, `message`, `call`, `campaign` |
| referenceId | string   | yes      | —       | ID of related resource (post, comment, etc.) |
| read        | boolean  | no       | false   |                                        |
| createdAt   | datetime | yes      | now()   |                                        |

**Indexes:**
- `userId` + `createdAt` (desc) — notification feed
- `userId` + `read` — unread count

---

## 14. `blocks`

User block records.

| Attribute | Type     | Required | Default | Constraints                        |
|-----------|----------|----------|---------|------------------------------------|
| blockerId | string   | yes      | —       | References `profiles.userId`       |
| blockedId | string   | yes      | —       | References `profiles.userId`       |
| createdAt | datetime | yes      | now()   |                                    |

**Indexes:**
- `blockerId` + `blockedId` — unique compound

---

## 15. `reports`

Content moderation reports.

| Attribute   | Type     | Required | Default | Constraints                          |
|-------------|----------|----------|---------|--------------------------------------|
| reporterId  | string   | yes      | —       | References `profiles.userId`         |
| targetType  | enum     | yes      | —       | `post`, `comment`, `profile`, `message`, `story` |
| targetId    | string   | yes      | —       | ID of reported resource              |
| reason      | string   | no       | ""      | Free text                            |
| status      | enum     | no       | "pending" | `pending`, `reviewed`, `dismissed`, `actioned` |
| createdAt   | datetime | yes      | now()   |                                      |

**Indexes:**
- `status` — moderation queue
- `createdAt` — FIFO processing

---

## 16. `ad_campaigns`

Sponsored content campaigns.

| Attribute  | Type     | Required | Default | Constraints                          |
|------------|----------|----------|---------|--------------------------------------|
| userId     | string   | yes      | —       | Advertiser - references `profiles.userId` |
| title      | string   | yes      | —       | Campaign name, max 100 chars         |
| content    | string   | yes      | —       | Ad copy, max 500 chars               |
| mediaIds[] | string[] | no       | []      | Ad creative assets                   |
| targetUrl  | string   | yes      | —       | Destination URL                      |
| budget     | float    | yes      | —       | Campaign budget in USD               |
| status     | enum     | no       | "draft" | `draft`, `pending_review`, `active`, `paused`, `completed`, `rejected` |
| startsAt   | datetime | yes      | —       | Campaign start                       |
| endsAt     | datetime | yes      | —       | Campaign end                         |
| createdAt  | datetime | yes      | now()   |                                      |

---

## Relationships Diagram

```
profiles 1---* posts
profiles 1---* post_likes
profiles 1---* post_comments
profiles 1---* post_reposts
profiles 1---* follows (as followerId)
profiles 1---* follows (as followingId)
profiles 1---* bookmarks
profiles 1---* stories
profiles 1---* notifications
profiles 1---* blocks (as blockerId)
profiles 1---* blocks (as blockedId)
profiles 1---* reports (as reporterId)
profiles 1---* ad_campaigns
posts    1---* post_likes
posts    1---* post_comments
posts    1---* post_reposts
posts    0..1 polls
polls    1---* poll_votes
stories  1---* story_views
```

## Migration Strategy

- Collection schemas are managed via Appwrite Console or a custom `scripts/apply-schema.js` script using the Appwrite Server SDK
- Indexes updated through console or SDK
- No traditional SQL migrations — Appwrite handles schema updates as additive changes
- Data cleanup: Appwrite Functions run hourly to delete expired stories
