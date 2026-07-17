# API Routes

## Authentication

### Create Email Account
- **Method:** POST
- **Path:** `/auth/email/create`
- **Auth:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "name": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "string",
      "sessionId": "string"
    }
  }
  ```
- **Appwrite SDK:** `account.create()` + `account.createEmailSession()`

### Email Login
- **Method:** POST
- **Path:** `/auth/email/login`
- **Auth:** No
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "string",
      "sessionId": "string"
    }
  }
  ```
- **Appwrite SDK:** `account.createEmailSession()`

### Send Phone Verification
- **Method:** POST
- **Path:** `/auth/phone/send`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "phone": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Verification code sent"
    }
  }
  ```
- **Appwrite SDK:** `account.createPhoneVerification()`

### Confirm Phone Verification
- **Method:** POST
- **Path:** `/auth/phone/confirm`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "userId": "string",
    "secret": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Phone verified"
    }
  }
  ```
- **Appwrite SDK:** `account.updatePhoneVerification()`

### OAuth Login
- **Method:** POST
- **Path:** `/auth/oauth/:provider`
- **Params:** `provider` = `google` | `apple` | `github`
- **Auth:** No
- **Request Body:**
  ```json
  {
    "successUrl": "string",
    "failureUrl": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "oauthUrl": "string"
    }
  }
  ```
- **Appwrite SDK:** `account.createOAuth2Session()`

### Logout
- **Method:** DELETE
- **Path:** `/auth/logout`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Logged out"
    }
  }
  ```
- **Appwrite SDK:** `account.deleteSession('current')`

### Get Current User
- **Method:** GET
- **Path:** `/auth/me`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "string",
      "email": "string",
      "name": "string",
      "avatar": "string",
      "roles": ["string"]
    }
  }
  ```
- **Appwrite SDK:** `account.get()`

---

## Profiles

