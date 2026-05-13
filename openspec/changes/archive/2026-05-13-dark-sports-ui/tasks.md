## 1. Design Tokens & Base Styles

- [x] 1.1 Update `tailwind.config.ts` with semantic color tokens: `base` (slate-950), `surface` (slate-900), `elevated` (slate-800), `inset` (slate-950/800), `accent` (amber 300-600), `primary` (slate-50), `secondary` (slate-400), `muted` (slate-500), `default` (slate-700). Add under `theme.extend.colors`.
- [x] 1.2 Update `app/tailwind.css` base layer: set `html { color-scheme: dark }`, `body { @apply bg-base text-primary }`, define default link colors (`text-accent`) and focus ring defaults (`ring-accent/50`).
- [x] 1.3 Update `app/root.tsx` Layout and ErrorBoundary: replace all `bg-gray-*`, `text-gray-*`, `bg-white`, `shadow-md` classes with dark theme equivalents (`bg-base`, `bg-surface`, `text-primary`, `text-secondary`, `border border-default`, `rounded-2xl`).

## 2. Navigation Components

- [x] 2.1 Create `app/components/ui/BottomNav.tsx`: mobile bottom tab bar with 4 items (Tabla, Calendario, Equipos, Más), active tab indicator in accent color, `bg-surface border-t border-default` styling, icons or text labels. Render only on screens < md (hidden md:block on top nav, hidden md:hidden on bottom nav).
- [x] 2.2 Update `app/routes/_public.tsx`: replace nav with `bg-surface border-b border-default` top bar for desktop, add `BottomNav` component for mobile. Restructure content area with `max-w-5xl mx-auto px-4 py-8 pb-20 md:pb-8`. Update all nav links to use `text-secondary hover:text-primary` and active state `text-accent border-b-2 border-accent`.

## 3. UI Components

- [x] 3.1 Update `app/components/ui/MatchCard.tsx`: replace outer container with `bg-surface border border-default rounded-xl p-4 hover:border-accent/30 transition-colors`. Replace score display with `text-accent font-bold text-xl` for completed. Replace yellow/blue status pills with emerald-400 dot + text for in-progress, `text-muted` "vs" for scheduled.
- [x] 3.2 Update `app/components/ui/StandingsTable.tsx`: replace outer container with `bg-surface border border-default rounded-xl overflow-hidden`. Header row: `bg-elevated text-muted text-xs uppercase`. Points column: `text-accent font-bold`. Goal difference: `text-emerald-400` for positive, `text-red-400` for negative. Add `border-l-2 border-accent` on rows above playoff cutoff. Add playoff cutoff separator row with `border-t-2 border-dashed border-accent/50`. Accept `playoffCutoff` prop to determine separator position. Withdrawn rows: `opacity-60`.
- [x] 3.3 Update `app/components/ui/TeamCard.tsx`: replace with `bg-surface border border-default rounded-xl p-5 hover:border-accent/30 transition-colors`. Flag at `text-4xl`. Name: `text-primary font-semibold`. Code: `text-muted text-sm`. Player count: `text-secondary text-sm`. Captain: `text-accent text-sm`. WITHDRAWN badge: `bg-red-500/10 text-red-400 text-xs rounded px-2 py-0.5`.
- [x] 3.4 Update `app/components/ui/FlagBadge.tsx`: update text colors to `text-muted text-xs` for code, flag at `text-xl`, use `inline-flex items-center gap-1`.
- [x] 3.5 Update `app/components/ui/TournamentInfo.tsx`: replace cards with `bg-surface border border-default rounded-xl p-6`. Title: `text-primary font-bold`. Subtitle: `text-secondary`. Status badges: color-coded text with dot prefix — SETUP=`text-amber-400`, LEAGUE_PHASE=`text-emerald-400`, PLAYOFFS=`text-emerald-300`, COMPLETED=`text-muted`. Section headings: `text-secondary font-semibold`.

## 4. Public Pages

