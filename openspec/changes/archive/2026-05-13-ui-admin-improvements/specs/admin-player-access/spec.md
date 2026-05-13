## ADDED Requirements

### Requirement: Admin access to team players
The system SHALL provide a navigation link from each team row in the admin teams table to the team's player detail. The link MUST navigate to the public team detail page (`/team/:id`) where players are listed with captain indicators and jersey numbers.

#### Scenario: Admin clicks player link for a team
- **WHEN** an admin user clicks the player link on a team row in the admin teams table
- **THEN** the system navigates to the public team detail page showing that team's players

#### Scenario: Player link is visible on mobile
- **WHEN** an admin views the teams table on a mobile screen
- **THEN** each team row SHALL display a tap-friendly link to the team's player detail