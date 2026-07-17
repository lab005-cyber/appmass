# AppMass Spacing System

## Base Unit: 4px

All spacing values are multiples of 4px for consistent vertical and horizontal rhythm.

## Spacing Scale

| Token           | Pixels | Mental Model      |
|-----------------|--------|-------------------|
| `--space-1`     | 4px    | Tight inset       |
| `--space-2`     | 8px    | Dense gap         |
| `--space-3`     | 12px   | Compact padding   |
| `--space-4`     | 16px   | Standard gap      |
| `--space-5`     | 20px   | Comfortable       |
| `--space-6`     | 24px   | Section spacing   |
| `--space-8`     | 32px   | Card padding      |
| `--space-10`    | 40px   | Screen margins    |
| `--space-12`    | 48px   | Large sections    |
| `--space-16`    | 64px   | Page-level gaps   |

## Usage Guidelines

### Margin

- **Horizontal page margins:** `--space-10` (40px) on mobile, `--space-16` (64px) on tablet+
- **Between sections:** `--space-12` (48px)
- **Between related components:** `--space-6` (24px)

### Padding

- **Card inner padding:** `--space-8` (32px)
- **Button horizontal padding:** `--space-6` (24px)
- **Button vertical padding:** `--space-3` (12px)
- **Input field padding:** `--space-4` (16px) horizontal, `--space-3` (12px) vertical
- **Modal inner padding:** `--space-10` (40px)

### Gap (Flex / Grid)

- **Feed item spacing:** `--space-5` (20px)
- **Tab bar items:** `--space-2` (8px)
- **Form field groups:** `--space-6` (24px)
- **Avatar stacks:** `--space-1` (4px) negative overlap

## Density

| Context     | Scale  | Usage                      |
|-------------|--------|----------------------------|
| Default     | 4px    | Standard UI                 |
| Compact     | 2px    | Dense feeds, comment lists  |
| Comfortable | 6px    | Reading-focused views       |
