# AppMass Component Design Guidelines

## Buttons

### Primary Button
```
┌──────────────────────────────┐
│  [Icon]  Action Text         │
└──────────────────────────────┘
```
- Background: `--color-accent` (#c15f3c)
- Text: White, `--text-body` (16px), weight 600
- Padding: 12px vertical, 24px horizontal
- Border radius: 12px
- States: opacity 0.8 on hover, 0.6 on press
- Full-width on mobile when in forms

### Secondary Button
```
┌──────────────────────────────┐
│  [Icon]  Action Text         │
└──────────────────────────────┘
```
- Background: transparent
- Border: 1.5px solid `--color-accent`
- Text: `--color-accent`, weight 500
- Padding / radius: same as primary

### Ghost Button
```
┌──────────────────────────────┐
│  [Icon]  Action Text         │
└──────────────────────────────┘
```
- Background: transparent (no border)
- Text: `--color-text-secondary`
- Used for tertiary actions (cancel, skip, dismiss)

### Icon Button
```
┌──────┐
│  ♡   │  40×40px hit area
└──────┘
```
- Square, 40×40px tap target
- Icon centered at 20px
- Background: transparent (light hover overlay)
- Use for like, bookmark, share inline actions

---

## Input Fields

```
┌────────────────────────────────┐
│  Label                          │
│  ┌──────────────────────────┐  │
│  │ [Icon]  Placeholder...   │  │
│  └──────────────────────────┘  │
│  Helper text / Error            │
└────────────────────────────────┘
```
- Background: `--color-surface`
- Border: 1.5px solid `--color-border`
- Border radius: 12px
- Padding: 12px vertical, 16px horizontal
- Text: `--text-body` (16px)
- Focus state: border `--color-accent`
- Error state: border `--color-error`
- Character count: bottom-right, `--text-caption`

---

## Cards

### Post Card
```
┌──────────────────────────────────┐
│ [Avatar] Username  •  2h    ···  │
│ Verified badge (if verified)     │
│                                  │
│ Post content text here...        │
│                                  │
│ [Media attachment if any]        │
│ ┌────────────────────────────┐   │
│ │         Image/Video         │   │
│ └────────────────────────────┘   │
│                                  │
│ ♡ 42  💬 8   🔁 12  🔖         │
└──────────────────────────────────┘
```
- Surface: `--color-surface`
- Border radius: 16px
- Padding: 20px
- Bottom action bar: space-evenly, icons at 20px
- Shadow: 0 1px 3px rgba(0,0,0,0.06)

### Story Card
```
┌──────────┐
│  ┌────┐  │
│  │    │  │  Ring: --color-accent (unviewed)
│  │ Av │  │  Ring: --color-border (viewed)
│  │    │  │
│  └────┘  │
│  Username │
└──────────┘
```
- Avatar: 56×56px
- Ring: 4px stroke
- Label: `--text-caption`, centered
- Add story: dashed ring, `+` icon overlay

### User Card
```
┌──────────────────────────────────┐
│ [Avatar]  Display Name           │
│           @username              │
│           Bio line (truncated)   │
│                      [Follow]    │
└──────────────────────────────────┘
```
- Avatar: 40×40px
- Follow button: compact secondary style
- Used in search results, followers/following lists

---

## Navigation

### Bottom Tab Bar
```
┌──────────────────────────────────────┐
│  🏠    🔍    ➕    🔔    👤          │
│ Feed  Search  Post  Notif  Profile    │
└──────────────────────────────────────┘
```
- Height: 56px (safe area + 56)
- Background: `--color-surface` with top border
- Active tab: icon fill, accent color
- Inactive tab: `--color-text-secondary`
- Center FAB: elevated circle, `--color-accent`
- Labels: `--text-caption` (12px)

### Top Tab Bar
```
┌──────────────────────────────────────┐
│  [Tab 1]   [Tab 2]   [Tab 3]         │
│  ▔▔▔▔▔                               │
└──────────────────────────────────────┘
```
- Active indicator: 3px line, `--color-accent`
- Inactive: `--color-text-secondary`
- Used on profile page (Posts / Replies / Media)
- Horizontal scrollable if > 4 tabs

---

## Modals

```
┌──────────────────────────────────┐
│  ▔▔▔▔▔▔▔  (drag handle)          │
│                                  │
│  Title              [X] close    │
│                                  │
│  ┌────────────────────────────┐  │
│  │        Content             │  │
│  └────────────────────────────┘  │
│                                  │
│  [Cancel]          [Confirm]     │
└──────────────────────────────────┘
```
- Overlay: 60% opacity black
- Surface: `--color-surface`, top corners rounded 20px
- Max width: 480px (centered on desktop)
- Full width on mobile, bottom sheet style
- Drag handle: 36×4px rounded bar at top center

---

## Feed Items

```
Post Card (see above)
   ↓ Vertical spacing: 16px
Post Card
   ↓
Loading skeleton (shimmer animation)
   ↓
"Load more" or end-of-feed message
```
- Pull-to-refresh with spinner
- Infinite scroll with intersection observer
- Skeleton: 3-4 placeholder lines + rounded rect for media
- End of feed: "You're all caught up" with app logo

---

## Chat Bubbles

### Sent
```
┌──────────────────────────────┐
│                    ┌──────┐  │
│                    │ Msg  │  │
│                    └──────┘  │
│                    12:30 PM  │
└──────────────────────────────┘
```
- Bubble: `--color-accent`, white text
- Radius: 16px top-left, 4px top-right, 16px bottom
- Max width: 75% of container
- Timestamp: `--text-caption`, right-aligned

### Received
```
┌──────────────────────────────┐
│  ┌──────┐                    │
│  │ Msg  │                    │
│  └──────┘                    │
│  12:30 PM                    │
└──────────────────────────────┘
```
- Bubble: `--color-surface` with border
- Text: `--color-text-primary`
- Radius: 4px top-left, 16px top-right, 16px bottom
- Avatar thumbnail: 24×24px before first message in group

---

## Story Viewer

```
┌──────────────────────────────────┐
│  ▔▔▔▔▔▔▔▔▔▔▔▔  (progress bar)    │
│  [Avatar] Username  12:30  ···   │
│                                  │
│                                  │
│          [Media content]         │
│        (image or video)          │
│                                  │
│                                  │
│  ┌──────────────────────────┐    │
│  │  Send message...     ➤   │    │
│  └──────────────────────────┘    │
│  ↻ (tap left)    ✕    ↻ (right) │
└──────────────────────────────────┘
```
- Full screen, `--color-bg-dark`
- Progress bar: segmented, active segment `--color-accent`
- Tap left half → previous story, right half → next
- Long press pauses, release resumes
- Bottom input: reply to story as DM
- Auto-advance: 5s per image, video plays to end
- Swipe down to dismiss with parallax shrink
