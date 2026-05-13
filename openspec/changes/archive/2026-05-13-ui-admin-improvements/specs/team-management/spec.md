## MODIFIED Requirements

### Requirement: Team creation and roster
The system SHALL allow admins to create teams with a name and flag emoji. The country code SHALL be auto-generated from the team name using a country-name-to-code mapping. Each team MUST be associated with exactly one tournament. The visual presentation of team cards and detail pages SHALL display the flag emoji prominently without showing the country code text. The admin team creation form MUST NOT include a country code input field.

#### Scenario: Public user views team detail
- **WHEN** a public user navigates to a team detail page
- **THEN** the team information renders with the flag emoji displayed prominently and NO country code text visible

#### Scenario: Admin creates a new team
- **WHEN** an admin fills in the team name and flag emoji and submits the form
- **THEN** the system auto-generates the country code from the team name and the code field is NOT shown as an input

#### Scenario: FlagBadge renders without code text
- **WHEN** a FlagBadge component is rendered for any team
- **THEN** only the flag emoji is displayed with no adjacent code text