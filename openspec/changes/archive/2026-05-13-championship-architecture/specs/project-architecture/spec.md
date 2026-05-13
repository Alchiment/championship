## ADDED Requirements

### Requirement: RemixJS monolith project structure
The system SHALL be implemented as a RemixJS monolith with TypeScript. The project MUST follow the folder structure with clear separation: `app/routes/` for HTTP routing, `app/components/` for UI, `app/domain/` for business logic, `app/adapters/` for data mapping, `app/facades/` for HTTP isolation, `app/infrastructure/` for external services, and `app/errors/` for global error handling.

#### Scenario: Project follows directory structure
- **WHEN** the project is initialized
- **THEN** it contains directories for routes (public, admin, API), components (containers and ui), domain (entities, value-objects, use-cases), adapters, facades, infrastructure, errors, and utils

### Requirement: SOLID and OOP principles
The system SHALL follow SOLID principles and object-oriented design. Domain entities encapsulate business rules. Use cases represent application operations. Dependencies flow inward (infrastructure depends on domain, not the reverse).

#### Scenario: Business logic in domain layer
- **WHEN** a use case calculates standings or generates a schedule
- **THEN** the logic resides in `app/domain/use-cases/` and depends only on domain entities and interfaces, not on infrastructure or framework code

### Requirement: Facade pattern for HTTP isolation
The system SHALL use a Facade pattern to isolate HTTP library usage. All external HTTP calls (including API calls from the client) go through a centralized facade, making it possible to swap the HTTP implementation without affecting business logic.

#### Scenario: HTTP calls go through facade
- **WHEN** the application makes an HTTP request (e.g., to the WhatsApp API)
- **THEN** the request goes through the HTTP facade in `app/facades/http.facade.ts`, not directly via fetch or axios

### Requirement: Adapter pattern for data mapping
The system SHALL use the Adapter pattern to map data between layers. Data from the database is adapted (inbound) to domain entities before reaching business logic. Data from domain entities is adapted (outbound) to API responses before reaching the client.

#### Scenario: Database row adapted to domain entity
- **WHEN** a team record is fetched from the database
- **THEN** it passes through `team.adapter.ts` which maps Prisma fields to the Team domain entity before returning it to the use case

#### Scenario: Domain entity adapted to API response
- **WHEN** a match result use case returns a domain entity
- **THEN** it passes through the match adapter which maps it to a clean API response DTO before sending it to the client

### Requirement: Container/Presentational pattern on frontend
The system SHALL use the Container/Presentational pattern in the frontend. Container components handle data fetching and business logic. Presentational components receive data via props and render UI exclusively. Container components com Remix loaders for server-side data.

#### Scenario: Standings page structure
- **WHEN** the standings page is implemented
- **THEN** a StandingsContainer fetches data via Remix loader and passes it to StandingsTable (presentational) which renders the table with Tailwind styles

### Requirement: RESTful API design
The system SHALL expose RESTful API routes under `/api/` for resource operations. API routes follow conventional REST conventions: GET for reads, POST for creates, PUT/PATCH for updates, DELETE for removals. API routes return JSON responses.

#### Scenario: API route for teams
- **WHEN** a client sends GET /api/teams
- **THEN** the system returns a JSON array of teams with appropriate HTTP status codes

#### Scenario: API route for match results
- **WHEN** an admin sends PATCH /api/matches/:id with score data
- **THEN** the system validates the request, records the result, and returns the updated match as JSON

### Requirement: Global error handling
The system SHALL implement a global error boundary that catches all unhandled errors and displays user-friendly error messages. Custom error types (AppError, NotFoundError, ValidationError, AuthError) SHALL be used to classify errors. The error boundary MUST hide internal details from public users while providing useful information for admins.

#### Scenario: Public user encounters server error
- **WHEN** an unhandled error occurs during a public page request
- **THEN** the user sees a friendly message like "Something went wrong. Please try again later" with no stack traces or internal details

#### Scenario: Admin encounters validation error
- **WHEN** an admin submits invalid data and a ValidationError is thrown
- **THEN** the admin sees specific field-level validation messages to help fix the input

### Requirement: Prisma ORM with Supabase PostgreSQL
The system SHALL use Prisma as the ORM connected to a Supabase PostgreSQL database. The Prisma config MUST use connection pooling (port 6543) for runtime queries and a direct connection (port 5432) for migrations, to support Vercel serverless deployment.

#### Scenario: Database connection in serverless
- **WHEN** the application runs on Vercel and makes a database query
- **THEN** Prisma connects through the Supabase connection pooler (port 6543) to avoid connection exhaustion

### Requirement: Tailwind CSS for styling
The system SHALL use Tailwind CSS for all UI styling. No custom CSS files or CSS-in-JS libraries. Container and presentational components both use Tailwind utility classes.

#### Scenario: Styling a component
- **WHEN** a developer styles a new presentational component
- **THEN** they use only Tailwind utility classes in the component's className prop

### Requirement: Vitest for testing
The system SHALL use Vitest as the test runner and Testing Library for component tests. Domain logic MUST have unit tests. API routes MUST have integration tests.

#### Scenario: Running tests
- **WHEN** a developer runs the test command
- **THEN** Vitest executes all unit tests in `tests/unit/` and integration tests in `tests/integration/`

### Requirement: CORS configuration
The system SHALL configure CORS headers to allow requests from the frontend domain if the Remix API routes are accessed from external clients. If the frontend and API are served from the same origin (monolith), CORS MAY be disabled.

#### Scenario: Same-origin requests
- **WHEN** the Remix monolith serves both UI and API from the same domain
- **THEN** CORS is not required since requests come from the same origin

### Requirement: Single data source principle
The system SHALL ensure all data access goes through a single data source layer (repositories). No direct database queries from routes or use cases. Repositories are the sole interface between domain logic and the database.

#### Scenario: Data access through repository
- **WHEN** a use case needs to fetch teams
- **THEN** it calls the team repository's findMany method, never Prisma directly

## Implementation Notes

- **MAJOR DEVIATION: Routes bypass repository pattern**: All 17 route files import `prisma` directly and make raw Prisma calls. The repository interfaces (`TeamRepository`, `MatchRepository`, `TournamentRepository`, `PlayerRepository`) and their Prisma implementations exist but are only used by the `_public.standings.tsx` route (via the `CalculateStandings` use case). All admin routes, API routes, and other public routes call `prisma.*` directly, violating the single data source principle.
- **Admin routes contain inline business logic**: `admin.matches.tsx` reimplements the round-robin schedule generation algorithm (lines ~47-88) instead of calling `GenerateSchedule`. `admin.teams.tsx` directly mutates team status and match scores for withdrawal instead of calling `WithdrawTeam`.
- **CORS configuration missing**: No CORS headers or middleware configured. The spec acknowledges same-origin monolith can skip it, but also says the system "SHALL configure CORS headers" for API routes. No explicit configuration exists.