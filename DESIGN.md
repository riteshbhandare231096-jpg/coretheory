# Design Brief

## Direction
Premium fitness platform with dark-mode-first aesthetic. Athletic, energetic, refined — not aggressive gym culture. Focus on accessibility, clear hierarchy, and YouTube-integrated exercise demonstrations.

## Tone
Professional athlete lifestyle brand. Energetic but controlled. Sophisticated, not hype-driven.

## Palette

| Token | Light (L C H) | Dark (L C H) | Purpose |
| --- | --- | --- | --- |
| Background | 0.98 0 0 | 0.12 0 0 | Page background |
| Foreground | 0.15 0 0 | 0.95 0 0 | Text primary |
| Card | 0.96 0 0 | 0.16 0 0 | Card/elevated surface |
| Primary | 0.62 0.25 178 | 0.72 0.24 178 | Teal — CTAs, active states |
| Secondary | 0.89 0.12 70 | 0.70 0.15 70 | Warm amber — intermediate difficulty |
| Accent | 0.65 0.22 145 | 0.72 0.24 145 | Teal accent — highlights, tags |
| Destructive | 0.55 0.22 25 | 0.65 0.19 22 | Red — advanced difficulty, warnings |
| Border | 0.88 0 0 | 0.24 0 0 | Subtle dividers |
| Muted | 0.92 0 0 | 0.24 0 0 | Disabled, secondary text |

## Difficulty Badges
- **Beginner**: green-50/green-950 (light/dark), border green-200/green-800
- **Intermediate**: amber-50/amber-950 (light/dark), border amber-200/amber-800
- **Advanced**: red-50/red-950 (light/dark), border red-200/red-800

## Typography

| Layer | Font | Size | Weight | Usage |
| --- | --- | --- | --- | --- |
| Display | Bricolage Grotesque | 2.25–3.5rem | 700–900 | Hero, page titles, section headers |
| Body | DM Sans | 0.875–1.125rem | 400–600 | Exercise descriptions, nav, body copy |
| Mono | Geist Mono | 0.75–0.875rem | 400–700 | Stats, duration, reps, technical labels |

## Shape Language
- Card radius: `rounded-lg` (0.625rem)
- Buttons: `rounded-lg`
- Badges: `rounded-full`
- No sharp corners; all interactive elements smoothly rounded

## Structural Zones

| Zone | Background | Border | Shadow | Notes |
| --- | --- | --- | --- | --- |
| Header | `bg-card` with `border-b` | `border-border` | `shadow-subtle` | Logo, nav, dark/light toggle |
| Hero (New) | `hero-gradient` (primary→accent) | None | None | Full-width value prop, three pillars explanation, text-gradient accent |
| Metric Dashboard (New) | `bg-background` | None | None | Card grid (1/2/3 col), each card: `bg-card` with `border-border` and `shadow-subtle` hover |
| TDEE Calculator (New) | `bg-background` | None | None | Form inputs left, results card right (`bg-card` border-border shadow-subtle) |
| Science Articles (New) | `bg-background` | None | None | Article cards grid (3/2/1 col): `bg-card` border-border `shadow-elevated` on hover |
| Content Grid | `bg-background` | None | None | Light/dark-appropriate background |
| Exercise Cards | `bg-card` | `border-border` | `shadow-elevated` on hover | Thumbnail, title, difficulty, tags, play-icon overlay |
| Footer | `bg-card` with `border-t` | `border-border` | `shadow-subtle` | Muted text, links, credit |
| Modal/Popover | `bg-popover` | `border-border` | `shadow-elevated` | Exercise detail modal, filter panel |

## Component Patterns

| Component | Layout | Notes |
| --- | --- | --- |
| Hero (New) | Full-width gradient (primary→accent) | Headline explaining three pillars + CTA, text-gradient accent, responsive stacked mobile |
| Metric Dashboard (New) | 3-col desktop grid (1 mobile, 2 tablet) | Card-based with sparkline trends, weight/body-fat/PRs, toggle metric units |
| TDEE Calculator (New) | 2-col desktop (stacked mobile) | Form left, results card right, macro split bars, copy/export |
| Science Articles (New) | 3-col editorial grid (1 mobile, 2 tablet) | Article cards with 3:2 thumbnail, category tags, hover scale+shadow, filterable by category |
| Exercise Cards | 16:9 thumbnail with play-icon overlay | Difficulty badge, 2–3 tags, smooth hover: scale(1.02) + shadow elevation |
| Navigation & Filtering | Sticky horizontal pill filter | Active: `bg-primary`, inactive: `bg-muted`, search with icon |
| Video Embed | YouTube iframe, 16:9 aspect ratio | Modal overlay on exercise card click |

## Motion & Interaction
Smooth transitions (0.3s easing); card hover: scale(1.02) + shadow lift; chart animations fade + sparkline reveal (0.6s); article hover: scale(1.02) + shadow. No bounce.

## Responsive Breakpoints
Mobile <640px (1 col); Tablet 640–1024px (2 col); Desktop >1024px (3–4 col grid).

## Dark Mode
Class-based toggle (`.dark` on `<html>`); all OKLCH tuned for dark readability; persistent localStorage preference.

## Constraints
No full-page gradients (hero only). No neon. Max 3 body text sizes. Focus-visible rings. Actual image previews or solid fallback.

## Signature Detail
Gradient hero (three pillars) + metric sparkline trends + editorial science articles (category-filtered) establish athletic authority through refined hierarchy and no hype.

## Accessibility
WCAG AA contrast both modes; semantic HTML + keyboard nav; focus visible (ring-primary); labels + alt text; form validation in place.
