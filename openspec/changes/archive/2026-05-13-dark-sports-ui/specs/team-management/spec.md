## MODIFIED Requirements

### Requirement: Team creation and roster
The system SHALL allow admins to create teams with a name, country code (e.g., "ESP", "COL"), and flag emoji. Each team MUST be associated with exactly one tournament. The visual presentation of team cards and detail pages SHALL use dark surface styling with team flags prominently displayed, team names in primary text, and player lists with captain indicators in accent color.

#### Scenario: Public user views team detail
- **WHEN** a public user navigates to a team detail page
- **THEN** the team information renders in a dark surface card with the flag emoji at text-5xl, team name in slate-50 bold, player list in a dark card with slate-400 dividers, and captain marked with amber-400 accent text