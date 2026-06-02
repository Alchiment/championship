## ADDED Requirements

### Requirement: Admin can mark a match as double no-show
The system SHALL provide a checkbox labeled "Ambos equipos no se presentaron" in the admin match result form. When checked and the form is submitted, the system SHALL set the match status to NO_SHOW and set both homeScore and awayScore to null.

#### Scenario: Admin submits a match as no-show
- **WHEN** the admin checks the no-show checkbox and submits the match result form
- **THEN** the match status is set to NO_SHOW and both scores are set to null

#### Scenario: Admin submits a match with normal result
- **WHEN** the admin does not check the no-show checkbox and enters score values
- **THEN** the match is saved as COMPLETED with the entered scores (existing behavior, unchanged)

### Requirement: NO_SHOW matches increment played count but not points or goals
NO_SHOW matches SHALL increment the `played` count for both teams. However, NO_SHOW matches SHALL NOT affect wins, draws, losses, goalsFor, goalsAgainst, goalDifference, or points for either team.

#### Scenario: NO_SHOW match increments played only
- **WHEN** a match has status NO_SHOW
- **THEN** both teams' `played` count is incremented by 1
- **AND** their goals, goal difference, points, and win/draw/loss counts remain unchanged

#### Scenario: NO_SHOW match is filtered from head-to-head tiebreaker
- **WHEN** standings tiebreakers are calculated and a NO_SHOW match exists between the tied teams
- **THEN** that match SHALL NOT be considered in head-to-head calculations

### Requirement: NO_SHOW matches cannot be edited
The system SHALL prevent modification of a match result once its status is NO_SHOW. The RecordMatchResult use case SHALL reject any attempt to update a NO_SHOW match with an error.

#### Scenario: Attempt to edit a NO_SHOW match
- **WHEN** a request is made to update the result of a match with NO_SHOW status
- **THEN** the system SHALL reject the request with an error message

### Requirement: NO_SHOW matches display "No se presentaron" label in public views
The system SHALL display the label "No se presentaron" instead of a score (e.g. "3 - 1") for NO_SHOW matches in all public-facing views including the schedule page, match detail page, and team detail page.

#### Scenario: Viewing a NO_SHOW match on schedule page
- **WHEN** a user views the schedule and a match has NO_SHOW status
- **THEN** the match displays "No se presentaron" instead of the score

#### Scenario: Viewing a NO_SHOW match on match detail page
- **WHEN** a user views a match detail page and the match has NO_SHOW status
- **THEN** the page displays "No se presentaron" instead of the score

#### Scenario: Admin views a NO_SHOW match in match list
- **WHEN** the admin views the match list and a match has NO_SHOW status
- **THEN** the match displays "No se presentaron" instead of the score