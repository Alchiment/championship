## Why

The current UI uses a generic gray/white Tailwind palette that looks like a wireframe. For a family tournament app where spectators check live scores on their phones, the interface needs to feel premium, instantly readable, and visually engaging. A dark sports-themed aesthetic (inspired by FotMob, SofaScore, and FIFA companion apps) will make scores pop, create visual hierarchy, and give the app a distinct identity that non-tech users can navigate intuitively.

## What Changes

- **Replace the entire color system** from white/gray to a dark slate palette with amber/gold accents for highlights and scores
- **Redesign all UI components** (MatchCard, StandingsTable, TeamCard, FlagBadge, TournamentInfo) with dark surface layering, accent borders, and status dot indicators
- **Redesign public layout navigation** from a basic top nav to a responsive layout with bottom tab bar on mobile, top tabs on desktop, with active tab indicators in amber
- **Redesign admin layout** with a dark theme matching the public side, mobile-friendly horizontal tabs instead of a fixed sidebar
- **Redesign all page-level views** (home, standings, schedule, match detail, team detail, teams list, login, verify) with the new dark design system
- **Style all forms** (admin settings, team creation, match score entry, login/verify) with dark inputs, amber focus rings, and proper color-scheme: dark
- **Add responsive bottom tab navigation** for mobile public pages
- **Add playoff cutoff visual indicator** in the standings table
- **Update root layout and ErrorBoundary** to match the dark theme
- **Update tailwind.config.ts** with custom theme tokens (colors, spacing, typography scale)
- **Update tailwind.css** with base layer dark styles and custom utilities

## Capabilities

### New Capabilities
- `design-system`: Dark sports-themed design tokens, color palette, typography scale, spacing, and component patterns
- `dark-layout`: Responsive navigation and page layouts for both public and admin contexts, including bottom tab bar for mobile
- `dark-components`: Restyled UI components (MatchCard, StandingsTable, TeamCard, FlagBadge, TournamentInfo) with dark surfaces, amber accents, and status indicators
- `dark-forms`: Dark-themed form inputs, buttons, and interactive elements with proper color-scheme support and amber focus rings
- `dark-pages`: Page-level composition for all routes (home, standings, schedule, match detail, team detail, teams, login, verify) using the new design system

### Modified Capabilities
- `match-management`: Visual presentation of match list and score entry changes from light to dark theme with amber-accented scores and status indicators
- `standings`: Table presentation changes to dark surface with accent-highlighted positions, playoff cutoff indicator, and amber points column
- `team-management`: Team cards and team detail pages adopt dark surface styling with flag/name hierarchies
- `tournament-management`: Dashboard and settings pages adopt dark theme; inline score entry forms use dark inputs
- `auth`: Login and verify pages adopt dark theme with contained card panel on dark background

## Impact

- **All UI files**: Every component and route file under `app/components/` and `app/routes/` will be modified
- **tailwind.config.ts**: Extended with custom color tokens and theme configuration
- **tailwind.css**: Base layer styles for dark defaults
- **root.tsx**: Layout and ErrorBoundary updated
- **No backend changes**: This is purely a visual/UX change with no data model or API modifications
- **No new dependencies**: Uses existing Tailwind CSS v3 utility classes