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
| Hero | `bg-gradient-to-r` (primary→accent) | None | None | Full-width tagline + CTA, text-gradient accent |
| Content Grid | `bg-background` | None | None | Light/dark-appropriate background |
| Exercise Cards | `bg-card` | `border-border` | `shadow-elevated` on hover | Thumbnail, title, difficulty, tags, play-icon overlay |
| Footer | `bg-card` with `border-t` | `border-border` | `shadow-subtle` | Muted text, links, credit |
| Modal/Popover | `bg-popover` | `border-border` | `shadow-elevated` | Exercise detail modal, filter panel |

## Component Patterns

### Exercise Cards
- Aspect ratio 16:9 thumbnail with play-icon overlay (appears on hover)
- Title, difficulty badge, 2–3 category tags below thumbnail
- Smooth hover: scale(1.02), shadow elevation, icon fade-in
- Tag colors: primary (teal) for active category, muted for inactive

### Difficulty System
- Color-coded badges with semantic borders and backgrounds
- Inline with exercise title or in dedicated row
- Icon + text: "Beginner" / "Intermediate" / "Advanced"

### Navigation & Filtering
- Sticky header with category pills (horizontal scroll on mobile)
- Active category: `bg-primary` text-white, inactive: `bg-muted` text-muted-foreground
- Search bar with debounce, icon-prefixed input

### Video Embed
- YouTube iframe with standard player controls
- Width: 100%, maintains 16:9 aspect ratio
- Modal overlay on exercise card click

## Motion & Interaction
- Transitions: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (smooth easing)
- Hover states: card scale(1.02) + shadow elevation, button opacity/color shift
- Icon animations: fade-in (0.4s), slide-up (0.4s) on load
- No bouncy or jarring animations; all movement refined

## Responsive Breakpoints
- Mobile: <640px (stacked layout, 1 column)
- Tablet: 640px–1024px (2 column grid)
- Desktop: >1024px (3–4 column grid, sidebar navigation)

## Dark Mode
- Class-based toggle: `.dark` applied to `<html>` element
- All OKLCH values tuned for readability in dark mode (L increased for foreground, decreased for background)
- Persistent preference stored in localStorage

## Constraints
- No full-page gradients; use accents only on hero or CTAs
- No neon or glow effects; prefer depth via shadows
- No more than 3 font sizes for body text (regular, sm, lg)
- All interactive elements have clear focus states (`:focus-visible`)
- Video thumbnails use actual YouTube preview images or solid fallback

## Signature Detail
**Color-coded difficulty rings + play-icon overlay.** When hovering over an exercise card, the play icon fades in center-aligned on the thumbnail, and the card lifts with elevated shadow. The difficulty badge remains anchored below, creating a clear visual hierarchy that emphasizes difficulty level and encourages click-through to watch the exercise demonstration.

## Accessibility
- WCAG AA contrast maintained in both light and dark modes
- All interactive elements keyboard-navigable (tabindex=0)
- Semantic HTML: `<button>`, `<a>`, `<section>`, `<article>` for screen readers
- Form labels always paired with inputs
- Focus indicators visible (ring-primary on focus-visible)
- Alt text for all images, YouTube iframe titles
