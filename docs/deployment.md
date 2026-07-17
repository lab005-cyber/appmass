# Deployment Guide

## 1. Appwrite Cloud Setup

### Create Project

1. Go to [console.appwrite.io](https://console.appwrite.io)
2. Create new project → **Appmass**
3. Select region: **Asia Pacific (apac-1)**
4. Note the **Project ID** for environment variables

### Configure Authentication

| Provider     | Setup Steps                                                                 |
|--------------|-----------------------------------------------------------------------------|
| Email/Password| Enable in Auth → Settings → Default login duration: 30 days                 |
| Google        | Create OAuth 2.0 credentials in Google Cloud Console → Add redirect URI     |
| Apple         | Enable Sign In with Apple in Apple Developer → Configure Service ID         |
| Magic URL     | Enable in Auth → Settings → Set sender email                                |

### Create Database Collections

Create all collections listed in `database/schema.json` via:

1. Appwrite Console → Database → Create Database → `appmass_main`
2. Add collections manually following `docs/database.md` schema
3. Set indexes and permissions as documented

Alternatively, run the schema script:

```bash
node scripts/apply-schema.js
```

### Create Storage Buckets

| Bucket ID     | Max File Size | Allowed MIME Types                          | Security            |
|---------------|---------------|---------------------------------------------|---------------------|
| `avatars`     | 5 MB          | image/jpeg, image/png, image/webp           | read("any")         |
| `post_media`  | 50 MB         | image/*, video/mp4, video/quicktime         | read("any")         |
| `story_media` | 20 MB         | image/jpeg, image/png, video/mp4            | read("any")         |
| `covers`      | 10 MB         | image/jpeg, image/png, image/webp           | read("any")         |
| `ad_assets`   | 30 MB         | image/*, video/mp4                          | read("any")         |

Set file security to `read("any")` and `write("user:{userId}")` for all buckets.

### Deploy Appwrite Functions

```bash
# Install Appwrite CLI
npm install -g appwrite-cli

# Login
appwrite login

# Deploy functions
appwrite functions create \
  --functionId="check-username" \
  --name="Check Username" \
  --runtime="node-18.0" \
  --execute="user"

appwrite functions create \
  --functionId="cleanup-stories" \
  --name="Cleanup Expired Stories" \
  --runtime="node-18.0" \
  --execute="any"

# Deploy each function from its directory
cd functions/check-username && appwrite deploy function
cd functions/cleanup-stories && appwrite deploy function

# Set up cron schedule for cleanup-stories (every 60 minutes)
```

### Create Push Notification Messaging

1. Console → Messaging → Providers → Add FCM (Android) + APNs (iOS)
2. Upload Firebase credentials (`google-services.json`)
3. Upload APNs certificate (`.p8` key from Apple Developer)
4. Create topic or target users via `messaging` SDK

## 2. Expo EAS Build Configuration

### Prerequisites

```bash
npm install -g eas-cli
eas login
```

### `eas.json`

```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "channel": "production",
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "autoIncrement": true
      },
      "env": {
        "EXPO_PUBLIC_APPWRITE_ENDPOINT": "https://cloud.appwrite.io/v1",
        "EXPO_PUBLIC_APPWRITE_PROJECT_ID": "your-project-id",
        "EXPO_PUBLIC_APPWRITE_REGION": "apac-1"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./secrets/google-play.json",
        "track": "production"
      },
      "ios": {
        "appleId": "your@appleid.com",
        "ascAppId": "your-apple-store-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

### Build Commands

```bash
# Development build (local)
eas build --platform all --profile development

# Preview build (internal testing)
eas build --platform all --profile preview

# Production build
eas build --platform all --profile production

# Submit to stores
eas submit --platform android --profile production
eas submit --platform ios --profile production
```

## 3. App Store & Google Play Submission Checklist

### iOS (App Store)

- [ ] Apple Developer account enrolled ($99/year)
- [ ] App ID registered in Apple Developer portal
- [ ] Push Notification capability enabled (APNs)
- [ ] Sign In with Apple enabled (if using Apple OAuth)
- [ ] Voice over IP (VoIP) certificate for calls
- [ ] App icon: 1024x1024 transparent PNG
- [ ] Screenshots: 6.5" iPhone + 12.9" iPad (4+ each)
- [ ] App preview video (optional, 30s max)
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support URL
- [ ] App description (max 4000 chars)
- [ ] Keywords (max 100 chars)
- [ ] Content rating: 17+ (user-generated content)
- [ ] Export compliance: E2EE requires export compliance documentation (CCATS)
- [ ] TestFlight internal testing (at least 1 beta)
- [ ] Review guidelines followed (no placeholder UI, login credentials provided)

### Android (Google Play)

- [ ] Google Play Developer account enrolled ($25 one-time)
- [ ] App signing key generated (managed by Google or EAS)
- [ ] App Bundle (.aab) uploaded
- [ ] Store listing:
  - Title (max 50 chars)
  - Short description (max 80 chars)
  - Full description (max 4000 chars)
  - Screenshots: 2+ phone, 2+ 7" tablet, 2+ 10" tablet
  - Feature graphic: 1024x500
  - Icon: 512x512
- [ ] Content rating questionnaire completed
- [ ] Target audience: 18+ (communication app)
- [ ] Data safety section filled out
- [ ] Privacy policy URL
- [ ] In-app purchases configured (if any)

## 4. Web Deployment (Vercel / Netlify / Appwrite Cloud)

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Required `vercel.json`:**
```json
{
  "framework": "expo",
  "buildCommand": "npx expo export:web",
  "outputDirectory": "web-build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify Deployment

- Connect GitHub repo to Netlify
- Build command: `npx expo export:web`
- Publish directory: `web-build`
- Add redirect rule for SPA: `/* /index.html 200`

### Appwrite Cloud Static Hosting

1. Console → Hosting → Add domain
2. Upload `web-build/` folder or connect via CLI
3. Enable SSL (auto-provisioned)

## 5. Environment Variables

### Client-Side (Expose to app)

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=appmass_main
EXPO_PUBLIC_APPWRITE_BUCKET_AVATARS=avatars
EXPO_PUBLIC_APPWRITE_BUCKET_POST_MEDIA=post_media
EXPO_PUBLIC_APPWRITE_BUCKET_STORY_MEDIA=story_media
EXPO_PUBLIC_APPWRITE_BUCKET_COVERS=covers
EXPO_PUBLIC_APPWRITE_BUCKET_AD_ASSETS=ad_assets
EXPO_PUBLIC_STUN_SERVER=stun:stun.l.google.com:19302
EXPO_PUBLIC_TURN_SERVER_URL=turn:turn.appmass.com:3478
EXPO_PUBLIC_ENCRYPTION_ENABLED=true
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### Server-Side (Appwrite Functions)

```env
APPWRITE_FUNCTION_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_FUNCTION_PROJECT_ID=your-project-id
APPWRITE_FUNCTION_API_KEY=your-api-key
DATABASE_ID=appmass_main
STORAGE_BUCKET_POST_MEDIA=post_media
SENTRY_DSN=https://xxx@sentry.io/xxx
TURN_SECRET=turn-shared-secret
```

### CI/CD (GitHub Actions Secrets)

| Secret Name                    | Value                                  |
|--------------------------------|----------------------------------------|
| `EXPO_TOKEN`                   | Expo access token (for EAS)            |
| `APPLE_ID`                     | Apple Developer email                  |
| `APPLE_TEAM_ID`                | Apple Team ID (10 chars)               |
| `GOOGLE_PLAY_SERVICE_ACCOUNT`  | Base64-encoded Google Play JSON key    |
| `APPWRITE_API_KEY`             | Appwrite API key (Functions deploy)    |
| `SENTRY_AUTH_TOKEN`            | Sentry auth token                      |

## 6. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage

  deploy-appwrite-functions:
    needs: [lint-and-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: Deploy Appwrite Functions
        env:
          APPWRITE_API_KEY: ${{ secrets.APPWRITE_API_KEY }}
        run: |
          npx appwrite deploy function --all

  build-and-submit-ios:
    needs: [lint-and-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: EAS Build + Submit iOS
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: |
          npx eas build --platform ios --profile production --non-interactive
          npx eas submit --platform ios --profile production --non-interactive

  build-and-submit-android:
    needs: [lint-and-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - name: EAS Build + Submit Android
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: |
          npx eas build --platform android --profile production --non-interactive
          npx eas submit --platform android --profile production --non-interactive

  deploy-web:
    needs: [lint-and-test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx expo export:web
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Strategy

| Scenario                    | Rollback Action                                              |
|-----------------------------|--------------------------------------------------------------|
| App store release buggy     | Use iTunes Connect / Play Console to roll back to prev build |
| Appwrite Function broken    | Redeploy previous function version via Appwrite Console      |
| Database schema issue       | Appwrite supports additive changes only; roll forward        |
| Web deployment broken       | Vercel: revert to previous deployment in dashboard           |
| Environment variable leak   | Rotate secrets immediately, redeploy all services            |

## Monitoring

- **Sentry**: Error tracking for both client and server
- **Appwrite Console**: API usage, function logs, storage metrics
- **Vercel Analytics**: Web performance metrics
- **Firebase Crashlytics**: Native crash reporting (Android/iOS)
