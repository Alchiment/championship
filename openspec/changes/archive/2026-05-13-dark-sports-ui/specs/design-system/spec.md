## ADDED Requirements

### Requirement: Design token system
The system SHALL define semantic color tokens in `tailwind.config.ts` under `theme.extend.colors` using the following mapping: `base` → slate-950, `surface` → slate-900, `elevated` → slate-800, `inset` → slate-950/800, `accent` → amber scale (300-600), `primary` → slate-50, `secondary` → slate-400, `muted` → slate-500, `default` → slate-700 (for borders). These tokens SHALL be the ONLY way to reference colors in all component and route code.

#### Scenario: Developer uses design token in a component
- **WHEN** a developer writes a Tailwind class that references a color
- **THEN** they MUST use `bg-surface`, `text-primary`, `border-default`, `text-accent`, etc. instead of raw `bg-slate-900`, `text-slate-50`, `border-slate-700`, `text-amber-400`

#### Scenario: Design token consistency
- **WHEN** the design system color palette is updated
- **THEN** all components automatically reflect the change because they reference semantic tokens, not raw Tailwind color values

### Requirement: Base layer dark styles
The system SHALL set `color-scheme: dark` on the `<html>` element via `tailwind.css` base layer. The `<html>` and `<body>` elements SHALL use `bg-base text-primary` as base styles. Default interactive elements (links, focus rings) SHALL use amber accent colors.

#### Scenario: Browser dark mode support
- **WHEN** the app loads in any browser
- **THEN** scrollbars, form controls, and native UI elements render with dark styling because `color-scheme: dark` is applied globally

#### Scenario: Base text readability
- **WHEN** any page renders
- **THEN** the page background is slate-950 (`bg-base`) and default text is slate-50 (`text-primary`), producing a contrast ratio exceeding 15:1

### Requirement: Typography scale
The system SHALL define a consistent typography scale in `tailwind.config.ts` under `theme.extend.fontSize` if custom sizes are needed. Default sizes SHALL follow: H1 = text-2xl font-bold, H2 = text-xl font-semibold, H3 = text-lg font-medium, Body = text-sm font-normal, Caption = text-xs font-medium, Score = text-3xl font-bold (for match detail).

#### Scenario: Page heading consistency
- **WHEN** any page renders a main title
- **THEN** it uses `text-2xl font-bold text-primary` consistently across all routes

### Requirement: Status color system
The system SHALL use the following status color mapping: live/in-progress = emerald-400 with animated dot indicator, completed = emerald-500 text, scheduled = slate-500 text, withdrawn/error = red-400 text, success action = emerald-500, destructive action = red-500. Status indicators SHALL use a colored dot prefix (●) plus text label, not colored background pills.

#### Scenario: In-progress match display
- **WHEN** a match has status IN_PROGRESS
- **THEN** the match card displays an emerald-400 dot (●) with "En juego" text in emerald-400

#### Scenario: Completed match display
- **WHEN** a match has status COMPLETED
- **THEN** the score is displayed in `text-accent font-bold` (amber-400) with no status pill needed; the score itself indicates completion

#### Scenario: Scheduled match display
- **WHEN** a match has status SCHEDULED
- **THEN** the match card displays "vs" text in `text-muted` (slate-500)

### Requirement: Surface layering system
The system SHALL use three surface depth levels for visual hierarchy: `base` (slate-950) for page backgrounds, `surface` (slate-900) for cards and navigation bars, `elevated` (slate-800) for hover states, active items, and table header rows. Cards SHALL use `bg-surface border border-default rounded-xl` by default and `border-accent/30` or `border-l-2 border-accent` for highlighted elements.

#### Scenario: Default card appearance
- **WHEN** a MatchCard or TeamCard renders
- **THEN** it uses `bg-surface border border-default rounded-xl` with hover state transitioning to `hover:border-accent/30`

#### Scenario: Highlighted standings row
- **WHEN** a standings row is above the playoff cutoff line
- **THEN** it displays `border-l-2 border-accent` on the left side to indicate qualifying position