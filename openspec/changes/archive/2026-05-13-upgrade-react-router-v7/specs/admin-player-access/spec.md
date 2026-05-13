## MODIFIED Requirements

### Requirement: Admin access to team players
The system SHALL provide a navigation link from each team row in the admin teams table to the team's player detail. The link MUST navigate to the public team detail page (`/team/:id`) where players are listed with captain indicators and jersey numbers. All route files for admin and auth SHALL import from `react-router` instead of `@remix-run/react` and `@remix-run/node`.

#### Scenario: Admin clicks player link for a team
- **WHEN** an admin user clicks the player link on a team row in the admin teams table
- **THEN** the system navigates to the public team detail page showing that team's players

#### Scenario: Player link is visible on mobile
- **WHEN** an admin views the teams table on a mobile screen
- **THEN** each team row SHALL display a tap-friendly link to the team's player detail

#### Scenario: Auth routes use react-router imports
- **WHEN** the auth routes (`_auth.login.tsx`, `_auth.verify.tsx`, `_auth.logout.tsx`) are loaded
- **THEN** all `@remix-run/*` imports SHALL be replaced with `react-router` imports and the routes function identically