## Why

The admin and public interfaces have several usability gaps: the country code field adds unnecessary manual input and visual clutter, team player management is inaccessible from the admin panel, the dashboard and public root pages lack clear navigation entry points, and the mobile "Mas" button is too vague for authenticated admins.

## What Changes

- **Hide country code from UI**: Remove the `code` text display from `FlagBadge`, `TeamCard`, `StandingsTable`, and `MatchCard`. The flag emoji alone is sufficient for identification.
- **Auto-generate country code**: When creating a team in the admin form, remove the `code` input field and derive the 3-letter code automatically from the team's country name (e.g., "España" -> "ESP") using a country-name-to-code mapping.
- **Add team players link in admin**: Add a clickable link from each team row in `admin.teams` to access the team's player list, enabling player management from the admin view.
- **Improve admin dashboard**: Add a Spanish welcome title ("Bienvenido") and quick-access navigation links to key admin sections (Equipos, Partidos, Configuración) on the root Dashboard view.
- **Redirect public root to standings**: Change the public root route (`/`) to redirect to `/standings` instead of rendering `TournamentInfo`.
- **Replace mobile "Mas" button**: In `BottomNav`, replace the generic "Mas" button with a direct "Admin" link for authenticated admins (visible only to admin users), keeping the login redirect for unauthenticated users.

## Capabilities

### New Capabilities
- `country-code-generation`: Auto-generate 3-letter country codes from country names with a mapping utility.
- `admin-player-access`: Provide a link/section in the admin team view to access team players for management.

### Modified Capabilities
- `team-management`: Remove the `code` input from the team creation form; hide `code` text from all public UI components displaying team identifiers.
- `dark-layout`: Improve the admin dashboard welcome section and mobile navigation; redirect public root to standings.

## Impact

- **UI Components**: `FlagBadge`, `TeamCard`, `StandingsTable`, `MatchCard`, `BottomNav`, admin dashboard page
- **Routes**: `_public.index.tsx` (redirect), `admin.index.tsx` (content), `admin.teams.tsx` (add player link)
- **Domain/Adapters**: Team creation flow must accept `name` only and auto-generate `code` before persisting
- **Data**: A country-name-to-code mapping dataset is needed (can be a static lookup)
- **API**: Team creation endpoint/schema may need adjustment to make `code` optional on input