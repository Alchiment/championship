## ADDED Requirements

### Requirement: MatchCard dark styling
The MatchCard component SHALL use `bg-surface border border-default rounded-xl p-4` for its outer container. On hover, it SHALL transition to `hover:border-accent/30`. Team names SHALL use `text-primary font-medium`. The score for completed matches SHALL display in `text-accent font-bold text-xl`. In-progress status SHALL show an emerald-400 dot with "En juego" in `text-emerald-400`. Scheduled matches SHALL display "vs" in `text-muted`.

#### Scenario: Completed match card display
- **WHEN** a MatchCard renders a completed match
- **THEN** the score displays as "2 - 1" in amber-400 bold text-xl, team names in slate-50, and the card has `bg-surface border border-default rounded-xl`

#### Scenario: In-progress match card display
- **WHEN** a MatchCard renders an in-progress match
- **THEN** the center section displays an emerald-400 dot (●) with "En juego" text in emerald-400 instead of a score

#### Scenario: Scheduled match card display
- **WHEN** a MatchCard renders a scheduled match
- **THEN** the center section displays "vs" in slate-500 (text-muted) instead of a score

### Requirement: StandingsTable dark styling
The StandingsTable component SHALL use `bg-surface border border-default rounded-xl overflow-hidden` for the outer container. The header row SHALL use `bg-elevated text-muted text-xs uppercase`. Rows above the playoff cutoff SHALL have `border-l-2 border-accent` on the left. A playoff cutoff separator SHALL render as a row with `border-t-2 border-dashed border-accent/50` and "Corte de playoff" text. Withdrawn team rows SHALL use `opacity-60`. The points column SHALL use `text-accent font-bold`. Positive goal difference SHALL use `text-emerald-400`, negative SHALL use `text-red-400`.

#### Scenario: Standings with playoff cutoff
- **WHEN** a standings table renders with tournament `playoffCutoff` of 4 and 8 teams
- **THEN** teams ranked 1-4 have `border-l-2 border-accent` on the left, and a dashed amber separator line appears between positions 4 and 5 with "Corte de playoff" label

#### Scenario: Goal difference coloring
- **WHEN** a team has a positive goal difference of +3
- **THEN** the goal difference cell displays "+3" in `text-emerald-400`
- **WHEN** a team has a negative goal difference of -2
- **THEN** the goal difference cell displays "-2" in `text-red-400`

### Requirement: TeamCard dark styling
The TeamCard component SHALL use `bg-surface border border-default rounded-xl p-5` for its outer container, with `hover:border-accent/30 transition-colors`. The team flag emoji SHALL display at `text-4xl`. The team name SHALL use `text-primary font-semibold`. The team code SHALL use `text-muted text-sm`. Player count and captain SHALL use `text-secondary text-sm`. The WITHDRAWN badge SHALL use `bg-red-500/10 text-red-400 text-xs rounded px-2 py-0.5`.

#### Scenario: Active team card display
- **WHEN** a TeamCard renders an active team
- **THEN** it shows the flag emoji at text-4xl, team name in slate-50 font-semibold, code in slate-500, and player count in slate-400, with hover transitioning border to amber

### Requirement: FlagBadge dark styling
The FlagBadge component SHALL display the flag emoji at `text-xl` and the country code in `text-muted text-xs`. The badge SHALL use `inline-flex items-center gap-1`.

#### Scenario: Flag badge in standings table
- **WHEN** a FlagBadge renders within the standings table
- **THEN** it displays the flag emoji followed by the country code in slate-500, horizontally spaced with gap-1

### Requirement: TournamentInfo dark styling
The TournamentInfo component SHALL use `bg-surface border border-default rounded-xl` for each card section. The tournament name SHALL use `text-xl font-bold text-primary`. The venue SHALL use `text-secondary`. The status badge SHALL use color-coded text: SETUP = `text-amber-400`, LEAGUE_PHASE = `text-emerald-400`, PLAYOFFS = `text-emerald-300`, COMPLETED = `text-muted`. Section headings SHALL use `text-secondary font-semibold text-lg`.

#### Scenario: Tournament with league phase status
- **WHEN** tournament status is LEAGUE_PHASE
- **THEN** the status badge displays "Fase de Liga" in emerald-400 text with an emerald dot indicator