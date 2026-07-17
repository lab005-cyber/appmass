# System Architecture

## High-Level Architecture

```
+------------------------------------------------------------------+
|                        CLIENT LAYER                               |
|  +----------------------------------------------------------+    |
|  |                  React Native (Expo) App                   |    |
|  |  +-------------------+  +-------------------------------+ |    |
|  |  |   React Navigation|  |      Redux Toolkit Store      | |    |
|  |  |  (Stack/Tab/Drawer)|  |  (Auth / Posts / Messages /  | |    |
|  |  |                   |  |   Notifications / Chat)       | |    |
|  |  +-------------------+  +-------------------------------+ |    |
|  |  +-------------------+  +-------------------------------+ |    |
|  |  |  Appwrite SDK     |  |  WebRTC (voice/video calls)   | |    |
|  |  |  (Auth / DB /     |  |  + libsodium (E2EE)           | |    |
|  |  |   Storage / RT)   |  |                               | |    |
|  |  +-------------------+  +-------------------------------+ |    |
|  +----------------------------------------------------------+    |
+------------------------------------------------------------------+
          |  HTTPS / WSS           |  WebRTC (P2P)
          v                        v
+------------------------------------------------------------------+
|                     BACKEND LAYER                                 |
|  +----------------------------------------------------------+    |
|  |                   Appwrite Cloud (Asia Pacific)           |    |
|  |  +-------------+  +------------+  +-------------------+  |    |
|  |  |   Auth      |  |  Database  |  |    Storage        |  |    |
|  |  |  (Email/    |  |  (Postgres |  |  (Images / Videos |  |    |
|  |  |   OAuth/    |  |   + Collections)|  / Voice clips) |  |    |
|  |  |   Magic URL)|  |            |  |                   |  |    |
|  |  +-------------+  +------------+  +-------------------+  |    |
|  |  +-------------+  +------------+  +-------------------+  |    |
|  |  |  Realtime   |  | Functions  |  |    Messaging      |  |    |
|  |  |  (WebSocket |  | (Serverless|  |  (Push / In-app)  |  |    |
|  |  |   events)   |  |  triggers) |  |                   |  |    |
|  |  +-------------+  +------------+  +-------------------+  |    |
|  |  +-------------+  +------------+                         |    |
|  |  |   Teams     |  |  GraphQL   |                         |    |
|  |  |  (Groups /  |  |  (optional |                         |    |
|  |  |   Roles)    |  |   queries) |                         |    |
|  |  +-------------+  +------------+                         |    |
|  +----------------------------------------------------------+    |
+------------------------------------------------------------------+
          |
          v
+------------------------------------------------------------------+
|                     EXTERNAL SERVICES                              |
|  +------------------+  +------------------+  +-----------------+  |
|  |   Google Cloud   |  |  Apple Push      |  |  Firebase Cloud|  |
|  |   (Appwrite      |  |  Notification    |  |  Messaging     |  |
|  |    underlying)   |  |  Service (APNs)  |  |  (FCM)         |  |
|  +------------------+  +------------------+  +-----------------+  |
+------------------------------------------------------------------+
```

## Frontend Architecture

- **Framework**: React Native (Expo SDK 52+)
- **Navigation**: React Navigation v7 (Stack, Bottom Tabs, Drawer)
- **State Management**: Redux Toolkit with `createAsyncThunk` for side effects
- **Persistence**: Redux Persist (MMKV storage) for offline support
- **Real-time**: Socket connections via Appwrite Realtime SDK
- **Encryption**: Web Crypto API (react-native-get-random-values + tweetnacl)

### Component Tree

```
<App>
  <Provider store={store}>
    <PersistGate>
      <NavigationContainer>
        <AuthStack />            -- unauthenticated routes
        <MainTabs />             -- authenticated routes
          <FeedStack />
          <SearchStack />
          <CreateStack />
          <NotificationsStack />
          <ProfileStack />
        <VoiceCallOverlay />     -- global overlay
      </NavigationContainer>
    </PersistGate>
  </Provider>
</App>
```

### Redux Store Slices