### Get Profile
- **Method:** GET
- **Path:** `/users/:id`
- **Auth:** No (public profiles)
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "string",
      "displayName": "string",
      "username": "string",
      "bio": "string",
      "avatar": "string",
      "followersCount": "number",
      "followingCount": "number",
      "postCount": "number",
      "isVerified": "boolean",
      "createdAt": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.getDocument('profiles', documentId)`

### Update Profile
- **Method:** PUT
- **Path:** `/users/:id`
- **Auth:** Required (must match :id)
- **Request Body:**
  ```json
  {
    "displayName": "string",
    "bio": "string",
    "avatar": "string (fileId)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "userId": "string",
      "displayName": "string",
      "username": "string",
      "bio": "string",
      "avatar": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.updateDocument('profiles', documentId, data)`

### Get Followers
- **Method:** GET
- **Path:** `/users/:id/followers`
- **Auth:** No
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "userId": "string",
        "displayName": "string",
        "avatar": "string",
        "isFollowingBack": "boolean"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('follows', [queries])`

### Get Following
- **Method:** GET
- **Path:** `/users/:id/following`
- **Auth:** No
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "userId": "string",
        "displayName": "string",
        "avatar": "string",
        "isFollowingBack": "boolean"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('follows', [queries])`

### Follow User
- **Method:** POST
- **Path:** `/users/:id/follow`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Now following user"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('follows', data)`

### Unfollow User
- **Method:** DELETE
- **Path:** `/users/:id/unfollow`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Unfollowed user"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.deleteDocument('follows', documentId)`

---

## Posts

### Get Feed
- **Method:** GET
- **Path:** `/posts`
- **Auth:** Required
- **Query Params:** `type` (`for_you` | `following`), `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "author": {
          "userId": "string",
          "displayName": "string",
          "avatar": "string"
        },
        "content": "string",
        "media": ["string"],
        "likeCount": "number",
        "commentCount": "number",
        "repostCount": "number",
        "isLiked": "boolean",
        "isBookmarked": "boolean",
        "createdAt": "string"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('posts', [queries])`

### Get Post
- **Method:** GET
- **Path:** `/posts/:id`
- **Auth:** No
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "author": {
        "userId": "string",
        "displayName": "string",
        "avatar": "string"
      },
      "content": "string",
      "media": ["string"],
      "likeCount": "number",
      "commentCount": "number",
      "repostCount": "number",
      "isLiked": "boolean",
      "isBookmarked": "boolean",
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.getDocument('posts', documentId)`

### Create Post
- **Method:** POST
- **Path:** `/posts`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "content": "string (max 500 chars)",
    "media": ["string (fileIds)"]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "content": "string",
      "media": ["string"],
      "createdAt": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('posts', data)`

### Update Post
- **Method:** PUT
- **Path:** `/posts/:id`
- **Auth:** Required (must be author)
- **Request Body:**
  ```json
  {
    "content": "string (max 500 chars)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "content": "string",
      "updatedAt": "string"
    }
  }
  ```
- **Constraint:** Only editable within 24 hours of creation
- **Appwrite SDK (Function):** `databases.updateDocument('posts', documentId, data)`

### Delete Post
- **Method:** DELETE
- **Path:** `/posts/:id`
- **Auth:** Required (must be author or admin)
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Post deleted"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.deleteDocument('posts', documentId)`

### Get Likes
- **Method:** GET
- **Path:** `/posts/:id/likes`
- **Auth:** No
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "userId": "string",
        "displayName": "string",
        "avatar": "string"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('likes', [queries])`

### Like Post
- **Method:** POST
- **Path:** `/posts/:id/like`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Post liked"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('likes', data)`

### Unlike Post
- **Method:** DELETE
- **Path:** `/posts/:id/unlike`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Post unliked"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.deleteDocument('likes', documentId)`

### Get Comments
- **Method:** GET
- **Path:** `/posts/:id/comments`
- **Auth:** No
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "author": {
          "userId": "string",
          "displayName": "string",
          "avatar": "string"
        },
        "content": "string",
        "likeCount": "number",
        "createdAt": "string"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('comments', [queries])`

### Create Comment
- **Method:** POST
- **Path:** `/posts/:id/comments`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "content": "string (max 300 chars)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "content": "string",
      "createdAt": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('comments', data)`

### Repost
- **Method:** POST
- **Path:** `/posts/:id/repost`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "quote": "string (optional, max 500 chars)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "originalPostId": "string",
      "type": "repost",
      "createdAt": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('posts', data)`

### Bookmark Post
- **Method:** POST
- **Path:** `/posts/:id/bookmark`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Post bookmarked"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('bookmarks', data)`

### Remove Bookmark
- **Method:** DELETE
- **Path:** `/posts/:id/bookmark`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Bookmark removed"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.deleteDocument('bookmarks', documentId)`

---

## Stories

### Get Friends Stories
- **Method:** GET
- **Path:** `/stories`
- **Auth:** Required
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "author": {
          "userId": "string",
          "displayName": "string",
          "avatar": "string"
        },
        "media": "string",
        "viewCount": "number",
        "hasViewed": "boolean",
        "createdAt": "string",
        "expiresAt": "string"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('stories', [queries])`

### Create Story
- **Method:** POST
- **Path:** `/stories`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "media": "string (fileId)",
    "mediaType": "image | video"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "media": "string",
      "expiresAt": "string"
    }
  }
  ```
- **Note:** Auto-expires after 24 hours
- **Appwrite SDK (Function):** `databases.createDocument('stories', data)`

### Delete Story
- **Method:** DELETE
- **Path:** `/stories/:id`
- **Auth:** Required (must be author)
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Story deleted"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.deleteDocument('stories', documentId)`

### View Story
- **Method:** POST
- **Path:** `/stories/:id/view`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Story viewed"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('storyViews', data)`

---

## Messaging

### List Conversations
- **Method:** GET
- **Path:** `/conversations`
- **Auth:** Required
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "participants": ["string"],
        "lastMessage": {
          "content": "string",
          "senderId": "string",
          "createdAt": "string"
        },
        "unreadCount": "number",
        "updatedAt": "string"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('conversations', [queries])`

### Create Conversation
- **Method:** POST
- **Path:** `/conversations`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "participantId": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "participants": ["string"],
      "createdAt": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('conversations', data)`

### Send Message
- **Method:** POST
- **Path:** `/conversations/:id/messages`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "content": "string (encrypted)",
    "contentType": "text | image | video"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "content": "string",
      "createdAt": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('messages', data)`

### Get Messages
- **Method:** GET
- **Path:** `/conversations/:id/messages`
- **Auth:** Required
- **Query Params:** `page`, `limit`, `before` (cursor pagination)
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "senderId": "string",
        "content": "string (encrypted)",
        "contentType": "string",
        "createdAt": "string"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('messages', [queries])`

### Typing Indicator
- **Method:** Realtime (WebSocket)
- **Path:** (via Appwrite Realtime)
- **Channel:** `conversations/:id/typing`
- **Auth:** Required
- **Payload:**
  ```json
  {
    "userId": "string",
    "isTyping": "boolean"
  }
  ```
- **Appwrite SDK:** `client.subscribe('conversations.[id].typing')`

---

## Notifications

### Get Notifications
- **Method:** GET
- **Path:** `/notifications`
- **Auth:** Required
- **Query Params:** `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "type": "follow | like | comment | repost | mention",
        "actor": {
          "userId": "string",
          "displayName": "string",
          "avatar": "string"
        },
        "targetId": "string",
        "message": "string",
        "isRead": "boolean",
        "createdAt": "string"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('notifications', [queries])`

### Mark Notification Read
- **Method:** PUT
- **Path:** `/notifications/:id/read`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Notification marked as read"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.updateDocument('notifications', documentId, { isRead: true })`

### Mark All Notifications Read
- **Method:** PUT
- **Path:** `/notifications/read-all`
- **Auth:** Required
- **Request Body:** None
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "All notifications marked as read"
    }
  }
  ```
- **Appwrite SDK (Function):** Batch update `databases.updateDocument()` for all unread

---

## Admin / Moderation

### Create Report
- **Method:** POST
- **Path:** `/reports`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "targetType": "post | user | comment",
    "targetId": "string",
    "reason": "string",
    "details": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "status": "pending"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.createDocument('reports', data)`

