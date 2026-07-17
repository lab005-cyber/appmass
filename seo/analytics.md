# Analytics Setup Guide

## Google Analytics 4 (Expo Web)

### Installation
```bash
npx expo install @react-native-firebase/analytics
```

### GA4 Configuration for Web
```javascript
// config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics, logEvent };
```

### Tracking Page Views
```javascript
import { analytics } from '../config/firebase';
import { logEvent } from 'firebase/analytics';
import { usePathname } from 'expo-router';

useEffect(() => {
  logEvent(analytics, 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: usePathname(),
  });
}, [pathname]);
```

## Firebase Analytics (Mobile)

### Installation
```bash
npx expo install @react-native-firebase/app @react-native-firebase/analytics
```

### Initialization
```javascript
// app/_layout.js
import analytics from '@react-native-firebase/analytics';

// Automatically initialized via google-services.json / GoogleService-Info.plist
```

### Screen Tracking
```javascript
// In each screen or route layout
useEffect(() => {
  analytics().logScreenView({
    screen_name: 'Feed',
    screen_class: 'FeedScreen',
  });
}, []);
```

## Custom Events Tracking

### Event Definitions

| Event Name | Trigger | Properties |
|------------|---------|------------|
| `post_created` | User creates a post | `post_id`, `category`, `has_image`, `has_video` |
| `post_liked` | User likes a post | `post_id`, `author_id` |
| `post_shared` | User shares a post | `post_id`, `platform` |
| `comment_added` | User comments | `post_id`, `comment_length` |
| `profile_viewed` | User views profile | `profile_id`, `source` (feed/search) |
| `follow` | User follows another | `target_id` |
| `message_sent` | Direct message | `conversation_id`, `message_type` |
| `search` | User searches | `query`, `result_count` |
| `sign_up` | Registration complete | `method` (email/google/apple) |
| `login` | User logs in | `method` |
| `story_viewed` | Story viewed | `story_id`, `author_id` |
| `event_rsvp` | RSVP to event | `event_id`, `response` (yes/no/maybe) |

### Implementation Helper
```javascript
// utils/analytics.js
import { logEvent } from 'firebase/analytics';
import { analytics } from '../config/firebase';
import { Platform } from 'react-native';

export const trackEvent = (eventName, params = {}) => {
  const enrichedParams = {
    ...params,
    platform: Platform.OS,
    app_version: process.env.EXPO_PUBLIC_APP_VERSION,
    timestamp: new Date().toISOString(),
  };

  if (Platform.OS === 'web') {
    logEvent(analytics, eventName, enrichedParams);
  } else {
    analytics().logEvent(eventName, enrichedParams);
  }
};
```

## User Property Tracking

### Set on Login/Auth
```javascript
import { getAnalytics, setUserProperties } from 'firebase/analytics';
import { Platform } from 'react-native';

const setUserProperties = async (user) => {
  const properties = {
    user_id: user.$id,
    account_age_days: Math.floor((Date.now() - new Date(user.$createdAt).getTime()) / 86400000),
    is_verified: user.labels?.includes('verified') ? 'true' : 'false',
    onboarding_complete: user.onboardingComplete ? 'true' : 'false',
  };

  if (Platform.OS === 'web') {
    setUserProperties(getAnalytics(), properties);
  } else {
    await analytics().setUserProperties(properties);
  }
};
```

## GDPR Compliance Notes

### Consent Banner
- Implement a cookie consent banner using a library like `cookieconsent` (web) or `react-native-gdpr` (mobile).
- Block analytics scripts until user grants consent.
- Store consent status in local storage / AsyncStorage.

### Consent States
| State | Behavior |
|-------|----------|
| **Accepted** | Enable all tracking, set `analytics_storage=granted` |
| **Denied** | Disable GA4/Firebase Analytics, set `analytics_storage=denied` |
| **Not Set** | Show banner, no tracking until decision |

### Firebase Consent Mode
```javascript
import { setConsent } from 'firebase/analytics';
import { analytics } from '../config/firebase';

// When user accepts
setConsent(analytics, {
  analytics_storage: 'granted',
  ad_storage: 'denied', // keep denied unless you run ads
});

// When user rejects
setConsent(analytics, {
  analytics_storage: 'denied',
  ad_storage: 'denied',
});
```

### Required Disclosures
- Privacy Policy must disclose use of GA4 and Firebase Analytics.
- Provide "Do Not Sell My Data" option (CCPA).
- Enable IP anonymization: GA4 does this by default.
- Data retention: set to 14 months in GA4 admin.
- Enable Google Signals for cross-device reporting (opt-in).

### Region Detection
```javascript
export const isGDPRRegion = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH', 'NO',
      'IS', 'LI'].includes(data.country_code);
  } catch {
    return true; // conservative default
  }
};
```
