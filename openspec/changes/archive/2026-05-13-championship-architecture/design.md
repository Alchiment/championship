## Context

This is a greenfield project — no existing codebase. The system manages a community futsal tournament at K108 Roble (Colombian residential complex), themed around the FIFA World Cup 2026. The stakeholders are the tournament organizers (Consejo de Administración, Comité de Convivencia) who need to manage teams, schedules, and standings digitally instead of via spreadsheets. Residents need read-only access to view results.

The project will be deployed on Vercel (serverless) with Supabase as the PostgreSQL provider. Authentication goes through Meta WhatsApp Business Cloud API. The team roster is dynamic — teams can join or withdraw mid-tournament.

Current state: empty repository with docs, .gitignore, and OpenSpec scaffolding only.

## Goals / Non-Goals

**Goals:**
- Establish a production-ready RemixJS monolith with TypeScript, Prisma, and Tailwind
- Implement the complete domain model for tournament management (Tournament, Team, Player, Match, Standing)
- Build all public read-only views (standings, schedule, teams, match details, tournament info)
- Build all admin CRUD views (manage teams, record results, configure tournament)
- Implement WhatsApp-based authentication with role-based access
- Support dynamic team management (join/withdraw) with forfeit handling
- Implement computed standings with FIFA tiebreaker hierarchy
- Support optional playoff phase (semifinals + final) with configurable cutoff
- Deploy to Vercel with Supabase connection pooling

**Non-Goals:**
- Real-time live match updates (future consideration, not in scope)
- Multi-tenant tournament management (one tournament per deployment for now)
- Mobile native apps (web-only)
- Payment or registration flows
- 3rd place match logic (data model only, no UI/business logic)
- Internationalization (Spanish-language UI only for now)

## Decisions

### 1. RemixJS Monolith
**Decision**: Single Remix application serving both UI and API.
**Rationale**: Remix's server-side rendering works well for public read-heavy pages. Loader/actions pattern cleanly separates data fetching from rendering. No need for a separate API service — the tournament is small-scale.
**Alternatives considered**: Next.js (less server-side control), separate API + SPA (unnecessary complexity).

### 2. Prisma ORM with Supabase
**Decision**: Prisma connected to Supabase PostgreSQL with dual connection config.
**Rationale**: Prisma's type safety pairs well with OOP domain patterns (repository interfaces). Supabase provides managed PostgreSQL with a connection pooler, which is essential for Vercel's serverless functions.
**Config**: `DATABASE_URL` points to pooler (port 6543), `DIRECT_URL` points to direct connection (port 5432) for migrations.
**Alternatives considered**: Drizzle (less OOP-friendly, fewer features for schema management).

### 3. Meta WhatsApp Business Cloud API for Auth
**Decision**: Users authenticate by receiving a verification code via WhatsApp.
**Rationale**: The target audience (residents of K108 Roble) uses WhatsApp as their primary communication channel. This eliminates the need for email/password flows and feels native to the community.
**Implementation**: Server-side verification code generation, send via Meta API `/messages` endpoint, validate code on submission, create Remix cookie session.

### 4. Computed Standings (Value Object)
**Decision**: Standings are entirely computed from match results — never stored.
**Rationale**: Follows the "single data source" principle. Match results are the source of truth; standings derive from them. No sync issues, no stale data. Calculation is fast for a tournament of 8-12 teams.
**Implementation**: `CalculateStandings` use case iterates completed matches, aggregates per team, applies tiebreaker hierarchy, returns sorted array of `Standing` value objects.

### 5. Forfeit Model for Withdrawals
**Decision**: When a team withdraws, future matches become 3-0 forfeit wins for opponents. Past results are kept.
**Rationale**: This is the FIFA standard. It keeps standings comparable (every team plays the same number of matches). Voiding results unfairly penalizes opponents who earned points. Regenerating schedules creates unequal match counts.
**Implementation**: When Team status changes to WITHDRAWN, a background process converts all future SCHEDULED matches involving that team to COMPLETED with home/away scores set appropriately (3-0 favoring the opponent).

### 6. Tailwind CSS
**Decision**: Tailwind CSS for all styling, no custom CSS files.
**Rationale**: Remix integrates well with Tailwind. Utility classes pair naturally with the Container/Presentational pattern. No runtime CSS-in-JS overhead.
**Alternatives considered**: CSS Modules (less productive), Chakra UI (heavier dependency).

### 7. Repository Pattern for Data Access
**Decision**: All database access goes through repository classes behind interfaces. No direct Prisma calls in use cases or routes.
**Rationale**: Enforces the single data source principle. Makes domain logic testable without database. Follows dependency inversion from SOLID.
**Implementation**: `TeamRepository`, `MatchRepository`, `TournamentRepository` interfaces in domain layer, concrete implementations in infrastructure layer using Prisma.

### 8. Container/Presentational on Frontend
**Decision**: Container components handle Remix loaders/actions and state. Presentational components are pure UI with Tailwind.
**Rationale**: Clean separation of concerns. Presentational components are easily testable. Containers can be Remix route modules or wrapper components.

### 9. Playoff Configuration
**Decision**: Playoffs are optional and configurable per tournament. `playoffCutoff` determines how many teams advance (default: 4). `hasGroupPhase` enables/disables playoffs.
**Rationale**: The requirement explicitly says admins can enable/disable the group phase. A configurable cutoff makes the system flexible for different team counts.

