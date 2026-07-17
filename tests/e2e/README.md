# E2E Tests

## Frameworks
- **Mobile (iOS/Android):** Detox (Wix)
- **Web:** Playwright

## Setup

### Detox
```bash
# Install
npm install -g detox-cli
detox init

# Run on Android emulator
detox build --configuration android.ci
detox test --configuration android.ci

# Run on iOS simulator
detox build --configuration ios.sim
detox test --configuration ios.sim
```

### Playwright
```bash
npm install -D @playwright/test
npx playwright install
npx playwright test
```

## Critical User Flows

### Flow 1: Signup → Onboard → Create Profile → Post
1. Launch app → tap "Create Account"
2. Enter email, password, username → submit
3. Complete onboarding (interests, avatar)
4. Create profile with bio + photo
5. Tap + → create post with image + caption
6. Verify post appears in feed

### Flow 2: Login → Feed → Like/Comment → DM
1. Launch app → enter credentials → tap Login
2. Scroll feed → verify posts load
3. Tap like button → verify heart animation + count
4. Tap comment → type → submit → verify comment appears
5. Tap DM icon → select user → send message
6. Verify message appears in chat

### Flow 3: Story Creation → View Story
1. Tap camera icon → capture/upload photo
2. Add text overlay → tap "Your Story"
3. Navigate to Stories section → tap own story
4. Verify story plays with proper duration
5. Swipe to next user's story
6. Tap to dismiss → verify back on feed

## CI Integration

### GitHub Actions
```yaml
e2e-android:
  runs-on: macos-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: detox build --configuration android.ci
    - run: detox test --configuration android.ci

e2e-web:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: npm ci
    - run: npx playwright install
    - run: npx playwright test
```

## Running

```bash
# Mobile E2E
npx detox test --configuration android.ci

# Web E2E
npx playwright test

# All E2E
npm run test:e2e
```
