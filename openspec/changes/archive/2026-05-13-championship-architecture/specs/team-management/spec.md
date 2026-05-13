## ADDED Requirements

### Requirement: Team creation and roster
The system SHALL allow admins to create teams with a name, country code (e.g., "ESP", "COL"), and flag emoji. Each team MUST be associated with exactly one tournament.

#### Scenario: Admin creates a team
- **WHEN** an admin creates a team with name "España", code "ESP", and flag "🇪🇸"
- **THEN** the team is created with ACTIVE status and added to the tournament roster

#### Scenario: Public user cannot create teams
- **WHEN** an unauthenticated user attempts to create a team
- **THEN** the system rejects the request with an authorization error

### Requirement: Player management
The system SHALL allow admins to add and remove players to/from teams. Each player has a name and optional jersey number. Teams MAY have any number of players. Exactly one player per team SHALL be designated as captain.

#### Scenario: Add player to team
- **WHEN** an admin adds a player with name "Carlos" and number 10 to team "España"
- **THEN** the player is created and associated with the team

#### Scenario: Assign captain
- **WHEN** an admin designates a player as captain of their team
- **THEN** that player becomes the captain and any previous captain of that team is demoted to regular player

### Requirement: Dynamic team roster
The system SHALL support dynamic team management: teams can join or withdraw from a tournament. The number of teams is not fixed at a specific count (e.g., 8); any number of teams MAY participate.

#### Scenario: Team joins during SETUP
- **WHEN** an admin adds a new team to a tournament in SETUP status
- **THEN** the team is added to the roster with ACTIVE status

#### Scenario: Team joins during LEAGUE_PHASE
- **WHEN** an admin adds a new team to a tournament in LEAGUE_PHASE status and the tournament allows late joins
- **THEN** the team is added with ACTIVE status and the schedule is regenerated from the current round onward, with past rounds counting as 0 points for the new team

#### Scenario: Team joins during PLAYOFFS
- **WHEN** an admin attempts to add a team during PLAYOFFS
- **THEN** the system rejects the operation

### Requirement: Team withdrawal
The system SHALL allow admins to mark a team as WITHDRAWN. When a team withdraws, all past match results for that team SHALL be kept (not voided). All future scheduled matches for the withdrawn team SHALL be converted to 3-0 forfeit wins for the opposing team.

#### Scenario: Team withdraws mid-tournament
- **WHEN** an admin marks team "España" as WITHDRAWN after round 3
- **THEN** all matches involving España in rounds 1-3 retain their original results, all future España matches are converted to 3-0 forfeit results, and España's status is set to WITHDRAWN

#### Scenario: Opponent receives forfeit win
- **WHEN** a withdrawn team had a match scheduled against "Colombia"
- **THEN** Colombia is awarded a 3-0 win, earning 3 points and +3 goal difference from that match

#### Scenario: Withdrawn team in standings
- **WHEN** a withdrawn team appears in the standings table
- **THEN** the team is displayed with a "WITHDRAWN" badge and naturally sinks to lower positions due to accumulated forfeit results

## Implementation Notes

- **Player management not exposed in admin UI**: The `PlayerRepository`, `Player` entity, and `PrismaPlayerRepository` are fully implemented in the domain layer, but `admin.teams.tsx` has no intent handlers for `addPlayer`, `removePlayer`, or `assignCaptain`. No API route for player operations exists either.
- **Mid-league team join not implemented**: The `GenerateSchedule` use case only works from SETUP status. When a team is created via the admin UI during LEAGUE_PHASE, no schedule regeneration occurs and no validation prevents/rejects the operation.
- **Withdrawal handling implemented but bypasses domain use case**: The admin teams page calls `Prisma.team.update()` and `Prisma.match.updateMany()` directly instead of using the `WithdrawTeam` use case.