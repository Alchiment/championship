## ADDED Requirements

### Requirement: Tournament lifecycle states
The system SHALL manage tournaments through the following lifecycle states: SETUP, LEAGUE_PHASE, PLAYOFFS, and COMPLETED. Each state transition MUST be explicit and validated.

#### Scenario: Create a new tournament
- **WHEN** an admin creates a new tournament with name and venue
- **THEN** the tournament is created with status SETUP and hasGroupPhase defaults to false

#### Scenario: Start league phase
- **WHEN** an admin starts the league phase for a tournament in SETUP status with at least 2 teams
- **THEN** the tournament status changes to LEAGUE_PHASE and the round-robin schedule is generated

#### Scenario: Start league phase with insufficient teams
- **WHEN** an admin tries to start the league phase with fewer than 2 teams
- **THEN** the system rejects the operation with a validation error

### Requirement: Tournament settings
The system SHALL allow admins to configure per-tournament settings including playoff cutoff (number of teams advancing to playoffs, default 4), group phase toggle, and 3rd place match toggle.

#### Scenario: Configure playoff cutoff
- **WHEN** an admin sets the playoff cutoff to a value N
- **THEN** the top N teams from the league standings advance to playoffs when the group phase is enabled

#### Scenario: Toggle group phase
- **WHEN** an admin enables the group phase for a tournament
- **THEN** after the league phase completes, the tournament transitions to PLAYOFFS instead of COMPLETED

#### Scenario: Tournament without group phase
- **WHEN** the group phase is disabled and the league phase completes
- **THEN** the tournament transitions directly to COMPLETED and the league winner is declared champion

### Requirement: Public read access to tournament info
The system SHALL allow unauthenticated users to view tournament details including name, venue, status, and settings in read-only mode.

#### Scenario: Public user views tournament info
- **WHEN** an unauthenticated user accesses the tournament page
- **THEN** the system displays tournament name, venue, current status, and participating teams without any edit controls

### Requirement: Tournament agenda display
The system SHALL display event-level information on the public tournament page, including organizers and sponsors associated with the tournament.

#### Scenario: Display organizers and sponsors
- **WHEN** a user views the tournament info page
- **THEN** the system shows all organizers (name and role) and sponsors (name and description) associated with the tournament

## Implementation Notes

- **Tournament settings bypass entity state transitions**: `admin.settings.tsx` directly calls `prisma.tournament.update()` for settings changes but only allows changes during SETUP per spec. However, the status transition (LEAGUE_PHASE) is done via direct Prisma call in `admin.matches.tsx` instead of using `Tournament.startLeague()`.
- **No rejection when starting league with insufficient teams from domain layer**: Validation for minimum 2 teams exists in `admin.matches.tsx` (inline check) and `GenerateSchedule` use case, but the admin route bypasses the use case.