| Slice            | State                                | Thunks                                    |
|------------------|--------------------------------------|-------------------------------------------|
| authSlice        | user, session, isAuthenticated       | login, register, logout, refreshSession   |
| postsSlice       | feed[], trending[], pagination       | fetchFeed, fetchTrending, createPost      |
| messagesSlice    | conversations[], activeChat          | fetchConversations, sendMessage           |
| notificationsSlice| items[], unreadCount                | fetchNotifications, markRead              |
| callsSlice       | activeCall, callHistory              | startCall, acceptCall, endCall            |
| profileSlice     | profile, followersCount, following   | fetchProfile, updateProfile               |

## Backend Architecture (Appwrite Cloud)

All backend services are provided by Appwrite Cloud in the Asia Pacific region:

| Service         | Purpose                                      | Client SDK Used        |
|-----------------|----------------------------------------------|------------------------|
| Auth            | Email/password, OAuth (Google, Apple, GitHub)| `account`              |
| Database        | Document storage (36 collections)            | `databases`            |
| Storage         | Image, video, audio file hosting             | `storage`              |
| Realtime        | WebSocket push for messages, notifications   | `realtime` / `client`  |
| Messaging       | Push notifications (APNs, FCM)               | `messaging`            |
| Functions       | Serverless backend logic (Node.js 18)        | `functions`            |
| Teams           | Group chats, moderation teams                | `teams`                |

## Data Flow Diagrams

### Post Creation Flow

```
User taps Post
  -> CreatePostScreen dispatches createPost thunk
  -> Redux thunk:
      1. Upload media files to Appwrite Storage (if any)
      2. Get media IDs array from response
      3. Call databases.createDocument('posts', { mediaIds, content, ... })
      4. Appwrite Database returns created document
      5. Extract hashtags, create/update hashtag documents
      6. Dispatch addPost to postsSlice
      7. Appwrite Realtime broadcasts 'post-created' event to followers
  -> UI updates optimistically with loading state
  -> On success: success toast, navigate to feed
  -> On error: error toast, revert optimistic update
```

### Feed Loading Flow

```
User opens Feed tab
  -> FeedScreen dispatches fetchFeed
  -> Redux thunk:
      1. Call databases.listDocuments('posts', queries)
      2. If no network, load from persisted state (Redux Persist)
      3. Map each post to include:
         - Author profile (from profiles collection)
         - Like status (from post_likes for current user)
         - Comment count
         - Repost count
      4. Dispatch setFeed with enriched posts
  -> FlatList renders posts with infinite scroll
  -> onEndReached triggers paginated fetch
```

## Authentication Flow

```
                    Appwrite Cloud
+----------+        (Auth Service)        +-----------+
|  Client  | <--------------------------> | Appwrite  |
|  (Expo)  |                              | Auth API  |
+----------+                              +-----------+
     |                                         |
     | 1. Register/Login Request               |
     |---------------------------------------->|
     |                                         |
     | 2. Appwrite creates session,            |
     |    returns JWT / session cookie         |
     |<----------------------------------------|
     |                                         |
     | 3. Store session securely in            |
     |    expo-secure-store (keychain)         |
     |                                         |
     | 4. Auth state persisted in Redux        |
     |    + Redux Persist                      |
     |                                         |
     | 5. On app launch: check stored session  |
     |    -> validate with account.get()       |
     |    -> if expired: refresh or logout     |
     |                                         |
```

### Token Management

- Sessions stored via `expo-secure-store` (iOS Keychain / Android EncryptedSharedPreferences)
- Redux authSlice holds:
  - `user`: user document (name, email, avatar)
  - `session`: Appwrite Session object (never persisted to AsyncStorage — only to secure store)
  - `isAuthenticated`: boolean
- On cold boot:
  1. `App.tsx` checks `expo-secure-store` for stored session
  2. Calls `account.get()` to validate
  3. If valid, hydrate Redux; if invalid, clear and show login
- Session refresh handled by Appwrite SDK automatically for JWT tokens
- Logout: `account.deleteSession()` + clear secure store + reset Redux

## Real-Time Messaging Flow

