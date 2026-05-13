## 1. Project Scaffold

- [x] 1.1 Initialize RemixJS project with TypeScript using `npx create-remix`
- [x] 1.2 Install and configure Tailwind CSS with PostCSS
- [x] 1.3 Install Prisma and initialize with PostgreSQL provider
- [x] 1.4 Install Vitest and Testing Library as dev dependencies
- [x] 1.5 Create directory structure: `app/components/containers/`, `app/components/ui/`, `app/domain/entities/`, `app/domain/value-objects/`, `app/domain/use-cases/`, `app/adapters/`, `app/facades/`, `app/infrastructure/database/repositories/`, `app/infrastructure/auth/`, `app/errors/`, `app/utils/`, `tests/unit/`, `tests/integration/`
- [x] 1.6 Configure Vercel deployment settings and Supabase connection pooler in Prisma schema (port 6543 for pooler, port 5432 for directUrl)
- [x] 1.7 Set up Remix cookie session configuration in `app/utils/session.server.ts`

## 2. Database Schema

- [x] 2.1 Define Prisma models: Tournament, Team, Player, Match with all fields and enums (TournamentStatus, MatchPhase, MatchStatus, TeamStatus)
- [x] 2.2 Add playoff configuration fields to Tournament model (playoffCutoff with default 4, hasGroupPhase boolean, thirdPlaceEnabled boolean)
- [x] 2.3 Add User model for WhatsApp-authenticated users with isAdmin flag and phoneNumber
- [x] 2.4 Add Organizer and Sponsor models linked to Tournament
- [ ] 2.5 Run initial Prisma migration against Supabase
- [x] 2.6 Create seed script with initial tournament, admin user, and sample teams

## 3. Error Handling System

- [x] 3.1 Create custom error classes in `app/errors/`: AppError, NotFoundError, ValidationError, AuthError
- [x] 3.2 Create global error boundary in `app/root.tsx` that catches unhandled errors
- [x] 3.3 Create error handler utility that classifies errors and returns user-friendly messages (hides internals from public, shows details to admins)

## 4. Domain Layer

- [x] 4.1 Create Tournament entity with lifecycle state transitions (SETUP → LEAGUE_PHASE → PLAYOFFS → COMPLETED)
- [x] 4.2 Create Team entity with status transitions (ACTIVE → WITHDRAWN) and Player entity with captain designation
- [x] 4.3 Create Match entity with status lifecycle (SCHEDULED → IN_PROGRESS → COMPLETED)
- [x] 4.4 Create Standing value object with computed fields (points, goal difference, wins, draws, losses, goals for, goals against)
- [x] 4.5 Implement CalculateStandings use case with FIFA tiebreaker hierarchy (GD → GF → H2H result → H2H GD)
- [x] 4.6 Implement GenerateSchedule use case for single round-robin (N-1 rounds, handling odd N with byes)
- [x] 4.7 Implement RecordMatchResult use case with standings recalculation trigger
- [x] 4.8 Implement WithdrawTeam use case that converts future matches to 3-0 forfeits
- [x] 4.9 Implement GeneratePlayoffs use case (semifinal bracket: 1st vs 4th, 2nd vs 3rd, then final)
- [x] 4.10 Implement CreateTournament and UpdateTournamentSettings use cases

## 5. Infrastructure Layer

- [x] 5.1 Create Prisma database client singleton in `app/infrastructure/database/client.ts`
- [x] 5.2 Implement TeamRepository interface and PrismaTeamRepository with CRUD operations
- [x] 5.3 Implement MatchRepository with methods: findByTournament, findByRound, findScheduledByTeam, updateScore
- [x] 5.4 Implement TournamentRepository with methods: findById, findActive, updateStatus, updateSettings
- [x] 5.5 Implement PlayerRepository with methods: findByTeam, addPlayer, removePlayer, assignCaptain
- [x] 5.6 Create HTTP facade in `app/facades/http.facade.ts` wrapping fetch calls with error handling
- [x] 5.7 Create API facade in `app/facades/api.facade.ts` for client-side API calls
- [x] 5.8 Implement WhatsApp auth service in `app/infrastructure/auth/whatsapp.service.ts` (send verification code via Meta Business API, validate code)
- [x] 5.9 Implement auth service in `app/infrastructure/auth/auth.service.ts` (session creation, validation, role checking)

