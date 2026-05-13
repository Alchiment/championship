## ADDED Requirements

### Requirement: Computed standings table
The system SHALL compute standings dynamically from completed match results. Standings are NOT stored in the database; they are derived on each request. The standings table SHALL display: position, team name, team flag, played matches, wins, draws, losses, points (3 for win, 1 for draw, 0 for loss), goals for, goals against, and goal difference.

#### Scenario: View standings after matches
- **WHEN** a user views the standings page after several matches have been completed
- **THEN** the system calculates and displays each team's position, points, goal difference, goals for, and goals against from all completed matches

#### Scenario: Standings update after match result
- **WHEN** an admin records a match result of 3-1 for España vs Francia
- **THEN** España gains 3 points, +2 goal difference, 3 goals for, 1 goal against; Francia gains 0 points, -2 goal difference, 1 goal for, 3 goals against

### Requirement: FIFA-based tiebreaker hierarchy
The system SHALL resolve ties in the standings table using the following tiebreaker hierarchy, applied in order: (1) goal difference, (2) goals scored, (3) head-to-head result between tied teams, (4) head-to-head goal difference between tied teams. If teams remain tied after all four tiebreakers, they share the same position.

#### Scenario: Tiebreaker by goal difference
- **WHEN** two teams have equal points but different goal differences
- **THEN** the team with the higher goal difference ranks higher

#### Scenario: Tiebreaker by goals scored
- **WHEN** two teams have equal points and equal goal differences but different goals scored
- **THEN** the team with more goals scored ranks higher

#### Scenario: Tiebreaker by head-to-head result
- **WHEN** two teams have equal points, goal difference, and goals scored
- **THEN** the team that won the direct match between them ranks higher

#### Scenario: Tiebreaker by head-to-head goal difference
- **WHEN** two teams have equal points, goal difference, goals scored, and drew their head-to-head match
- **THEN** the head-to-head goal difference is not decisive if the match was a draw, and the teams share the same position

#### Scenario: Teams remain tied after all tiebreakers
- **WHEN** all four tiebreaker levels produce equal results between two or more teams
- **THEN** the tied teams share the same position number, and the next position number is skipped accordingly

### Requirement: Withdrawn teams in standings
The system SHALL include withdrawn teams in the standings table, displayed with a "WITHDRAWN" indicator. Withdrawn teams naturally sink to lower positions due to accumulated 3-0 forfeit losses against remaining opponents.

#### Scenario: Withdrawn team placement
- **WHEN** a team withdraws after round 3 in a 7-round tournament
- **THEN** the team appears in the standings with all completed results plus forfeit losses for remaining matches, marked as WITHDRAWN, ranking near the bottom due to many 0-point results

### Requirement: Public read-only standings access
The system SHALL provide read-only access to standings for all users. No user, including admins, SHALL be able to manually edit standings values — they are always computed.

#### Scenario: Admin attempts to edit standings
- **WHEN** an admin attempts to modify standings data directly
- **THEN** the system rejects the request with an error indicating standings are computed from match results

## Implementation Notes

- **Tied position numbering not implemented**: When teams are fully tied after all four tiebreaker levels, they should share the same position number and the next position should be skipped. Currently, positions are assigned sequentially (`i + 1`) regardless of ties. The `StandingAdapter.toDTO()` method receives a position parameter but no tie-detection logic exists.
- **CalculateStandings use case works correctly** for sorting, and is properly used by the `_public.standings.tsx` route (one of the few routes that actually uses the domain layer).