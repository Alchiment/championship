## 1. Country Code Auto-Generation

- [x] 1.1 Create `app/utils/country-codes.ts` with a static mapping of Spanish country names to ISO 3166-1 alpha-3 codes, plus a `generateCode(name: string): string` function that looks up the name or falls back to first 3 uppercase letters
- [x] 1.2 Update `admin.teams.tsx` team creation form: remove the `code` input field and auto-generate the code server-side using `generateCode()` in the action before creating the team
- [x] 1.3 Update `app/routes/api.teams.tsx` (if applicable) to auto-generate code from name when creating teams via API

## 2. Hide Country Code from UI

- [x] 2.1 Update `FlagBadge` component to remove the `code` text span, keeping only the flag emoji (and update all call sites to still pass `code` as prop for data consistency but not display it)
- [x] 2.2 Update `TeamCard` component to remove the `code` display under team name
- [x] 2.3 Verify `StandingsTable` and `MatchCard` correctly render `FlagBadge` without code text

## 3. Admin Player Access Link

- [x] 3.1 Add a "Jugadores" link icon in each team row of the admin teams table (`admin.teams.tsx`) that navigates to `/team/:id` (public team detail page)

## 4. Admin Dashboard Welcome Section

- [x] 4.1 Add "Bienvenido" heading and quick-access navigation links (Equipos, Partidos, Configuración) to `admin.index.tsx` above the existing status cards
- [x] 4.2 Update the no-tournament state to show a message encouraging tournament configuration with a link to the settings page

## 5. Public Root Redirect

- [x] 5.1 Update `_public.index.tsx` to replace `TournamentInfo` rendering with a server-side redirect to `/standings`

## 6. Mobile Bottom Navigation Update

- [x] 6.1 Update `BottomNav` component: replace the "Mas" tab with a conditional tab — show "Admin" (linking to `/admin`) for authenticated admin users, "Ingresar" (linking to `/login`) for unauthenticated users, and hide the tab for authenticated non-admin users