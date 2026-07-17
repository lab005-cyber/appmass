# App Optimization Strategies

## React Native Performance
- Use `FlashList` from `@shopify/flash-list` over FlatList for feeds
- `getItemLayout` for fixed-height items to skip measurement
- `windowSize` = 5, `maxToRenderPerBatch` = 10
- Avoid anonymous functions in renderItem (use `useCallback`)
- `React.memo` on list item components
- `useMemo` for expensive computed values
- Remove console.logs in prod with babel-plugin-transform-remove-console

## Image Optimization
- Client-side: compress via `expo-image-manipulator` before upload
- Max upload dimensions: 2048px on longest edge
- Format: WebP with 80% quality
- Server-side: Appwrite image transformations (?w=400&q=80)
- Progressive loading with blurhash placeholders
- Prefetch critical images (profile avatars)

## Bundle Size Optimization
- Lazy load screens with `React.lazy` + `Suspense` (web) / `expo-router` dynamic routes
- Code splitting per route using Webpack/ Metro
- Tree-shake unused imports (lodash → lodash-es)
- Remove unnecessary polyfills
- Analyze bundle with `npx expo-analyze-bundle`
- Use `babel-plugin-import` for component libraries

## Redux Performance
- Normalized state shape (entities by ID pattern)
- `createEntityAdapter` for collections
- `createSelector` with memoization (Reselect)
- Avoid spreading large objects in reducers (use Immer)
- Batch dispatch for multi-action updates
- Persist only auth + minimal UI state to AsyncStorage

## App Startup Time
- Minimal splash screen (no heavy initialization)
- Lazy initialize non-critical services (analytics, chat)
- Hermes engine enabled (iOS + Android)
- Optimize JS bundle: inline critical requires
- Use `expo-splash-screen` with `SplashScreen.preventAutoHideAsync()`
- Preload fonts and assets in parallel

## Memory Management
- Clean up listeners in `useEffect` return
- Unsubscribe Appwrite real-time subscriptions on unmount
- Limit concurrent images in FlashList via `recycleItems`
- Avoid storing large blobs in Redux (use file URIs)
- Use `InteractionManager.runAfterInteractions` for heavy ops
- Weak references for long-lived observers

## Network Optimization
- Request batching for Appwrite queries
- Debounce search inputs (300ms)
- Throttle scroll-based analytics events
- GraphQL-style field selection in Appwrite queries (`select`)
- Compress request/response with gzip (Appwrite default)
- Retry with exponential backoff (React Query retry: 3)
