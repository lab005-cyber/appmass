# Folder Structure

```
appmass/
├── app/                              # Expo Router source code
│   ├── (auth)/                       # Auth-related screens (unauthenticated stack)
│   │   ├── _layout.tsx               #   Auth stack navigator layout
│   │   ├── login.tsx                 #   Login screen
│   │   ├── register.tsx              #   Registration screen
│   │   └── forgot-password.tsx       #   Password reset screen
│   ├── (tabs)/                       # Main tab navigator (authenticated)
│   │   ├── _layout.tsx               #   Tab navigator layout (Feed, Search, Create, Notifications, Profile)
│   │   ├── feed/
│   │   │   ├── _layout.tsx           #     Feed stack layout
│   │   │   ├── index.tsx             #     Feed list (FlatList with posts)
│   │   │   └── [postId].tsx          #     Post detail screen
│   │   ├── search/
│   │   │   ├── _layout.tsx           #     Search stack layout
│   │   │   ├── index.tsx             #     Search bar + trending hashtags
│   │   │   ├── hashtag/[tag].tsx     #     Posts by hashtag
│   │   │   └── user/[userId].tsx     #     User profile (public view)
│   │   ├── create/
│   │   │   ├── _layout.tsx           #     Create post stack
│   │   │   ├── index.tsx             #     New post composer
│   │   │   └── poll.tsx              #     Poll creator
│   │   ├── notifications/
│   │   │   ├── _layout.tsx           #     Notifications stack
│   │   │   └── index.tsx             #     Notification list
│   │   └── profile/
│   │       ├── _layout.tsx           #     Profile stack
│   │       ├── index.tsx             #     Own profile (with edit)
│   │       ├── edit.tsx              #     Edit profile form
│   │       ├── bookmarks.tsx         #     Bookmarked posts
│   │       ├── followers.tsx         #     Followers list
│   │       ├── following.tsx         #     Following list
│   │       └── settings.tsx          #     App settings screen
│   ├── messages/                     # Direct messages (stack)
│   │   ├── _layout.tsx               #   Messages stack layout
│   │   ├── index.tsx                 #   Conversations list
│   │   └── [conversationId].tsx      #   Individual chat screen (E2EE)
│   ├── call/                         # Voice call overlay
│   │   ├── _layout.tsx               #   Call overlay layout
│   │   ├── incoming.tsx              #   Incoming call screen
│   │   └── active.tsx                #   Active call screen
│   ├── admin/                        # Admin/moderation screens (role-gated)
│   │   ├── _layout.tsx               #   Admin stack
│   │   ├── reports.tsx               #   Report queue
│   │   ├── users.tsx                 #   User management
│   │   └── campaigns.tsx             #   Campaign review
│   ├── _layout.tsx                   # Root layout (auth check, Redux provider)
│   └── index.tsx                     # Entry point (redirect logic)
│
├── app.json                          # Expo configuration (Appwrite project ID, plugins)
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── babel.config.js                   # Babel preset (Expo)
├── eas.json                          # EAS Build profiles
│
├── src/                              # Shared source code
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # Base UI primitives
│   │   │   ├── Button.tsx            #   Themed button
│   │   │   ├── TextInput.tsx         #   Themed input
│   │   │   ├── Avatar.tsx            #   User avatar component
│   │   │   ├── Card.tsx              #   Card wrapper
│   │   │   ├── Badge.tsx             #   Notification badge
│   │   │   ├── Modal.tsx             #   Reusable modal
│   │   │   ├── Toast.tsx             #   Toast notification
│   │   │   ├── LoadingSpinner.tsx    #   Activity indicator
│   │   │   ├── ErrorBoundary.tsx     #   Error boundary wrapper
│   │   │   └── index.ts              #   Barrel export
│   │   ├── feed/                     # Feed-related components
│   │   │   ├── PostCard.tsx          #   Post display card
│   │   │   ├── PostActions.tsx       #   Like/comment/repost/share buttons
│   │   │   ├── PostMedia.tsx         #   Media gallery in post
│   │   │   ├── PollDisplay.tsx       #   Poll with voting UI
│   │   │   ├── CommentSheet.tsx      #   Comments bottom sheet
│   │   │   └── RepostSheet.tsx       #   Repost with quote sheet
│   │   ├── stories/                  # Story components
│   │   │   ├── StoryRing.tsx         #   Story indicator ring
│   │   │   ├── StoryViewer.tsx       #   Full-screen story viewer
│   │   │   └── StoryUpload.tsx       #   Story creation sheet
│   │   ├── messages/                 # Messaging components
│   │   │   ├── ChatBubble.tsx        #   Message bubble
│   │   │   ├── ChatInput.tsx         #   Message composer
│   │   │   ├── ConversationItem.tsx  #   Conversation list row
│   │   │   └── TypingIndicator.tsx   #   Typing indicator
│   │   ├── profile/                  # Profile components
│   │   │   ├── ProfileHeader.tsx     #   Profile banner + avatar + bio
│   │   │   ├── FollowButton.tsx      #   Follow/unfollow button
│   │   │   └── StatsRow.tsx          #   Posts/followers/following count
│   │   ├── notifications/           # Notification components
│   │   │   └── NotificationItem.tsx  #   Single notification row
│   │   ├── call/                     # Call components
│   │   │   ├── CallControls.tsx      #   Mute/end/speakerphone buttons
│   │   │   └── CallAvatar.tsx        #   Call participant display
│   │   └── common/                   # Shared utility components
│   │       ├── KeyboardAvoidingView.tsx # Keyboard-aware wrapper
│   │       ├── ImagePicker.tsx       #   Media selector
│   │       ├── EmojiPicker.tsx       #   Emoji selection
│   │       └── EmptyState.tsx        #   Empty state placeholder
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts               #   Auth state + actions
│   │   ├── useFeed.ts               #   Feed data + pagination
│   │   ├── usePost.ts               #   Single post + interactions
│   │   ├── useProfile.ts            #   Profile data
│   │   ├── useNotifications.ts      #   Notification list + unread count
│   │   ├── useMessages.ts           #   Chat messages + send
│   │   ├── useCalls.ts              #   Call state + WebRTC
│   │   ├── useE2EE.ts               #   E2EE key management + encrypt/decrypt
│   │   ├── useDebounce.ts           #   Value debouncing
│   │   ├── useNetworkStatus.ts      #   Online/offline detection
│   │   └── useAppwriteRealtime.ts   #   Realtime subscription management
│   │
│   ├── lib/                         # Third-party library configurations
│   │   ├── appwrite.ts              #   Appwrite client initialization
│   │   ├── redux.ts                 #   Redux store + persist configuration
│   │   ├── webrtc.ts                #   WebRTC peer connection factory
│   │   ├── encryption.ts            #   Crypto helpers (tweetnacl wrapper)
│   │   ├── image-picker.ts          #   Expo image picker config
│   │   └── notifications.ts         #   Push notification registration
│   │
│   ├── utils/                       # Helper utilities
│   │   ├── validation.ts            #   Form validation (Zod schemas)
│   │   ├── formatting.ts            #   Date, number, text formatters
│   │   ├── hashtag.ts               #   Hashtag extraction utilities
│   │   ├── permissions.ts           #   Permission checker helpers
│   │   ├── errors.ts                #   Error handling utilities
│   │   ├── storage.ts               #   Secure storage wrapper
│   │   └── constants.ts             #   App-wide constants and enums
│   │
│   ├── services/                    # Appwrite service wrappers
│   │   ├── auth.service.ts          #   Auth operations (login, register, logout)
│   │   ├── posts.service.ts         #   Post CRUD + like/comment/repost
│   │   ├── profiles.service.ts      #   Profile CRUD + follow/unfollow
│   │   ├── messages.service.ts      #   Message send/receive + conversation logic
│   │   ├── storage.service.ts       #   File upload/download helpers
│   │   ├── notifications.service.ts #   Fetch + mark read notifications
│   │   ├── calls.service.ts         #   Call signaling via Realtime
│   │   ├── hashtags.service.ts      #   Hashtag search + trending
│   │   ├── moderation.service.ts    #   Report creation + admin actions
│   │   └── admin.service.ts         #   Admin-only API calls via Functions
│   │
│   ├── api/                         # API client code (Functions HTTP wrappers)
│   │   ├── client.ts                #   Fetch wrapper with JWT auth
│   │   ├── functions.ts             #   Appwrite Functions call helpers
│   │   └── endpoints.ts             #   Function endpoint URLs
│   │
│   ├── store/                       # Redux Toolkit store
│   │   ├── index.ts                 #   Store configuration + middleware
│   │   ├── rootReducer.ts           #   Combined reducer
│   │   └── slices/                  # Redux slices
│   │       ├── authSlice.ts         #     Auth state + async thunks
│   │       ├── postsSlice.ts        #     Posts/feed state
│   │       ├── messagesSlice.ts     #     Messages/conversations state
│   │       ├── notificationsSlice.ts#     Notifications state
│   │       ├── callsSlice.ts        #     Call state
│   │       ├── searchSlice.ts       #     Search state
│   │       └── uiSlice.ts           #     UI state (modals, toasts, theme)
│   │
│   └── types/                       # TypeScript type definitions
│       ├── index.ts                 #   Global types
│       ├── models.ts                #   Data model interfaces (Post, User, etc.)
│       ├── api.ts                   #   API request/response types
│       ├── navigation.ts            #   Navigation param list types
│       └── enums.ts                 #   TypeScript enums
│
├── docs/                            # Project documentation
│   ├── architecture.md              #   System architecture document
│   ├── database.md                  #   Database schema documentation
│   ├── api.md                       #   API documentation
│   ├── folder-structure.md          #   This file
│   └── deployment.md                #   Deployment guide
│
├── database/                        # Schema and data management
│   ├── schema.json                  #   Collection schemas (exportable to Appwrite)
│   └── seed-data.json               #   Development seed data
│
├── public/                          # Static web assets (web deployment)
│   ├── favicon.ico                  #   Favicon
│   ├── og-image.png                 #   Open Graph preview image
│   └── robots.txt                   #   SEO robot rules
│
├── styles/                          # Global styles and themes
│   ├── theme.ts                     #   Color palette, spacing, typography tokens
│   ├── colors.ts                    #   Color definitions
│   ├── typography.ts                #   Font families, sizes, weights
│   ├── spacing.ts                   #   Spacing scale
│   └── index.ts                     #   Theme barrel export
│
├── tests/                           # Test suites
│   ├── unit/                        #   Unit tests (Jest)
│   │   ├── components/              #     Component tests
│   │   ├── hooks/                   #     Hook tests
│   │   ├── services/                #     Service tests (mocked Appwrite)
│   │   └── utils/                   #     Utility function tests
│   ├── integration/                 #   Integration tests
│   │   ├── auth-flow.test.ts        #     Register -> login -> profile
│   │   └── post-flow.test.ts        #     Create -> like -> comment
│   ├── e2e/                         #   End-to-end tests (Detox or Maestro)
│   │   ├── feed.test.ts             #     Feed scrolling and interactions
│   │   └── messaging.test.ts        #     Send and receive messages
│   └── mocks/                       #   Test mocks
│       ├── appwrite.ts              #     Mocked Appwrite client
│       └── store.ts                 #     Mocked Redux store
│
├── scripts/                         # Build and utility scripts
│   ├── apply-schema.js              #   Push schema to Appwrite
│   ├── seed.js                      #   Seed development data
│   ├── generate-types.js            #   Auto-generate TS types from schema
│   └── build-android.sh             #   Android build wrapper
│
├── config/                          # Configuration files
│   ├── appwrite.json                #   Appwrite project config (function deploy targets)
│   └── jest.config.js               #   Jest test configuration
│
├── security/                        # Security documentation
│   └── security-audit.md            #   Security audit report
│
├── performance/                     # Performance documentation
│   ├── performance-benchmarks.md    #   Load test results
│   └── optimization-notes.md        #   Optimization strategies
│
├── seo/                             # SEO metadata (web)
│   └── metadata.json                #   Open Graph and meta tags
│
├── design/                          # Design system documentation
│   ├── design-system.md             #   Component design guidelines
│   └── icons/                       #   SVG icon assets
│       └── index.ts                 #   Icon component
│
├── api/                             # API route definitions (explicit)
│   └── routes.md                    #   Route map document
│
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
├── .eslintrc.js                     # ESLint configuration
├── .prettierrc                      # Prettier configuration
└── AGENTS.md                        # AI agent instructions
```
