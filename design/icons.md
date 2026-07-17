# AppMass Icon System

**Library:** [Lucide Icons](https://lucide.dev/) — MIT licensed, ~1000+ icons

**License:** MIT — free for commercial and personal use. No attribution required.

## Sizing

| Context        | Size (px) |
|----------------|-----------|
| Tab bar        | 24        |
| Inline / Button| 20        |
| Small / Badge  | 16        |
| Large / Empty  | 48        |

All icons use `strokeWidth={1.5}` by default.

## Icon Inventory by Feature

### Navigation
| Icon           | Usage                         |
|----------------|-------------------------------|
| `Home`         | Feed tab                      |
| `Search`       | Explore / search tab          |
| `Bell`         | Notifications tab             |
| `User`         | Profile tab                   |
| `PlusSquare`   | Create post (center FAB)      |
| `ChevronLeft`  | Back navigation               |
| `ChevronRight` | Forward / disclosure arrows   |
| `X`            | Close / dismiss               |
| `Menu`         | Hamburger / side menu         |

### Social (Feed)
| Icon           | Usage                         |
|----------------|-------------------------------|
| `Heart`        | Like (outline)                |
| `Heart` (fill) | Liked (filled)                |
| `MessageCircle`| Comment                       |
| `Repeat2`      | Repost / repost count         |
| `Bookmark`     | Bookmark (outline)            |
| `Bookmark` (fill)| Bookmarked (filled)         |
| `Share2`       | Share menu                    |
| `MoreHorizontal`| Post options menu            |

### Stories
| Icon           | Usage                         |
|----------------|-------------------------------|
| `Circle`       | Story ring (unviewed)         |
| `CheckCircle`  | Story ring (viewed)           |
| `Plus`         | Add new story                 |
| `Play`         | Video story indicator         |

### Profile
| Icon           | Usage                         |
|----------------|-------------------------------|
| `Settings`     | Settings                      |
| `Lock`         | Private account badge         |
| `ShieldCheck`  | Verified badge (accent color) |
| `LogOut`       | Logout                        |
| `Grid`         | Posts grid view               |
| `BookMarked`   | Saved / bookmarks tab         |
| `AtSign`       | Mentions                      |

### Create / Media
| Icon           | Usage                         |
|----------------|-------------------------------|
| `Image`        | Image upload                  |
| `Video`        | Video upload                  |
| `AlignLeft`    | Text post                     |
| `BarChart3`    | Poll creation                 |
| `MapPin`       | Location tag                  |
| `Smile`        | Emoji picker                  |
| `Camera`       | Camera capture                |

### Feedback & Status
| Icon           | Usage                         |
|----------------|-------------------------------|
| `AlertCircle`  | Error state                   |
| `CheckCircle`  | Success state                 |
| `AlertTriangle`| Warning state                 |
| `Info`         | Info / hint                   |
| `Loader`       | Loading spinner               |
| `RefreshCw`    | Pull to refresh               |

### Chat / Messaging
| Icon           | Usage                         |
|----------------|-------------------------------|
| `Send`         | Send message                  |
| `Paperclip`    | Attach file                   |
| `Image`        | Send photo                    |
| `Mic`          | Voice message                 |
| `Trash2`       | Delete message                |

### Admin / Moderation
| Icon           | Usage                         |
|----------------|-------------------------------|
| `Flag`         | Report content                |
| `Ban`          | Block user                    |
| `EyeOff`       | Mute / hide                   |
| `Shield`       | Admin tools                   |
| `Megaphone`    | Ad campaign / promoted post   |

## Usage Rules

- Use outline variants by default. Fill on active/toggled state.
- Keep icon color consistent with surrounding text (inherit `currentColor`).
- Never resize icons outside the defined scale. Use the nearest size.
- Pair icons with labels in tab bars and nav for accessibility.