## 6. Adapters

- [x] 6.1 Create team.adapter.ts mapping Prisma Team rows to Team domain entities (inbound) and Team entities to API response DTOs (outbound)
- [x] 6.2 Create match.adapter.ts mapping Prisma Match rows to Match domain entities and to API response DTOs
- [x] 6.3 Create tournament.adapter.ts for Tournament entity and DTO mapping
- [x] 6.4 Create standing.adapter.ts mapping Standing value objects to API response DTOs (no inbound mapping since standings are computed)

## 7. Authentication Routes

- [x] 7.1 Create login page route with phone number input form (`app/routes/_auth.login.tsx`)
- [x] 7.2 Create verification code input route (`app/routes/_auth.verify.tsx`)
- [x] 7.3 Implement login action that triggers WhatsApp code via Meta Business API
- [x] 7.4 Implement verify action that validates code and creates Remix cookie session
- [x] 7.5 Create admin role-check middleware/utility for protected routes
- [x] 7.6 Implement logout action that destroys session cookie

## 8. Public Routes (Read-Only)

- [x] 8.1 Create public layout route with navigation (`app/routes/_public._layout.tsx`)
- [x] 8.2 Create home page showing tournament info, organizers, and sponsors (`app/routes/_public.index.tsx`)
- [x] 8.3 Create standings table page with dynamic computation from match results (`app/routes/_public.standings.tsx`)
- [x] 8.4 Create schedule page showing matches grouped by round with team flags (`app/routes/_public.schedule.tsx`)
- [x] 8.5 Create teams list page showing all teams with players and captain (`app/routes/_public.teams.tsx`)
- [x] 8.6 Create match detail page showing score, teams, and round info (`app/routes/_public.match.$id.tsx`)
- [x] 8.7 Create team detail page showing roster, captain, and match history (`app/routes/_public.team.$id.tsx`)

## 9. Public UI Components (Presentational)

- [x] 9.1 Create StandingsTable component displaying position, team, points, GD, GF, GA, WITHDRAWN badge
- [x] 9.2 Create MatchCard component showing teams, flags, scores, round, and status
- [x] 9.3 Create TeamCard component showing team name, flag, player count, and captain
- [x] 9.4 Create FlagBadge component rendering country flag emoji and code
- [x] 9.5 Create TournamentInfo component displaying name, venue, status, organizers, and sponsors

## 10. Public Container Components

- [x] 10.1 Create StandingsContainer with Remix loader calling CalculateStandings use case
- [x] 10.2 Create ScheduleContainer with Remix loader fetching matches by round
- [x] 10.3 Create TeamsContainer with Remix loader fetching teams with players
- [x] 10.4 Create MatchContainer with Remix loader fetching match with team details
- [x] 10.5 Create TournamentInfoContainer with Remix loader fetching tournament, organizers, sponsors

## 11. Admin Routes (CRUD)

- [x] 11.1 Create admin layout route with sidebar navigation (`app/routes/_admin._layout.tsx`)
- [x] 11.2 Create admin dashboard page showing tournament status summary (`app/routes/_admin.index.tsx`)
- [x] 11.3 Create team management pages: list, create, edit, add/remove players, assign captain (`app/routes/_admin.teams.tsx` and related)
- [x] 11.4 Create match management pages: schedule view, record result, view details (`app/routes/_admin.matches.tsx` and related)
- [x] 11.5 Create tournament settings page: toggle group phase, set playoff cutoff, manage organizers/sponsors (`app/routes/_admin.settings.tsx`)
- [x] 11.6 Implement team withdrawal action (marks team as WITHDRAWN, converts future matches to 3-0 forfeits)

