## Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    K108 DARK SPORTS UI                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ tailwind.config.ts ────────────────────────────────┐   │
│  │  Design Tokens:                                      │   │
│  │  base → slate-950    surface → slate-900             │   │
│  │  elevated → slate-800  inset → slate-950/800        │   │
│  │  accent → amber-300-600  primary → slate-50         │   │
│  │  secondary → slate-400   muted → slate-500           │   │
│  │  default → slate-700 (borders)                       │   │
│  └──────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─ tailwind.css ──────────────────────────────────────┐  │
│  │  @layer base:                                         │  │
│  │  - html color-scheme: dark                            │  │
│  │  - body bg-base text-primary                          │  │
│  └──────────────────────────────────────────────────┘   │
│                          │                                  │
│            ┌─────────────┼─────────────┐                  │
│            ▼             ▼              ▼                  │
│  ┌─ Layouts ─────┐ ┌─ Components ─┐ ┌─ Pages ─────────┐ │
│  │               │ │              │ │                  │ │
│  │  _public.tsx  │ │  MatchCard   │ │  Home page      │ │
│  │  (nav + tabs) │ │  TeamCard    │ │  Standings page  │ │
│  │               │ │  Standings   │ │  Schedule page   │ │
│  │  admin.tsx    │ │  Tournament  │ │  Teams list      │ │
│  │  (sidebar/   │ │  FlagBadge   │ │  Team detail     │ │
│  │   tabs)      │ │              │ │  Match detail    │ │
│  │               │ │              │ │                  │ │
│  │  root.tsx     │ │              │ │  Admin:          │ │
│  │  (ErrorBnd)  │ │              │ │  Dashboard       │ │
│  └───────────────┘ └──────────────┘ │  Matches         │ │
│                                     │  Teams           │ │
│                                     │  Settings        │ │
│                                     └──────────────────┘ │
│                                                             │
│  ┌─ Auth Pages ────────────────────────────────────────┐   │
│  │  Login     → bg-base centered card (bg-surface)     │   │
│  │  Verify    → bg-base centered card (bg-surface)     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─before─────────────────────────────────────────────┐   │
│  │  bg-white  text-gray-*  shadow  border-gray-200     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─after──────────────────────────────────────────────┐   │
│  │  bg-base   text-primary  border-default            │   │
│  │  bg-surface cards     accent (amber) highlights    │   │
│  │  bg-elevated hovers   emerald/red status colors    │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

```
  PUBLIC NAVIGATION
  
  Desktop (≥md):
  ┌─ bg-surface border-b border-default ──────────────────────┐
  │ 🏆 K108 Torneo    Tabla  Calendario  Equipos     Login   │
  │                   ═══                                   │
  │                   active: text-accent + border-b-accent  │
  └──────────────────────────────────────────────────────────┘
  
  Mobile (<md):
  ┌────────────────────────────────────────────────────┐     │
  │                                                    │     │
  │  Page content (scrollable)                         │     │
  │                                                    │     │
  ├────────────────────────────────────────────────────┤     │
  │  📊Tabla   📅Calend.   👥Equipos   ☰Más          │     │
  │   ═════                                              │
  │  active: text-accent                                │     │
  └────────────────────────────────────────────────────┘     │
```

```
  STANDINGS TABLE — Hero Component
  
  ┌─ bg-surface border border-default rounded-xl ──────────┐
  │  # │ Equipo          │ PJ │ G │ E │ P │ GF │ GC │ DG │ Pts│
  │─── ───────────────── ──── ─── ─── ─── ──── ──── ──── ───│
  │▌1 │ 🇨🇴 Colombia     │  3 │ 3 │ 0 │ 0 │  7 │  2 │+5 │  9│ ← border-l-accent
  │▌2 │ 🇪🇸 España       │  3 │ 2 │ 1 │ 0 │  5 │  2 │+3 │  7│ ← border-l-accent
  │  ─ ─ ─ ─ ─ Corte de playoff ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
  │  3 │ 🇲🇽 México       │  3 │ 1 │ 0 │ 2 │  3 │  5 │-2 │  3│
  │  4 │ 🇦🇷 Argentina    │  3 │ 0 │ 1 │ 2 │  1 │  7 │-6 │  1│
  └───────────────────────────────────────────────────────┘
     Pts column: text-accent font-bold
     DG positive: text-emerald-400     negative: text-red-400
     Cutoff: border-t-2 border-dashed border-accent/50
```

## Impact

| Level | Reason |
|-------|--------|
| 🟡 MED | All 12 route files and 5 UI components modified — no logic changes, purely visual reformatting |
| 🟢 LOW | No backend, API, or data model changes — same loaders/actions, different JSX classes |
| 🟢 LOW | No breaking changes to existing functionality — all features preserved with same behavior |
| 🟡 MED | tailwind.config.ts gains custom theme tokens — additive change, no removal of default Tailwind classes |
| 🟢 LOW | No new dependencies — uses existing Tailwind v3 utility classes only |
| 🟡 MED | New BottomNav component needed for mobile tab bar — new file, no existing code affected |
| 🟢 LOW | All existing tests remain valid — no logic changes to test |