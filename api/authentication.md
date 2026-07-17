# Authentication Documentation

## Overview

Appmass uses **Appwrite Authentication** as the primary auth provider. All authentication is handled client-side via the Appwrite Web SDK, with custom Appwrite Functions used for role enforcement and validation.

---

## Appwrite Auth Setup

### Project Configuration

1. Create an Appwrite project
2. Enable authentication methods:
   - Email/Password
   - Phone (SMS)
   - OAuth2: Google, Apple, GitHub
3. Configure OAuth credentials in Appwrite Console
4. Set up custom SMTP provider for email verification

### Client SDK Initialization

```javascript
import { Client, Account } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
```

---

## Session Management

### Session Creation

Sessions are created using Appwrite's session-based authentication:

| Method | SDK Call | Description |
|--------|----------|-------------|
| Email Sign Up | `account.create()` + `account.createEmailSession()` | Creates account and session |
| Email Login | `account.createEmailSession()` | Returns session token |
| OAuth | `account.createOAuth2Session()` | Redirect-based OAuth flow |
| Anonymous | `account.createAnonymousSession()` | Guest access |

### JWT Tokens

Appwrite uses session tokens (not standard JWTs). The token is:

- Stored as an HTTP-only cookie by default
- Accessible via `account.getSession('current')`
- Configurable expiration (default: 1 year, suggested: 30 days)

```javascript
// Get current session
const session = await account.getSession('current');
// session.$id, session.provider, session.expire
```

### Token Storage

| Platform | Storage Method |
|----------|---------------|
| Web | HTTP-only cookie (default) or `localStorage` |
| Mobile | Secure Keystore / Keychain |
| Desktop | OS-level secure storage |

### Session Refresh

```javascript
// Sessions are automatically managed by Appwrite SDK.
// Check session validity on app start:
try {
  await account.get();
} catch (e) {
  // Redirect to login
}
```

### Logout

```javascript
await account.deleteSession('current');
// or delete all sessions:
await account.deleteSessions();
```

---

## Role-Based Access Control

### Roles Definition

| Role | Level | Description |
|------|-------|-------------|
| `guest` | 0 | Unauthenticated user |
| `user` | 1 | Authenticated user |
| `moderator` | 2 | Content moderation privileges |
| `admin` | 3 | Full system access |

### Appwrite Teams Implementation

Roles are implemented using **Appwrite Teams**:

- **`users`** team — all authenticated users are members
- **`moderators`** team — users with moderation privileges
- **`admins`** team — users with full admin access

```javascript
// Check user's team membership (via Appwrite Function)
const userTeams = await account.listMemberships();
const isAdmin = userTeams.teams.some(t => t.$id === 'admins');
```

### Custom Label (Alternative)

For simpler role management, use a custom `role` field on the `profiles` document:

```javascript
const profile = await databases.getDocument('profiles', userId);
// profile.role: 'user' | 'moderator' | 'admin'
```

---

## Permission Model Per Collection

| Collection | Guest | User | Moderator | Admin |
|------------|-------|------|-----------|-------|
| profiles | Read public fields | Read all, Write own | Read all, Write own | Full CRUD |
| posts | Read | CRUD own, Read others | CRUD own, Delete any | Full CRUD |
| comments | Read | CRUD own | CRUD own, Delete any | Full CRUD |
| follows | Read | Create/Delete own | Create/Delete own | Full CRUD |
| likes | Read | Create/Delete own | Create/Delete own | Full CRUD |
| stories | - | CRUD own, Read from following | CRUD own, Read any | Full CRUD |
| conversations | - | Read/Write own | Read/Write own | Full CRUD |
| messages | - | Read/Write own conversations | Read/Write own, Read any | Full CRUD |
| notifications | - | Read/Update own | Read/Update own | Full CRUD |
| reports | - | Create | Read, Update | Full CRUD |

---

## E2E Encryption Key Exchange Flow

For messaging, Appmass uses **end-to-end encryption** with the following key exchange protocol:

### Key Generation (Client-Side)

```javascript
// Generate ECDH key pair on user registration
const keyPair = await crypto.subtle.generateKey(
  {
    name: 'ECDH',
    namedCurve: 'P-256',
  },
  false,
  ['deriveKey', 'deriveBits']
);
```

### Key Registration

1. On account creation, user generates a key pair
2. Public key is stored in the `profiles` document
3. Private key is stored locally on the device (encrypted with user's passphrase)

### Key Exchange Flow

```
User A                          User B
  |                               |
  |--- Request B's public key --->|
  |<--- Return public key --------|
  |                               |
  |--- Derive shared secret ----->| (ECDH)
  |<--- Derive shared secret -----|
  |                               |
  |--- Encrypt message with ----->|
  |    AES-GCM using shared       |
  |    secret as key              |
  |<--- Decrypt and verify -------|
```

### Shared Secret Derivation

```javascript
const sharedSecret = await crypto.subtle.deriveBits(
  {
    name: 'ECDH',
    public: otherUserPublicKey,
  },
  myPrivateKey,
  256
);

// Use derived bits as AES-GCM key for message encryption
const aesKey = await crypto.subtle.importKey(
  'raw',
  sharedSecret,
  { name: 'AES-GCM' },
  false,
  ['encrypt', 'decrypt']
);
```

### Key Rotation

- Users can regenerate key pairs at any time
- Old messages remain decryptable with archived keys
- Key rotation triggers a re-key notification to active conversations
- Archived keys are stored locally and synced via encrypted backup

---

## Security Considerations

1. **Never transmit private keys** to the server
2. **Session tokens** should be stored in HTTP-only cookies when possible
3. **Rate limit** auth endpoints to prevent brute force (see `security/rate-limit.md`)
4. **Email verification** is required for sensitive operations (posting, messaging)
5. **Phone verification** adds a second factor for account recovery
6. **OAuth state parameters** prevent CSRF attacks on OAuth flows
7. **All auth routes** use HTTPS only