### Get Reports (Admin)
- **Method:** GET
- **Path:** `/admin/reports`
- **Auth:** Required (moderator/admin)
- **Query Params:** `status` (`pending` | `resolved`), `page`, `limit`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "reporterId": "string",
        "targetType": "string",
        "targetId": "string",
        "reason": "string",
        "status": "string",
        "createdAt": "string"
      }
    ],
    "meta": { "total": "number", "page": "number", "limit": "number" }
  }
  ```
- **Appwrite SDK (Function):** `databases.listDocuments('reports', [queries])`

### Resolve Report
- **Method:** PUT
- **Path:** `/admin/reports/:id/resolve`
- **Auth:** Required (moderator/admin)
- **Request Body:**
  ```json
  {
    "action": "warn | delete_content | ban_user | dismiss",
    "notes": "string"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "status": "resolved",
      "action": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.updateDocument('reports', documentId, data)`

### Ban User
- **Method:** POST
- **Path:** `/admin/users/:id/ban`
- **Auth:** Required (admin only)
- **Request Body:**
  ```json
  {
    "reason": "string",
    "durationHours": "number"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "User banned",
      "userId": "string",
      "bannedUntil": "string"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.updateDocument('profiles', documentId, { banned: true, bannedUntil, banReason })`

### Verify User
- **Method:** POST
- **Path:** `/admin/users/:id/verify`
- **Auth:** Required (admin only)
- **Request Body:**
  ```json
  {
    "verified": "boolean"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "User verification status updated",
      "userId": "string",
      "isVerified": "boolean"
    }
  }
  ```
- **Appwrite SDK (Function):** `databases.updateDocument('profiles', documentId, { isVerified: verified })`