- [x] 4.1 Update `app/routes/_public.index.tsx`: wrap content in appropriate spacing. Update empty state to `text-muted text-center`.
- [x] 4.2 Update `app/routes/_public.standings.tsx`: add page heading `text-2xl font-bold text-primary mb-6`. Pass `playoffCutoff` prop from tournament data to `StandingsTable`.
- [x] 4.3 Update `app/routes/_public.schedule.tsx`: update heading to `text-2xl font-bold text-primary mb-6`. Update round cards to `bg-surface border border-default rounded-xl p-5`. Round headings: `text-lg font-semibold text-primary mb-4`. Update empty state text to `text-muted`.
- [x] 4.4 Update `app/routes/_public.teams.tsx`: update heading to `text-2xl font-bold text-primary mb-6`. Update empty state to `text-muted`. Grid remains same.
- [x] 4.5 Update `app/routes/_public.team.$id.tsx`: update all cards to `bg-surface border border-default rounded-xl p-6`. Headings: `text-primary font-bold`. Player list: `divide-y divide-default`. Captain indicator: amber text. Match history rows: update to dark theme styling. Status badges: emerald/red text variants.
- [x] 4.6 Update `app/routes/_public.match.$id.tsx`: update card to `bg-surface border border-default rounded-xl p-8 max-w-lg mx-auto`. Flags at `text-5xl`. Team names: `text-primary font-semibold`. Scores: `text-4xl font-bold text-accent`. Status: dot + text system. Phase/round label: `text-muted text-sm text-center`.

## 5. Auth Pages

- [x] 5.1 Update `app/routes/_auth.login.tsx`: replace `min-h-screen bg-gray-100` with `min-h-screen bg-base flex items-center justify-center`. Card: `bg-surface border border-default rounded-2xl p-8 max-w-md w-full`. Title: `text-primary font-bold`. Labels: `text-secondary text-sm font-medium`. Inputs: `bg-inset border border-default rounded-lg text-primary placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/50`. Button: `bg-accent hover:bg-accent-600 text-slate-950 font-medium rounded-lg w-full py-2.5`. Error: `text-red-400 text-sm`. Verification form: same dark styling.
- [x] 5.2 Update `app/routes/_auth.verify.tsx`: apply same dark theme styling as login page — dark background, surface card, dark inputs, amber focus rings, amber submit button.

## 6. Admin Layout & Pages

- [x] 6.1 Update `app/routes/admin.tsx`: replace layout. Desktop: `min-h-screen bg-base` with sidebar `w-64 bg-surface border-r border-default`. Mobile: horizontal tab bar at top. Add responsive breakpoint: sidebar hidden on mobile, tab bar visible. Nav items: `text-secondary hover:text-primary hover:bg-elevated rounded-lg px-3 py-2`. Active: `text-accent bg-elevated/50`.
- [x] 6.2 Update `app/routes/admin.index.tsx`: replace `text-gray-*` with dark tokens. Stat cards: `bg-surface border border-default rounded-xl p-6`. Labels: `text-muted text-sm font-medium uppercase`. Values: `text-3xl font-bold text-primary`. Status: color-coded text system (SETUP=`text-amber-400`, etc.).
- [x] 6.3 Update `app/routes/admin.matches.tsx`: replace all gray classes with dark tokens. Cards: `bg-surface border border-default rounded-xl p-5`. Round headings: `text-lg font-semibold text-primary`. Match rows: `divide-y divide-default`. Score inputs: `w-20 bg-inset border border-default rounded-lg text-center text-primary focus:border-accent focus:ring-1 focus:ring-accent/50`. Submit button: primary amber style.
- [x] 6.4 Update `app/routes/admin.teams.tsx`: replace all gray classes with dark tokens. Form card: `bg-surface border border-default rounded-xl p-6`. Form inputs: `bg-inset border border-default rounded-lg text-primary placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/50`. Labels: `text-secondary text-sm font-medium`. Table: `bg-surface border border-default rounded-xl overflow-hidden`. Header: `bg-elevated text-muted`. Status badges: ACTIVE=`text-emerald-400 bg-emerald-500/10`, WITHDRAWN=`text-red-400 bg-red-500/10`. Withdraw button: `text-red-400 hover:text-red-300`.
- [x] 6.5 Update `app/routes/admin.settings.tsx`: replace all gray classes with dark tokens. Form sections: `bg-surface border border-default rounded-xl p-6` with `space-y-4` spacing. Labels: `text-secondary text-sm font-medium`. Inputs: same dark input pattern. Checkboxes: `h-4 w-4 rounded border-default bg-inset text-accent focus:ring-accent/50`. Primary button: `bg-accent hover:bg-accent-600 text-slate-950 font-medium rounded-lg px-4 py-2.5`. Secondary button: `bg-elevated hover:bg-slate-700 text-primary font-medium rounded-lg`.

## 7. 404 & Error Pages

- [x] 7.1 Update `app/routes/$.tsx`: render a proper dark-themed 404 page with `bg-base` background, centered `bg-surface border border-default rounded-2xl` card, `text-accent text-6xl font-bold` "404", `text-primary text-xl` heading, and `text-secondary` description.