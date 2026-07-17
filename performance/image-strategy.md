# Image Handling Strategy

## Upload Pipeline
1. User selects image from gallery/camera
2. `expo-image-manipulator` compresses:
   - Max dimensions: 2048px on longest edge
   - Format: WebP
   - Quality: 80%
3. Generate blurhash for placeholder
4. Upload to Appwrite Storage bucket
5. Return file `$id` + blurhash string
6. Save reference in document (post/user profile)

## Storage
- Appwrite Storage with bucket-level permissions
- Buckets: `avatars`, `posts`, `stories`, `messages`
- Bucket permissions: read = any, write = authenticated users
- File security validated on client before upload
- Max file size: 10MB per image

## Display Pipeline
- `expo-image` component throughout the app
- Blurhash placeholder shown immediately
- Progressive loading: blurhash → low-res → full
- Cache images with `expo-image` disk cache
- On error: show fallback placeholder image
- On long press: "Save image" option (media library)

## CDN
- Appwrite Storage serves images via integrated CDN
- Image transformations via URL parameters:
  - `?w=200&q=80` - avatar thumbnails
  - `?w=400&q=80` - feed thumbnails
  - `?w=2048&q=90` - full resolution
  - `?format=webp` - format conversion
- Signed URLs for private images (stories, DMs)

## Thumbnail Sizes

| Variant | Dimensions | Use Case |
|---------|-----------|----------|
| Avatar | 200x200 | Profile pictures, comments |
| Post thumbnail | 400x400 | Feed cards, grid view |
| Post full | 2048px longest | Detail view, lightbox |
| Story | 1080x1920 | Stories (9:16) |
| Message | 512x512 | Chat image previews |

## Lazy Loading
- Feed images load with IntersectionObserver (web) / onViewableItemsChanged (native)
- Below-fold images defer until scroll
- Prefetch next 5 visible items on mount
- Unload off-screen images (FlashList recycling)

## Alt Text
- Required field on image upload (user-provided)
- Auto-generated caption via ML if user skips
- Exposed via `accessibilityLabel` prop on `Image`
- Used for SEO meta tags on web
- Displayed as tooltip on hover (web) / long press (mobile)