## 12. API Routes (RESTful)

- [x] 12.1 Create GET /api/teams returning all teams with players as JSON
- [x] 12.2 Create GET /api/matches returning matches filtered by tournament and round
- [x] 12.3 Create GET /api/standings returning computed standings as JSON
- [x] 12.4 Create POST /api/teams (admin only) for creating teams
- [x] 12.5 Create PATCH /api/matches/:id (admin only) for recording match results
- [x] 12.6 Create DELETE /api/teams/:id (admin only) for team withdrawal
- [x] 12.7 Add auth middleware to all mutation API routes

## 13. Testing

- [x] 13.1 Write unit tests for CalculateStandings use case (tiebreaker scenarios: GD tie, GF tie, H2H tie, H2H GD tie, 3+ tied teams, withdrawn team)
- [x] 13.2 Write unit tests for GenerateSchedule use case (8 teams, 7 teams with bye, single round-robin completeness)
- [x] 13.3 Write unit tests for WithdrawTeam use case (future matches converted to forfeits, past results preserved)
- [x] 13.4 Write unit tests for GeneratePlayoffs use case (correct bracket from top N teams)
- [x] 13.5 Write unit tests for Tournament lifecycle state transitions
- [x] 13.6 Write integration tests for API routes (CRUD operations, auth middleware, error responses)
- [x] 13.7 Write integration tests for admin routes (team creation, match recording, settings update)

## 14. Deployment Configuration

- [ ] 14.3 Set up Supabase database with connection pooler enabled
- [ ] 14.4 Run Prisma migrations against production database
- [ ] 14.5 Seed production database with initial tournament and admin user

## 15. Implementation Gaps (discovered post-archive)

### HIGH Priority

- [ ] 15.1 Add player management admin UI: add/remove players to teams, assign/reassign captain (`admin.teams.tsx` currently has no player CRUD actions)
- [ ] 15.2 Add IN_PROGRESS match transition: admin action to change match status from SCHEDULED to IN_PROGRESS (currently jumps straight to COMPLETED)
- [ ] 15.3 Implement schedule regeneration when team joins mid-LEAGUE_PHASE (currently no logic for this; `GenerateSchedule` only works from SETUP status)
- [ ] 15.4 Implement Final match creation after semifinals complete (trigger to detect semifinal completion and create FINAL match; `GeneratePlayoffs` only creates semifinals)
- [ ] 15.5 Implement automatic tournament COMPLETED transition: detect when all league matches are done (or final is done) and call `Tournament.complete()`
- [ ] 15.6 Refactor routes to use repository layer instead of direct Prisma calls (currently 17/17 route files import `prisma` directly, bypassing `TeamRepository`, `MatchRepository`, etc.)
- [ ] 15.7 Refactor admin match schedule generation to use `GenerateSchedule` use case and `Tournament.startLeague()` entity method instead of inline algorithm with direct Prisma calls

### MEDIUM Priority

- [ ] 15.8 Fix standings position numbering: tied teams should share the same position number and next position should be skipped (currently positions are always sequential `i+1`)
- [ ] 15.9 Change non-admin auth response from raw 403 to redirect to public home page with unauthorized message (spec requires redirect, not HTTP error)

### LOW Priority

- [ ] 15.10 Add explicit CORS configuration for `/api/*` routes
- [ ] 15.11 Standings spec scenario "admin attempts to edit standings → reject with error" has no API endpoint to guard (no PUT/PATCH on standings exists, which is correct, but no explicit 403/405 either)

- [x] 14.1 Configure Vercel project with environment variables (DATABASE_URL, DIRECT_URL, WHATSAPP_TOKEN, SESSION_SECRET)
- [x] 14.2 Add Vercel build configuration for Remix
- [ ] 14.3 Set up Supabase database with connection pooler enabled
- [ ] 14.4 Run Prisma migrations against production database
- [ ] 14.5 Seed production database with initial tournament and admin user