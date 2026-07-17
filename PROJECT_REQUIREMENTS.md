# Project Requirements — appmass

## 1. Overview

A cross-platform messaging + social media application that allows users to:
- Chat with friends via DMs, group chats, and channels
- Post content ("Posts") to a social feed
- Share ephemeral stories
- Make voice calls

## 2. Core Requirements

### 2.1 Authentication
- Email/password signup and login
- Phone number (SMS verification)
- Social login (Google, Apple, GitHub)
- Account deletion (self-service)
- Session management

### 2.2 User Profiles
- Display name, username (unique), bio, profile picture, cover photo
- Public profile page with post history
- Follow/unfollow system
- Verification badges (#c15f3c colored)

### 2.3 Social Feed
- Create posts with text + up to 10 media attachments
- Like posts with multiple reaction types (like, love, laugh, surprise, sad, angry)
- Comment on posts (with media support)
- Repost with quote
- Polls in posts
- Hashtag support
- Bookmark/save posts
- "For You" algorithmic feed
- "Following" chronological feed
- "Explore" page with trending hashtags and suggested users

### 2.4 Messaging
- 1-on-1 direct messages
- Group chats
- Public channels
- Full media sharing (images, videos, voice messages, files, stickers)
- End-to-end encryption
- Typing indicators
- Read receipts (delivered + read)
- Voice calls

### 2.5 Stories
- Photo/video stories visible for 24 hours
- Story view tracking
- Reply to stories via DM

### 2.6 Moderation
- Block users
- Mute users
- Report posts, comments, users
- Content filtering
- Admin panel

### 2.7 Monetization
- Banner advertisements
- Sponsored posts in feed

### 2.8 Notifications
- Push notifications for: new messages, likes, comments, follows, reposts, mentions
- In-app notification center

## 3. Technical Requirements

### 3.1 Frontend
- React Native (Expo) — Web, iOS, Android
- React Navigation for routing
- Redux Toolkit for state management
- Poppins typography

### 3.2 Backend
- Appwrite Cloud (Asia Pacific region)
- Services: Auth, Database, Storage, Realtime, Messaging, Functions, Teams

### 3.3 Testing
- Unit tests
- Integration tests
- End-to-end tests

### 3.4 Deployment
- Expo EAS Build for mobile (App Store + Google Play)
- Static site hosting for web
- Appwrite Cloud for backend

## 4. Design Requirements

### 4.1 Branding
- Primary color: #f4f3ee
- Verification badge: #c15f3c
- Typography: Poppins (rounded, sans-serif)

### 4.2 UI/UX
- Onboarding screens for new users
- Branded splash screen
- Responsive across web, tablet, and mobile
- Light and dark mode support
