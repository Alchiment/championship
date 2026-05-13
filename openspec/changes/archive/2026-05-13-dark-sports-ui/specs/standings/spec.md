## MODIFIED Requirements

### Requirement: Computed standings table
The system SHALL compute standings dynamically from completed match results. Standings are NOT stored in the database; they are derived on each request. The standings table SHALL display: position, team name, team flag, played matches, wins, draws, losses, points (3 for win, 1 for draw, 0 for loss), goals for, goals against, and goal difference. The visual presentation SHALL use a dark surface table with amber-accented points column, emerald-400/red-400 goal difference coloring, and a playoff cutoff indicator (amber dashed border row) after the qualifying position count.

#### Scenario: View standings after matches
- **WHEN** a user views the standings page after several matches have been completed
- **THEN** the system displays a dark-themed standings table where qualifying positions have amber left borders, points are in amber-400 bold, positive goal difference in emerald-400, negative in red-400, and a playoff cutoff line separates qualifying teams