### 10. Single Round-Robin Schedule
**Decision**: Each pair of teams plays exactly once. For N teams, this produces N×(N-1)/2 matches in N-1 rounds.
**Rationale**: Reduces match count compared to home-and-away. Appropriate for a community tournament over a limited time period.

## Risks / Trade-offs

**[WhatsApp API approval delay]** → Meta WhatsApp Business API requires template approval. Mitigation: Start API verification process early; have a fallback to simple SMS or email code for development.

**[Vercel cold starts affecting DB connections]** → Serverless functions can experience cold starts where Prisma needs to establish a connection. Mitigation: Supabase connection pooler (transaction mode on port 6543) handles this; also consider Prisma Accelerate if latency is an issue.

**[Schedule regeneration complexity on team join mid-league]** → Regenerating a schedule mid-tournament while preserving past results is algorithmically complex. Mitigation: Start with simpler rule (late joins only allowed in SETUP phase or between rounds with clear rules about missed matches counting as 0 points).

**[Tiebreaker with 3+ tied teams]** → Head-to-head tiebreakers become ambiguous when 3+ teams are tied (which H2H result?). Mitigation: For 3+ team ties, apply H2H among the tied group as a mini-league (points, then GD, then GF within just those matches).

**[Meta WhatsApp rate limits]** → Free tier is limited to 1K conversations/month. Mitigation: For a neighborhood tournament with ~50-100 users, this is more than sufficient.

## Migration Plan

1. **Phase 1: Scaffold** — Initialize Remix project, configure Prisma + Supabase, set up Tailwind, establish folder structure
2. **Phase 2: Database** — Define and migrate Prisma schema, seed initial tournament + admin user
3. **Phase 3: Domain** — Implement entities, value objects, repositories, use cases
4. **Phase 4: Auth** — Implement WhatsApp auth flow, session management, role-based access
5. **Phase 5: Public Views** — Build standings, schedule, teams, match detail pages
6. **Phase 6: Admin CRUD** — Build admin dashboard, team management, match result recording
7. **Phase 7: Playoffs** — Implement optional playoff phase with semifinal/final bracket generation

Rollback: Each phase is independently deployable. If playoffs cause issues, disable `hasGroupPhase` and the system falls back to league-only mode.

## Open Questions

- WhatsApp template: Should we use a pre-approved authentication template or create a custom one? (Depends on Meta's approval process in Colombia)
- Live updates: If tournaments want real-time score updates, we'll need WebSocket or SSE support in a future iteration
- Multi-tournament: Should the system support multiple tournaments per deployment, or is one tournament per instance acceptable for v1?

## Implementation Deviations

### Architecture: Repository pattern bypassed in routes
**Decision in spec**: All database access goes through repository classes behind interfaces. No direct Prisma calls in use cases or routes.

**Actual implementation**: 17/17 route files import `prisma` directly and make raw Prisma calls. The repository layer (`PrismaTeamRepository`, `PrismaMatchRepository`, `PrismaPlayerRepository`) and use case layer (`GenerateSchedule`, `WithdrawTeam`, `RecordMatchResult`, etc.) exist but are almost unused by routes. Only `_public.standings.tsx` uses repositories (via `CalculateStandings` use case). Admin routes have inline business logic with direct Prisma mutations, bypassing entity state machines (e.g., `admin.matches.tsx` reimplements schedule generation inline instead of using `GenerateSchedule`, and directly sets `tournament.status = "LEAGUE_PHASE"` instead of calling `Tournament.startLeague()`).

**Impact**: Routes are tightly coupled to Prisma, making it impossible to swap the data source, test routes in isolation, or enforce business rules through the domain layer.

### Playoff bracket incomplete
**Decision in spec**: Semifinal bracket followed by final match. Tournament transitions to COMPLETED after final.

**Actual implementation**: `GeneratePlayoffs` use case only creates semifinal matches. No trigger exists to detect when both semifinals complete and create the Final match. No logic transitions the tournament to COMPLETED after the final (or after all league matches when playoffs are disabled).

### Match lifecycle missing IN_PROGRESS
**Decision in spec**: Match status lifecycle is SCHEDULED → IN_PROGRESS → COMPLETED.

**Actual implementation**: The `Match.start()` entity method exists and the UI renders the "En juego" badge, but no admin action or route ever transitions a match to IN_PROGRESS. Matches always jump from SCHEDULED to COMPLETED when a result is recorded.

### Standings tie position numbering
**Decision in spec**: "Tied teams share the same position number, and the next position number is skipped accordingly."

**Actual implementation**: Positions are assigned as `i + 1` (sequential). Fully tied teams receive different position numbers instead of sharing the same one.

### Auth non-admin response
**Decision in spec**: "Non-admin user attempts admin access → redirect to public home page with unauthorized message."

**Actual implementation**: `requireAdmin()` throws a raw `Response(403)` instead of redirecting with a flash message.

### Player management UI missing
**Decision in spec**: "Admins can add/remove players and assign captains."

**Actual implementation**: Domain layer (`PlayerRepository`, `Player` entity) is fully implemented but no admin UI or route action exists for player CRUD operations.

### Mid-league schedule regeneration missing
**Decision in spec**: "Team joins during LEAGUE_PHASE → schedule is regenerated from current round onward."

**Actual implementation**: No logic exists for mid-league schedule regeneration. The `GenerateSchedule` use case only works from SETUP status.