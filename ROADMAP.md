# Roadmap

## Phase 1: Foundation
- Initialize Expo + React Native project
- Set up Appwrite Cloud backend (project, database, auth, storage)
- Configure project structure, navigation (React Navigation)
- Implement authentication (email, phone, social)
- Create onboarding flow and splash screen
- Set up theming, typography, and design system
- Database schema design (users, posts, messages, etc.)
- CI/CD pipeline setup

## Phase 2: Social Feed
- Create post composer (text + up to 10 media attachments)
- Like/unlike with multiple reaction types
- Comments with text and media
- Repost with quote functionality
- Poll creation and voting
- Hashtag parsing and linking
- Bookmark posts
- For You algorithmic feed
- Following chronological feed
- Explore feed (trending, hashtags, suggested users)
- User profiles with follow/unfollow

## Phase 3: Messaging
- Direct message conversations list
- Chat screen with text messages
- Real-time message delivery via Appwrite Realtime
- Group chat creation and management
- Channels (broadcast)
- Media sharing (image, video, audio, files)
- Typing indicators
- Read receipts (delivered / read)
- Message editing and deletion
- Reply threads
- Forward messages
- End-to-end encryption integration
- Mute / archive conversations

## Phase 4: Stories & Voice Calls
- Story camera / media picker
- Story upload with 24-hour TTL
- Story viewer list
- Reply to stories via DM
- Voice call initialization via WebRTC
- Call UI (mute, speaker, end)
- Call notification and ringing

## Phase 5: Moderation & Admin
- Block / mute user actions
- Report content flow
- Content filtering and auto-moderation
- Admin panel with user management
- Report queue and content takedown

## Phase 6: Monetization & Ads
- Banner ad placement in feed
- Sponsored post promotion flow
- Ad analytics and revenue dashboard

## Phase 7: Testing & Optimization
- Unit tests (Jest)
- Integration tests
- E2E tests (Detox / Maestro)
- Performance profiling and optimization
- Image/video caching and lazy loading
- Accessibility audit
- Security audit

## Phase 8: Deployment & Launch
- App store assets (icons, screenshots, descriptions)
- EAS Build configuration
- App Store Connect & Google Play Console setup
- Beta testing (TestFlight / Internal Testing)
- Production release
- Post-launch monitoring and crash reporting
