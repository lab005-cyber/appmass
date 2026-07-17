# Caching Strategy

## Image Caching
- Use `expo-image` with built-in disk caching for images
- Cache key based on URL + dimensions
- Blurhash placeholders shown while cached image loads
- Cache priority: memory → disk → network
- Max disk cache: 200MB, auto-evict LRU

## API Response Caching
- **React Query** for server state management
- `staleTime` defaults: feeds 30s, profiles 60s, messages 5s
- `cacheTime`: 5 minutes for most queries
- Background refetch on screen focus
- Optimistic updates for mutations (likes, comments)

## Appwrite Query Caching
- Client-side document cache with TTL per collection
- Documents cached by `$id` for instant reads
- List queries cached with query fingerprint hash
- Invalidate on `create`/`update`/`delete` mutations
- Redux persists auth + app state (AsyncStorage)

## Feed Pagination Caching
- FlatList/FlashList with `getItemLayout` for fixed-height posts
- Cursor-based pagination, cache last 3 pages in memory
- Prefetch next page when within 5 items of end
- Pull-to-refresh invalidates and refetches page 1
- Offline support: serve stale cache when offline

## Cache Invalidation Strategy

| Trigger | Action |
|---------|--------|
| New post created | Invalidate feed + profile queries |
| Like/unlike | Invalidate post query, don't invalidate full feed |
| New follower | Invalidate follower count + feed |
| User updates profile | Invalidate user profile query |
| App foreground | Stale refetch all active queries |
| Push notification | Targeted invalidation per event type |

## Service Worker Caching (Web) - Workbox
- Precache static assets (JS bundles, fonts, icons)
- Runtime cache for images (CacheFirst, 50 entries)
- NetworkFirst for API calls, fallback to cache offline
- StaleWhileRevalidate for Appwrite document reads
- Skip waiting + clients claim for immediate activation
