## ADDED Requirements

### Requirement: Round-robin schedule generation
The system SHALL generate a single round-robin schedule when the league phase starts. For N teams, the schedule SHALL produce N×(N-1)/2 total matches organized into N-1 rounds, with each round containing floor(N/2) matches. For odd N, one team per round receives a bye.

#### Scenario: Generate schedule for 8 teams
- **WHEN** the league phase starts with 8 teams
- **THEN** the system generates 28 matches across 7 rounds, with 4 matches per round and no byes

#### Scenario: Generate schedule for 7 teams
- **WHEN** the league phase starts with 7 teams
- **THEN** the system generates 21 matches across 7 rounds, with 3 matches per round and 1 bye per round

### Requirement: Match recording
The system SHALL allow admins to record match results (home score and away score) for scheduled matches. Once recorded, the match status changes from SCHEDULED to COMPLETED.

#### Scenario: Admin records match result
- **WHEN** an admin records a result of 3-1 for a scheduled match
- **THEN** the match status changes to COMPLETED, home and away scores are saved, and the standings are recalculated

#### Scenario: Public user cannot record results
- **WHEN** an unauthenticated user attempts to record a match result
- **THEN** the system rejects the request with an authorization error

### Requirement: Match status lifecycle
The system SHALL manage matches through the following statuses: SCHEDULED, IN_PROGRESS, and COMPLETED. Only COMPLETED matches contribute to standings calculation.

#### Scenario: Match transitions to in progress
- **WHEN** an admin marks a scheduled match as in progress
- **THEN** the match status changes to IN_PROGRESS

#### Scenario: Match transitions to completed
- **WHEN** an admin records a final score for an in-progress or scheduled match
- **THEN** the match status changes to COMPLETED and the result is applied to standings

### Requirement: Forfeit match handling
The system SHALL automatically convert future scheduled matches involving a WITHDRAWN team into COMPLETED matches with a 3-0 score in favor of the opposing team.

#### Scenario: Scheduled match converted to forfeit
- **WHEN** a team is marked as WITHDRAWN and has 3 remaining scheduled matches
- **THEN** each remaining match is set to COMPLETED with the opponent winning 3-0, and each opponent earns 3 points and +3 goal difference per forfeited match

### Requirement: Schedule regeneration on team join
The system SHALL support schedule regeneration when a team joins mid-tournament. Past completed matches MUST be preserved. The new schedule SHALL reflect the updated team count from the current round onward.

#### Scenario: Team joins mid-league
- **WHEN** a new team joins during the league phase and the tournament allows late joins
- **THEN** all completed matches are preserved, remaining rounds are regenerated to include the new team, and the new team starts with 0 points from missed rounds

### Requirement: Public match schedule display
The system SHALL display the match schedule to all users, organized by rounds. Each match shows home team, away team, round number, and result (if completed).

#### Scenario: Public user views schedule
- **WHEN** an unauthenticated user accesses the schedule page
- **THEN** the system displays all matches grouped by round, with team names, flags, scores (if completed), and match dates

## Implementation Notes

- **IN_PROGRESS transition missing from UI**: The `Match.start()` entity method exists for SCHEDULED → IN_PROGRESS, and the public UI renders an "En juego" badge for this status, but no admin action triggers this transition. Matches jump from SCHEDULED directly to COMPLETED.
- **Schedule regeneration not implemented**: When a team joins mid-LEAGUE_PHASE, no schedule regeneration logic runs. The spec requires preserving past completed matches and regenerating future rounds, but this use case does not exist.
- **Admin match page bypasses domain use cases**: `admin.matches.tsx` reimplements schedule generation with direct Prisma calls instead of using `GenerateSchedule`, and calls `prisma.match.update()` directly instead of `RecordMatchResult`.