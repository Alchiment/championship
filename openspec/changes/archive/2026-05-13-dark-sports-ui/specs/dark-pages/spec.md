## ADDED Requirements

### Requirement: Home page dark layout
The home page (`_public.index.tsx`) SHALL render the TournamentInfo component within `max-w-5xl mx-auto px-4 py-8`. If no tournament exists, the "No hay torneo activo" message SHALL use `text-muted text-center`.

#### Scenario: Home page with tournament
- **WHEN** a user visits the home page and a tournament exists
- **THEN** the page renders with `bg-base` background and TournamentInfo component with dark styling

### Requirement: Standings page dark layout
The standings page (`_public.standings.tsx`) SHALL render the StandingsTable component within `max-w-5xl mx-auto px-4 py-8`. The page heading "Tabla de posiciones" SHALL use `text-2xl font-bold text-primary mb-6`.

#### Scenario: Standings page rendering
- **WHEN** a user navigates to the standings page
- **THEN** the page displays a heading and the standings table with dark theme, playoff cutoff indicator, and accent-colored points column

### Requirement: Schedule page dark layout
The schedule page (`_public.schedule.tsx`) SHALL display rounds in `space-y-8`. Each round section SHALL use `bg-surface border border-default rounded-xl p-5` with round heading "Jornada N" in `text-lg font-semibold text-primary mb-4`. Match cards SHALL be in `space-y-3` within each round.

#### Scenario: Schedule page with multiple rounds
- **WHEN** a user views the schedule page with 3 rounds
- **THEN** each round is a dark card containing match cards, with round names in slate-50 and matches spaced with space-y-3

### Requirement: Teams list page dark layout
The teams list page (`_public.teams.tsx`) SHALL display team cards in a `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`. The page heading "Equipos" SHALL use `text-2xl font-bold text-primary mb-6`.

#### Scenario: Teams grid rendering
- **WHEN** a user views the teams page with 8 teams
- **THEN** teams display in a responsive grid (1 column mobile, 2 columns tablet, 3 columns desktop) with each card using dark surface styling

### Requirement: Team detail page dark layout
The team detail page (`_public.team.$id.tsx`) SHALL render team info in a `bg-surface border border-default rounded-xl p-6` card. The player list SHALL use `bg-surface border border-default rounded-xl p-6` with `divide-y divide-default`. The match history SHALL use `bg-surface border border-default rounded-xl p-6`.

#### Scenario: Team detail page with captain
- **WHEN** a user views a team detail page
- **THEN** the team name displays prominently with flag, player list shows names with captain marked in amber text, and match history shows inline match results in dark card format

### Requirement: Match detail page dark layout
The match detail page (`_public.match.$id.tsx`) SHALL render in a full-width `bg-surface border border-default rounded-xl p-8 max-w-lg mx-auto` card centered on the page. Team flags SHALL display at `text-5xl`. Team names SHALL use `text-primary font-semibold`. The score for completed matches SHALL use `text-4xl font-bold text-accent`. Status indicators SHALL use the status color system. The round/phase label SHALL use `text-muted text-sm text-center`.

#### Scenario: Completed match detail page
- **WHEN** a user views a completed match detail page
- **THEN** the score "2 - 1" displays in large amber text (text-4xl), team flags at text-5xl, team names below each flag, and "Jornada 3 · Liga" at top in slate-500

### Requirement: Error pages dark layout
The ErrorBoundary in `root.tsx` SHALL use `bg-base` background with `bg-surface` error card and `text-primary` heading text. The 404 page (`$.tsx`) SHALL render a dark-themed not found view.

#### Scenario: 404 error display
- **WHEN** a user navigates to a non-existent route
- **THEN** the error page displays with dark background, centered card in `bg-surface`, "404" heading in `text-accent`, and message in `text-secondary`

### Requirement: Admin dashboard dark layout
The admin dashboard (`admin.index.tsx`) SHALL display stat cards in a `grid gap-6 sm:grid-cols-3` using `bg-surface border border-default rounded-xl p-6`. Stat labels SHALL use `text-muted text-sm font-medium uppercase`. Stat values SHALL use `text-3xl font-bold text-primary`.

#### Scenario: Dashboard with tournament
- **WHEN** an admin views the dashboard with an active tournament
- **THEN** three stat cards display (Estado, Equipos, Partidos) with dark surface backgrounds, amber-accented status text, and large numbers in slate-50

### Requirement: Admin match page dark layout
The admin matches page (`admin.matches.tsx`) SHALL display match groups in `bg-surface border border-default rounded-xl p-5` cards. Score input fields SHALL use `w-20 bg-inset border border-default text-center text-primary focus:border-accent focus:ring-1 focus:ring-accent/50 rounded-lg py-2`. Match rows SHALL use `divide-y divide-default`.

#### Scenario: Match score entry on dark theme
- **WHEN** an admin views the match page with scheduled matches
- **THEN** each match row shows teams with flags in slate-50 text, score inputs with dark backgrounds and amber focus rings, and a "Guardar" primary button in amber

### Requirement: Admin teams page dark layout
The admin teams page (`admin.teams.tsx`) SHALL display the team creation form in `bg-surface border border-default rounded-xl p-6`. The team table SHALL use `bg-surface border border-default rounded-xl overflow-hidden` with `bg-elevated` header and `divide-y divide-default` rows. Status badges SHALL use colored text on dark: ACTIVE = `text-emerald-400 bg-emerald-500/10`, WITHDRAWN = `text-red-400 bg-red-500/10`.

#### Scenario: Admin team list on dark theme
- **WHEN** an admin views the teams page
- **THEN** the team table renders with dark surface background, elevated header, and team rows in alternating dark tones with status colors visible against dark background