```
Sender types message
  -> dispatch(sendMessage)
  -> Optimistic: add message to UI immediately
  -> Create document in 'messages' collection
  -> Appwrite Database triggers internal event
  -> Appwrite Realtime broadcasts 'messages' event
  -> Recipient's Realtime subscription callback fires
  -> Recipient's Redux store updates with new message
  -> UI shows message (banner / in-chat)
```

### Subscription Architecture

```javascript
// Client subscribes per chat/conversation
const channel = `databases.${databaseId}.collections.messages.documents`;

client.subscribe(channel, (response) => {
  const { event, payload } = response;
  // event: 'database.documents.create'
  // payload: the new document
  dispatch(receiveMessage(payload));
});
```

## E2E Encryption Approach

Appmass uses client-side end-to-end encryption for direct messages, implemented with the **Web Crypto API** (via `tweetnacl` / `tweetnacl-util`):

### Key Exchange (X25519 + XSalsa20-Poly1305)

```
1. Registration: each user generates a Curve25519 keypair
   - Private key: 32 bytes (stored locally in secure store)
   - Public key:  32 bytes (uploaded to profiles collection)

2. When User A messages User B:
   A fetches B's public key from profiles
   A generates ephemeral keypair
   A computes shared secret: X25519(A.eph_priv, B.pub)
   A encrypts message with XSalsa20-Poly1305 (box)
   A sends: ciphertext + A's ephemeral public key + nonce
   
3. B decrypts:
   B loads own private key from secure store
   B computes shared secret: X25519(B.priv, A.eph_pub)
   B decrypts using secretbox_open
```

### Key Management

- Keypair generated client-side after registration
- Private key never leaves device (stored via `expo-secure-store`)
- Public key stored in `profiles.publicKey` field
- Rotated on password change / security event
- Pre-keys and session management for async messaging (Signal protocol-like, simplified)

### Implementation Plan

| Component                | Library                |
|--------------------------|------------------------|
| Key generation           | tweetnacl.box.keyPair  |
| Shared secret            | tweetnacl.box.before   |
| Encrypt                  | tweetnacl.box.after    |
| Decrypt                  | tweetnacl.box.open.after|
| Random nonces            | react-native-get-random-values |
| Encoding                 | tweetnacl-util (Base64)|
| Secure storage           | expo-secure-store      |

## Voice Call Architecture (WebRTC + Signaling via Appwrite Realtime)

```
+----------+                    +----------+
| Caller   |                    | Callee   |
+----------+                    +----------+
     |                               |
     | 1. Create offer (SDP)         |
     | 2. Send via Realtime:         |
     |    channel: 'calls'           |
     |    event: 'call-offer'        |
     |------------------------------>|
     |                               |
     |                               | 3. Create answer (SDP)
     |  4. Send via Realtime:        |
     |     channel: 'calls'          |
     |     event: 'call-answer'      |
     |<------------------------------|
     |                               |
     |  5. Exchange ICE candidates   |
     |     via Realtime channel      |
     |<----------------------------->|
     |                               |
     |  6. P2P WebRTC connection     |
     |     (audio stream)            |
     |<=============================>|
```

### Signaling Protocol (over Appwrite Realtime)

| Event Type          | Payload                                     |
|---------------------|---------------------------------------------|
| `call-offer`        | `{ callerId, calleeId, sdp, callType }`     |
| `call-answer`       | `{ callerId, calleeId, sdp }`               |
| `ice-candidate`     | `{ targetId, candidate }`                   |
| `call-end`          | `{ callId, reason: 'hangup'|'timeout' }`    |
| `call-decline`      | `{ callerId, reason: 'busy'|'decline' }`    |

### End-to-End Encryption for Voice

- WebRTC DTLS-SRTP provides mandatory encryption of media streams
- Signaling channel (Realtime) secured by Appwrite's TLS + auth
- Optionally: embed E2EE key in signaling payload for additional layer

### STUN/TURN

- Google's free STUN servers as fallback
- Self-hosted Coturn TURN server for symmetric NAT traversal
- TURN credentials distributed via Appwrite Functions (authenticated)

### Audio Codec

- Opus codec (default for WebRTC audio)
- Bitrate: 32 kbps (adaptive)
- Forward Error Correction enabled
