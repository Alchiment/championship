## MODIFIED Requirements

### Requirement: Public match schedule display
The system SHALL display the match schedule to all users, organized by rounds. Each match shows home team, away team, round number, and result (if completed). The visual presentation SHALL use dark surface cards with amber-accented scores for completed matches, emerald-400 status indicators for in-progress matches, and muted text for scheduled matches.

#### Scenario: Public user views schedule
- **WHEN** an unauthenticated user accesses the schedule page
- **THEN** the system displays all matches grouped by round in dark-themed cards, with completed match scores in amber-400 bold, in-progress indicators in emerald-400, and scheduled matches showing "vs" in slate-500