# Appwrite Cloud Setup Guide — appmass

## Step 1: Create Appwrite Cloud Account

1. Go to **[cloud.appwrite.io](https://cloud.appwrite.io)**
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up using:
   - GitHub (recommended — fastest)
   - Google
   - Email + password
4. After signing in, you'll land on the **Appwrite Console** dashboard

---

## Step 2: Create Your Project

1. Click **"Create Project"** (blue button, top right)
2. Enter **Project Name**: `appmass`
3. Select **Region**: `Asia Pacific (apac-1)` ← this matches our plan
4. Click **"Create"**
5. After creation, you'll see your **Project ID** — copy it somewhere safe
   - Looks like: `66f8a1b2c3d4e5f6g7h8`
   - You'll need this for `.env.local`

---

## Step 3: Set Up Authentication

### 3a. Email/Password Auth

1. In left sidebar, click **"Auth"** → **"Settings"**
2. Under **"Auth Providers"**, find **Email / Password**
3. Toggle it **ON**
4. Set **"Password Strength"** to at least `8 characters`
5. Set **"Max Password Length"** to `128`
6. Set **"Default Session Duration"** to `365 days`
7. Click **"Update"**

### 3b. Phone Auth (SMS)

1. In Auth → Settings → Auth Providers, find **Phone**
2. Toggle **ON**
3. Add an SMS provider (Twilio or Vonage) — needs a paid account
4. Or skip this for now and enable it later

### 3c. Google OAuth

1. In Auth → Settings → Auth Providers, find **Google**
2. Toggle **ON**
3. Go to [console.cloud.google.com](https://console.cloud.google.com)
4. Create a new project → "APIs & Services" → "Credentials"
5. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
6. Application type: **"Web application"**
7. Name: `appmass`
8. Authorized redirect URIs: Add the URI shown in Appwrite (it's under the Google toggle)
   - Format: `https://cloud.appwrite.io/auth/oauth/callback/{project-id}`
9. Click **"Create"** → copy **Client ID** and **Client Secret**
10. Paste them into Appwrite's Google provider fields
11. Click **"Update"**

### 3d. Apple OAuth

1. (Requires Apple Developer account — $99/year)
2. In Auth → Settings → Auth Providers, find **Apple**
3. Follow the redirect URI instructions same as Google

### 3e. GitHub OAuth (optional)

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Application name: `appmass`
4. Homepage URL: `https://appmass.com` (your domain)
5. Authorization callback URL: The URI shown in Appwrite
6. Copy Client ID + Secret into Appwrite

---

## Step 4: Create Database

### 4a. Create Database

1. In left sidebar, click **"Databases"**
2. Click **"Create Database"**
3. Database name: `appmass_main`
4. Click **"Create"**
5. Note the **Database ID** (e.g., `66f8b2c3d4e5f6g7h8i9`)

### 4b. Create Collections

Create each collection listed below. For each one:

1. Inside your database, click **"Create Collection"**
2. Enter **Collection Name** and **Collection ID** (use snake_case IDs)
3. Click **"Create"**
4. Go to **"Attributes"** tab → **"Add Attribute"** → add all fields
5. Go to **"Indexes"** tab → **"Create Index"** → add indexes
6. Go to **"Permissions"** tab → set read/write rules

#### Collection 1: `profiles`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| userId | string | yes | Auth user ID |
| displayName | string | yes | |
| username | string | yes | Index: unique |
| bio | string | no | |
| avatarId | string | no | Storage file ID |
| coverImageId | string | no | Storage file ID |
| website | string | no | |
| location | string | no | |
| isVerified | boolean | no | Default: false |
| isPrivate | boolean | no | Default: false |
| createdAt | string | yes | ISO date |

**Indexes:**
- `username` (unique)
- `userId` (key)

**Permissions:**
- Read: `role:all`
- Write: `user:{userId}` (document level)

#### Collection 2: `posts`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| userId | string | yes | |
| content | string | yes | |
| mediaIds | string[] | no | Array of storage file IDs |
| hashtags | string[] | no | |
| mentionIds | string[] | no | |
| isCommentDisabled | boolean | no | Default: false |
| isRepostDisabled | boolean | no | Default: false |
| createdAt | string | yes | |
| updatedAt | string | yes | |

**Indexes:**
- `userId` (key)
- `createdAt` (key, descending)
- `hashtags` (fulltext — if available)

#### Collection 3: `post_likes`

| Attribute | Type | Required |
|-----------|------|----------|
| postId | string | yes |
| userId | string | yes |
| reactionType | string | yes |
| createdAt | string | yes |

**Indexes:**
- `postId` (key)
- Combined: `postId` + `userId` (unique)

#### Collection 4: `post_comments`

| Attribute | Type | Required |
|-----------|------|----------|
| postId | string | yes |
| userId | string | yes |
| content | string | yes |
| mediaIds | string[] | no |
| parentCommentId | string | no |
| createdAt | string | yes |

**Index:**
- `postId` (key)
- `createdAt` (key, ascending)

#### Collection 5: `post_reposts`

| Attribute | Type | Required |
|-----------|------|----------|
| postId | string | yes |
| userId | string | yes |
| quoteContent | string | no |
| createdAt | string | yes |

**Index:**
- `postId` (key)

#### Collection 6: `follows`

| Attribute | Type | Required |
|-----------|------|----------|
| followerId | string | yes |
| followingId | string | yes |
| createdAt | string | yes |

**Indexes:**
- `followerId` (key)
- `followingId` (key)
- Combined: `followerId` + `followingId` (unique)

#### Collection 7: `notifications`

| Attribute | Type | Required |
|-----------|------|----------|
| userId | string | yes |
| actorId | string | yes |
| type | string | yes |
| referenceId | string | yes |
| read | boolean | yes |
| createdAt | string | yes |

**Index:**
- `userId` + `read` (key)

#### Collection 8: `hashtags`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| tag | string | yes | Unique |
| postCount | number | yes | Default: 1 |
| lastUsedAt | string | yes | |

**Indexes:**
- `tag` (unique)

#### Collection 9: `bookmarks`

| Attribute | Type | Required |
|-----------|------|----------|
| postId | string | yes |
| userId | string | yes |
| createdAt | string | yes |

**Index:**
- `userId` (key)
- Combined: `userId` + `postId` (unique)

#### Collection 10: `stories`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| userId | string | yes | |
| mediaIds | string[] | yes | |
| caption | string | no | |
| expiresAt | string | yes | ISO date (24h from creation) |
| createdAt | string | yes | |

**Index:**
- `userId` (key)
- `expiresAt` (key)

#### Collection 11: `reports`

| Attribute | Type | Required |
|-----------|------|----------|
| reporterId | string | yes |
| targetType | string | yes |
| targetId | string | yes |
| reason | string | yes |
| status | string | yes |
| createdAt | string | yes |

**Index:**
- `status` (key)

---

## Step 5: Create Storage Buckets

1. In left sidebar, click **"Storage"**
2. Click **"Create Bucket"**

### Bucket 1: `media` (for all uploads)

| Setting | Value |
|---------|-------|
| Bucket name | Media |
| Bucket ID | `media` |
| Maximum file size | `50` MB |
| Allowed file extensions | `jpg`, `jpeg`, `png`, `gif`, `webp`, `mp4`, `mov`, `mp3`, `ogg`, `pdf` |
| Encryption | Enabled |
| Permissions (read) | `role:all` |
| Permissions (write) | `role:user` |

### Bucket 2: `avatars` (for profile pics)

| Setting | Value |
|---------|-------|
| Bucket name | Avatars |
| Bucket ID | `avatars` |
| Maximum file size | `5` MB |
| Allowed file extensions | `jpg`, `jpeg`, `png`, `webp` |
| Permissions (read) | `role:all` |
| Permissions (write) | `role:user` |

---

## Step 6: Enable Messaging Service

1. In left sidebar, click **"Messaging"**
2. Click **"Get Started"**
3. Messaging is now enabled for the project
4. appmass uses Appwrite's built-in Messaging for:
   - Direct messages (1-on-1 conversations)
   - Group chats
   - Channels
   - Typing indicators (via Realtime)
   - Read receipts

---

## Step 7: Enable Realtime

1. Realtime is **enabled by default** for all Appwrite projects
2. No additional setup needed
3. The client SDK will subscribe to channels like:
   - `databases.{dbId}.collections.{collectionId}.documents`
   - `conversations.{conversationId}.messages`

---

## Step 8: Get API Credentials

Go to **Settings** (gear icon in bottom left of sidebar):

1. **Project ID** — Copy this
2. **API Keys** section → Click **"Create API Key"**
   - Name: `appmass-server`
   - Scopes: Select all (or at minimum: `auth.read`, `database.read`, `database.write`, `storage.read`, `storage.write`, `messaging.read`, `messaging.write`)
   - Click **"Create"**
   - Copy the **secret key** (shown only once!)
3. **Database ID** — Go back to Databases → click on `appmass_main` → copy the ID from the URL or the top of the page

---

## Step 9: Fill .env.local

Open `C:\Users\student\Documents\appmass\.env.local` and fill in:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=66f8a1b2c3d4e5f6g7h8   ← your project ID
EXPO_PUBLIC_APPWRITE_API_KEY=standard_abcdef123456...    ← your API key
EXPO_PUBLIC_APPWRITE_DATABASE_ID=66f8b2c3d4e5f6g7h8i9   ← your database ID
EXPO_PUBLIC_APP_NAME=appmass
EXPO_PUBLIC_PRIMARY_COLOR=#f4f3ee
EXPO_PUBLIC_ACCENT_COLOR=#c15f3c
```

---

## Step 10: Verify Setup

### Quick Test

1. Run the app: `npx expo start`
2. Try signing up with email/password
3. Check Appwrite Console → Auth → Users → you should see the new user
4. Try creating a post → check Database → `posts` collection → document should appear

### Common Issues

| Issue | Fix |
|-------|-----|
| "Project not found" | Check your Project ID in `.env.local` |
| "Unauthorized" | Check API key scopes in Appwrite Console |
| "Database not found" | Check Database ID |
| "Collection not found" | Make sure collection IDs match the code |
| "File too large" | Increase max file size in Storage bucket settings |
| "Auth provider not enabled" | Go to Auth → Settings → toggle the provider ON |

---

## Environment Variables Reference

```env
# Required
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=<from Appwrite Console>
EXPO_PUBLIC_APPWRITE_DATABASE_ID=<from Appwrite Console>

# Optional (for specific features)
EXPO_PUBLIC_APPWRITE_API_KEY=<needed for server-side operations>
EXPO_PUBLIC_ADMOB_APP_ID=<for banner ads>
EXPO_PUBLIC_AGORA_APP_ID=<for voice calls>
```

---

**Need help?** Check the [Appwrite Docs](https://appwrite.io/docs) or the [Appwrite Discord](https://discord.gg/appwrite).
