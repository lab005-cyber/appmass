# AppMass Typography

## Font Family

**Primary:** Poppins (weights 300, 400, 500, 600, 700)

```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

--font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
```

## Type Scale

| Size (px) | Line Height | Letter Spacing | Token                  |
|-----------|-------------|----------------|------------------------|
| 12        | 16px        | 0.4px          | `--text-caption`       |
| 14        | 20px        | 0.25px         | `--text-small`         |
| 16        | 24px        | 0px            | `--text-body`          |
| 18        | 26px        | 0px            | `--text-body-large`    |
| 20        | 28px        | -0.2px         | `--text-h4`            |
| 24        | 32px        | -0.4px         | `--text-h3`            |
| 30        | 38px        | -0.5px         | `--text-h2`            |
| 36        | 44px        | -0.6px         | `--text-h1`            |
| 48        | 56px        | -0.8px         | `--text-display`       |

## Usage

| Element      | Token              | Weight | Size | Notes                                   |
|-------------|--------------------|--------|------|-----------------------------------------|
| Display     | `--text-display`   | 700    | 48px | Splash screens, empty states, hero      |
| Heading 1   | `--text-h1`        | 700    | 36px | Screen titles                           |
| Heading 2   | `--text-h2`        | 600    | 30px | Section headers                         |
| Heading 3   | `--text-h3`        | 600    | 24px | Card titles, modal headers              |
| Heading 4   | `--text-h4`        | 600    | 20px | Subsection titles, list headers         |
| Body        | `--text-body`      | 400    | 16px | Default paragraph, feed text            |
| Body Large  | `--text-body-large`| 400    | 18px | Lead paragraphs, expanded content       |
| Small       | `--text-small`     | 400    | 14px | Secondary info, button text             |
| Caption     | `--text-caption`   | 400    | 12px | Timestamps, metadata, helper text       |
| Button      | `--text-body`      | 600    | 16px | Semibold weight, uppercase only CTA     |

## Responsive Scale

On screens < 480px, reduce display/h1/h2 by one step (e.g. h2 at 24px instead of 30px).
