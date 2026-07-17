# AppMass Color Palette

## Brand Colors

| Token              | Light     | Dark      | Usage                                    |
|--------------------|-----------|-----------|------------------------------------------|
| **Background**     | `#f4f3ee` | `#0f0f0f` | App background, base layer               |
| **Surface**        | `#ffffff` | `#1c1c1e` | Cards, modals, bottom sheets, inputs      |
| **Primary Text**   | `#1a1a1a` | `#f5f5f5` | Headlines, body copy, primary labels      |
| **Secondary Text** | `#6b7280` | `#9ca3af` | Captions, hints, timestamps, metadata     |
| **Accent**         | `#c15f3c` | `#d97a56` | CTAs, verified badges, links, highlights  |
| **Border**         | `#e5e7eb` | `#2c2c2e` | Dividers, input borders, card outlines    |
| **Error**          | `#ef4444` | `#f87171` | Validation errors, destructive actions    |
| **Success**        | `#22c55e` | `#4ade80` | Success states, confirmations             |
| **Warning**        | `#f59e0b` | `#fbbf24` | Warnings, pending states, ratings         |

## Semantic Aliases

```css
--color-bg:           #f4f3ee;
--color-surface:      #ffffff;
--color-text-primary: #1a1a1a;
--color-text-secondary: #6b7280;
--color-accent:       #c15f3c;
--color-border:       #e5e7eb;
--color-error:        #ef4444;
--color-success:      #22c55e;
--color-warning:      #f59e0b;
```

## Dark Mode

```css
--color-bg-dark:           #0f0f0f;
--color-surface-dark:      #1c1c1e;
--color-text-primary-dark: #f5f5f5;
--color-text-secondary-dark: #9ca3af;
--color-accent-dark:       #d97a56;
--color-border-dark:       #2c2c2e;
--color-error-dark:        #f87171;
--color-success-dark:      #4ade80;
--color-warning-dark:      #fbbf24;
```

## Usage Guidelines

- **Accent** is reserved for interactive elements and the verification badge. Use sparingly.
- **Surface** should always sit on **Background** with a subtle shadow or border to create depth.
- **Error / Success / Warning** are used exclusively for system feedback — not for decorative purposes.
- Dark mode surfaces use a warm off-black (`#0f0f0f`) rather than pure black to reduce eye strain.
