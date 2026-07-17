# Security Overview

## Encryption

### End-to-End Encryption for Messages

Messages use **client-side E2E encryption** via the **Web Crypto API**. No plaintext message content is ever stored on or transmitted through the server.

**Algorithm:**
- **Key Exchange:** ECDH (Elliptic Curve Diffie-Hellman) over P-256
- **Encryption:** AES-GCM with 256-bit keys
- **IV:** Random 12-byte initialization vector per message

**Flow:**
1. Each user generates an ECDH key pair upon registration
2. Public keys are stored on Appwrite (in the `profiles` document)
3. Private keys remain on-device, encrypted with the user's passphrase
4. Shared secrets are derived client-side per conversation
5. Message payload is encrypted before sending; ciphertext is stored server-side

### In-Transit Encryption

- **HTTPS/TLS 1.3** mandatory for all API communication
- Appwrite endpoints enforce TLS automatically
- Appwrite Realtime connections use WSS (WebSocket Secure)

### At-Rest Encryption

- Appwrite databases are encrypted at rest (AES-256)
- File storage (images, videos) use server-side encryption
- No plaintext message content is stored server-side

---

## Appwrite Security Best Practices

### Project-Level

1. **API Key Scoping** — Use restricted API keys with minimum required scopes:
   - `databases.read/write` for CRUD operations
   - `storage.read/write` for file uploads
   - `users.read` for admin user management
   - Never use a full-access API key for client operations

2. **Custom Functions as a Backend** — Appwrite Functions act as a trusted backend:
   - Validate permissions server-side
   - Enforce business logic (e.g., 24h edit window)
   - Sanitize inputs before database writes
   - Never trust client-side role assertions

3. **Appwrite Security Rules:**
   - Enable email verification for accounts
   - Set session expiration (30 days recommended)
   - Use team-based permissions for admin/mod routes
   - Monitor audit logs in Appwrite Console

### Client-Side

1. **SDK Configuration:**
   ```javascript
   const client = new Client()
     .setEndpoint(ENDPOINT)
     .setProject(PROJECT_ID)
     .setSelfSigned(false) // Reject self-signed certs in production
   ```

2. **Environment Variables:**
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT` — public, scoped to project only
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID` — public (safe to expose)
   - API keys are NEVER exposed client-side

---

## Input Validation & Sanitization

### Server-Side (Appwrite Functions)

All inputs are validated in Appwrite Functions before processing:

| Field | Validation Rule |
|-------|----------------|
| Email | RFC 5322 regex, max 254 chars |
| Password | Min 8 chars, 1 uppercase, 1 number |
| Display Name | 1–50 chars, no HTML tags |
| Post Content | 1–500 chars, stripped of scripts |
| Comment Content | 1–300 chars, stripped of scripts |
| File Uploads | MIME type check, size check, content scan |

### Sanitization Rules

- **HTML stripping:** Remove all HTML tags from text content
- **Script injection:** Strip `javascript:`, `data:` URIs, event handlers
- **NoSQL injection:** Use Appwrite's parameterized queries (never raw strings)
- **IDOR prevention:** Verify document ownership via `userId` field matching

---

## Rate Limiting Strategy

See `rate-limit.md` for detailed per-endpoint limits.

**Strategy:**
- Token bucket algorithm per user/IP
- Separate limits for authenticated vs. unauthenticated requests
- Stricter limits on auth endpoints to prevent brute force
- Rate limit headers sent with every response
- Banned IPs on sustained abuse (100+ violations within 5 minutes)

---

## API Key Management

### Key Hierarchy

| Key Type | Scope | Storage | Rotation |
|----------|-------|---------|----------|
| **Full Access** | All services | Appwrite Console | Quarterly |
| **Server** | Functions, DB write | Server env vars | Monthly |
| **Client** | Limited read-only | Public (safe) | N/A |

### Key Rotation

- Full access keys rotated quarterly via Appwrite Console
- Server keys rotated monthly as part of deployment pipeline
- Compromised keys are revoked immediately and rotated

---

## Secure Storage for Tokens

### Web Platform

| Credential | Storage Method |
|------------|----------------|
| Session Token | HTTP-only, Secure, SameSite=Strict cookie |
| E2E Private Key | IndexedDB (encrypted with user PIN/biometric) |
| User Preferences | localStorage (non-sensitive only) |
| API Keys | Never stored client-side |

### Mobile Platform

| Credential | Storage Method |
|------------|----------------|
| Session Token | Encrypted SharedPreferences (Android) / Keychain (iOS) |
| E2E Private Key | Android Keystore / iOS Secure Enclave |
| Biometric Key | BiometricPrompt / LocalAuthentication |

### Desktop Platform

| Credential | Storage Method |
|------------|----------------|
| Session Token | OS keychain (Windows Credential Manager, macOS Keychain) |
| E2E Private Key | OS keychain encrypted storage |

---

## HTTPS Enforcement

- All API endpoints are HTTPS-only
- HTTP requests return a `301 Moved Permanently` to HTTPS
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- Certificate: TLS 1.3 with AES-GCM cipher suites
- Certificate renewal: Let's Encrypt with automated renewal (90-day cycle)

---

## Additional Security Measures

### CSRF Protection
- OAuth flows include `state` parameter validation
- Appwrite Functions validate origin headers

### XSS Prevention
- Content-Security-Policy header:
  ```
  default-src 'self';
  img-src 'self' https://*.appwrite.io data:;
  connect-src 'self' https://*.appwrite.io wss://*.appwrite.io;
  script-src 'self';
  ```
- All user-generated content is escaped before rendering

### SQL/NoSQL Injection
- Appwrite SDK uses parameterized queries
- No raw query strings are accepted

### Denial of Service
- Rate limiting per endpoint (see `rate-limit.md`)
- Request size limits (max 10MB per request)
- Concurrent request limits per user (10 simultaneous)

### Data Privacy
- GDPR-compliant data deletion
- User data export endpoint
- 90-day retention policy for deleted content
- Anonymized analytics only
