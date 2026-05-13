## Context

The championship app (Remix + Prisma + TailwindCSS dark theme) has several UX gaps:

1. The `code` field on Team is manually entered and displayed alongside the flag emoji in `FlagBadge`, adding visual clutter since the flag emoji alone identifies countries.
2. The admin teams page shows player count but has no link to manage players — admins must use the public team detail page.
3. The admin Dashboard (`admin.index.tsx`) shows tournament status/cards but lacks a welcome header and quick-nav links.
4. The public root (`/`) renders `TournamentInfo` but users expect standings as the primary view.
5. The mobile `BottomNav` "Mas" tab is ambiguous — admins need a direct "Admin" entry point.

Current data flow: Team has `name`, `code` (3-char), `flag` (emoji). The code is entered via a text input in the admin form and displayed in `FlagBadge`, `TeamCard`, and `StandingsTable`.

## Goals / Non-Goals

**Goals:**
- Simplify team creation by auto-generating country codes
- Reduce UI clutter by hiding code text from public-facing components
- Provide admin access to team player management
- Improve dashboard usability with welcome message and navigation links
- Redirect public root to standings for immediate value
- Make mobile navigation clearer for admin users

**Non-Goals:**
- Full player CRUD in admin (v1 links to existing public detail page; separate admin player editor is future work)
- Changing the database schema for `code` — it remains required at the data level
- Redesigning the admin layout structure

## Decisions

### 1. Country code auto-generation via static lookup map

**Decision**: Use a static country-name-to-ISO-3166-alpha-3 mapping object keyed by Spanish country names.

**Rationale**: The championship involves a known, finite set of countries (tournament participants). A static map avoids external API calls, is instant, and requires no runtime dependency. The map covers common countries and falls back to the first 3 uppercase letters of the name if not found.

**Alternative**: Call an external API (e.g., REST Countries) — rejected due to latency, network dependency, and overkill for a known dataset.

### 2. Hide code from UI, keep in data layer

**Decision**: Remove `code` text display from `FlagBadge` and other components, but keep the `code` field in the database and domain model. Auto-generated codes are set during team creation on the server side.

**Rationale**: The code is still useful as a unique identifier internally and for API consumers, but the flag emoji visually identifies teams. Keeping the field avoids a data migration.

### 3. Player access via navigation to public team detail

**Decision**: Add a link icon in the admin teams table that navigates to the existing public team detail page (`/team/:id`), which already shows player lists.

**Rationale**: The public team detail page already renders players with captain badges and jersey numbers. Adding a full player management view in admin is a larger effort — a link provides immediate value with zero new components.

### 4. Public root redirect to standings

**Decision**: Replace the `TournamentInfo` component on the public root route with a server-side redirect to `/standings`.

**Rationale**: Standings is the primary user interest in a tournament app. Tournament info (name, venue, organizers) is already visible in the nav banner and the tournament info component can be removed from the root since it's secondary context.

### 5. Replace "Mas" with conditional Admin/Login link

**Decision**: Change the 4th `BottomNav` tab to show "Admin" (with a shield/key icon) for authenticated admins, "Ingresar" for unauthenticated users, and hide for non-admin authenticated users.

**Rationale**: The "Mas" label is vague. Admins need quick access to the admin panel, and unauthenticated users need a clear login prompt. Non-admin authenticated users don't need this tab.

## Risks / Trade-offs

- **[Country not in mapping]** → Fallback to first 3 uppercase letters of the team name; admin can manually override by editing the team in the future if names are unusual.
- **[Breaking change: code removed from form]** → No migration needed since code is auto-generated server-side; existing teams retain their codes.
- **[Public team detail for admin player access]** → Admin sees the public view, not an admin-specific player editor. This is a conscious trade-off for speed; a dedicated admin player view can be added later.