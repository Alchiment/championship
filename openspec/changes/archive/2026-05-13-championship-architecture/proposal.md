## Why

This is a greenfield project for managing a neighborhood futsal tournament ("Torneo de Fútbol Intertorres") at K108 Roble, themed as a warm-up to the FIFA World Cup 2026. There is no existing system — everything needs to be built from scratch: project scaffolding, database, domain logic, authentication, and UI. Starting now allows the tournament organizers to manage teams, schedules, and standings digitally instead of on paper or spreadsheets.

## What Changes

- **BREAKING**: New RemixJS monolith project from scratch (no prior code exists)
- Scaffold project with RemixJS + TypeScript + Prisma + Tailwind CSS
- Set up Supabase (PostgreSQL) database with connection pooling for Vercel serverless
- Implement domain entities: Tournament, Team, Player, Match with OOP and SOLID principles
- Implement dynamic team roster management (teams can join or withdraw mid-tournament)
- Implement single round-robin schedule generation for N teams
- Implement computed standings with FIFA-based tiebreaker hierarchy (GD → GF → H2H result → H2H GD)
- Implement optional group phase (semifinals + final), with optional 3rd-place match for future use
- Implement tournament lifecycle: SETUP → LEAGUE_PHASE → PLAYOFFS → COMPLETED
- Implement team withdrawal handling: past results kept, future matches become 3-0 forfeits
- Implement Meta WhatsApp Business API authentication with Remix cookie sessions
- Implement role-based access: admins get full CRUD, public users get read-only access
- Implement Facade pattern for HTTP isolation, Adapter pattern for data mapping, Container/Presentational for frontend
- Implement global error handling with user-friendly messages
- Deploy to Vercel with Supabase as the database provider

## Capabilities

### New Capabilities
- `tournament-management`: Tournament lifecycle, settings, and state transitions (SETUP, LEAGUE, PLAYOFFS, COMPLETED)
- `team-management`: Dynamic team roster with players, captain, and withdrawal handling
- `match-management`: Schedule generation (round-robin), match recording, forfeit handling on withdrawal
- `standings`: Computed positions table with FIFA tiebreaker hierarchy, real-time updates
- `playoffs`: Optional semifinal + final phase with configurable playoff cutoff
- `auth`: WhatsApp-based authentication via Meta Business API, cookie sessions, admin role differentiation
- `project-architecture`: RemixJS monolith setup, Prisma + Supabase, Tailwind, patterns (Facade, Adapter, Container/Presentational, Repository), folder structure

### Modified Capabilities
(none — this is a greenfield project)

## Impact

- **New codebase**: Entire project created from scratch under `app/`, `prisma/`, `tests/`
- **New dependencies**: RemixJS, Prisma, Tailwind CSS, Vitest, Testing Library
- **External services**: Supabase (PostgreSQL), Meta WhatsApp Business API, Vercel (deployment)
- **Infrastructure**: Connection pooling config (Prisma directUrl + pooler URL), CORS setup
- **No existing systems affected** — greenfield

## Implementation Status

### Completed
- Project scaffold (RemixJS, Tailwind, Prisma, Vitest, directory structure)
- Database schema (Tournament, Team, Player, Match, User, Organizer, Sponsor models)
- Error handling system (AppError, NotFoundError, ValidationError, AuthError + handler)
- Domain entities (Tournament, Team, Player, Match) and value objects (Standing)
- Domain use cases (CalculateStandings, GenerateSchedule, RecordMatchResult, WithdrawTeam, GeneratePlayoffs, CreateTournament, UpdateTournamentSettings)
- Infrastructure (Prisma client, all repository implementations, HTTP/API facades, WhatsApp auth, session auth)
- Adapters (team, match, tournament, standing)
- Auth routes (login, verify, logout, requireAdmin)
- Public routes (layout, home, standings, schedule, teams, match detail, team detail)
- UI components (StandingsTable, MatchCard, TeamCard, FlagBadge, TournamentInfo)
- Admin routes (dashboard, teams CRUD with withdrawal, matches with schedule generation and result recording, settings)
- API routes (GET teams/matches/standings, POST teams, PATCH matches, DELETE teams, auth middleware)
- Unit tests (CalculateStandings, GenerateSchedule, WithdrawTeam, GeneratePlayoffs, Tournament lifecycle)
- Deployment config (vercel.json, .env, Prisma schema)

### Known Gaps
- Routes bypass repository/use-case layer: 17/17 routes call Prisma directly instead of using domain use cases
- Player management UI missing: no admin interface to add/remove players or assign captains
- IN_PROGRESS match status unreachable: no UI to start a match, jumps straight to COMPLETED
- Schedule regeneration on mid-league team join not implemented
- No Final match creation after semifinals complete
- No automatic tournament COMPLETED transition after phase completion
- Standings position numbering doesn't handle ties (sequential instead of shared)
- Non-admin auth returns raw 403 instead of redirect with message
- No explicit CORS configuration