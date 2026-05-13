## Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│                        REMIXJS MONOLITH                              │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        ROUTES                                  │  │
│  │   / ─── Public ───┐   /admin ─── Auth ───┐   /api ───┐     │  │
│  │   │                │   │                    │   │         │     │  │
│  │   ▼                ▼   ▼                    ▼   ▼         ▼     │  │
│  │  Standings      Teams   Dashboard      Settings   /teams    │  │
│  │  Schedule       Match   Teams CRUD     Match      /matches  │  │
│  │  Teams          Info    Matches CRUD    config     /standings│  │
│  └───────────────────────────────────────────────────────────────┘  │
│         │                                                           │
│  ┌──────┴──────┐  ┌────────────────┐  ┌────────────────────────┐  │
│  │ Containers  │  │  Presentational │  │   Adapters (in/out)     │  │
│  │ + Loaders   │─▶│  Components    │  │   DB ↔ Domain ↔ API    │  │
│  │ + Actions   │  │  + Tailwind    │  │                        │  │
│  └─────────────┘  └────────────────┘  └────────────────────────┘  │
│         │                                                           │
│  ┌──────┴──────────────────────────────────────────────────────┐   │
│  │                     USE CASES (Domain)                        │   │
│  │  CreateTournament │ RecordMatchResult │ CalculateStandings   │   │
│  │  GenerateSchedule │ WithdrawTeam      │ GeneratePlayoffs    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│         │                         │                                  │
│  ┌──────┴──────┐           ┌──────┴──────┐   ┌──────────────────┐  │
│  │  Facades     │           │ Repositories│   │  Auth             │  │
│  │  (HTTP)      │           │ (Prisma)    │   │  (WhatsApp Meta) │  │
│  └─────────────┘           └──────┬──────┘   │  + Cookie Sess.   │  │
│                                   │          └──────────────────┘  │
│                            ┌──────┴──────┐                          │
│                            │  Supabase   │                          │
│                            │ PostgreSQL  │                          │
│                            └─────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Tournament Lifecycle Flow

```
  SETUP ──add teams──▶ SETUP ──start league──▶ LEAGUE_PHASE
                                                   │
                                          all league matches done
                                                   │
                                              group phase?
                                           ╱          ╲
                                         YES            NO
                                          │              │
                                          ▼              ▼
                                     PLAYOFFS        COMPLETED
                                    (semifinals+     (league winner)
                                      final)
                                          │
                                    final done
                                          │
                                          ▼
                                     COMPLETED
                                     (champion!)
```

### Auth Flow

```
  User ──▶ /login ──▶ Enter phone ──▶ Meta WhatsApp API
                                              │
                                         sends code
                                              │
  User ◀─── enter code ◀─── receives via WhatsApp
                                              │
                                         validate code
                                              │
                                    ┌─────is admin?─────┐
                                    YES                  NO
                                    │                     │
                                    ▼                     ▼
                              Admin session          Public redirect
                              (full CRUD)            (read-only)
```

### Standings Computation

```
  MatchResults[] ──▶ Aggregate per team ──▶ Apply tiebreaker hierarchy
                                                  │
                                         ┌───────┼───────┐
                                         1       2       3       4
                                      GD > ──▶ GF > ──▶ H2H > ──▶ H2H GD
                                                  │
                                            still tied? → same position
```

## Impact

| Level | Reason |
|-------|--------|
| 🔴 HIGH | New database from scratch (Supabase + Prisma), new auth system (WhatsApp), new project scaffolding — greenfield with no migration path |
| 🟡 MED | 7 new API endpoints, all new UI pages (public + admin), Tailwind setup, schedule generation algorithm |
| 🟢 LOW | THIRD_PLACE enum value in DB (additive, no logic), computed standings (read-only, no data migration) |

## Implementation Deviations

Diagram current state vs. spec:

```
┌──────────────────────────────────────────────────────────────┐
│                    AS DESIGNED                                │
│                                                              │
│  Routes ──▶ Use Cases ──▶ Repositories ──▶ Prisma ──▶ DB  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                    AS IMPLEMENTED                             │
│                                                              │
│  Routes ─────────────────────────▶ Prisma ──────────▶ DB    │
│    │                              (17/17 bypass)             │
│  StandingsRoute ──▶ UseCase ──▶ Repo ──▶ Prisma ──▶ DB     │
│                 (only route using domain layer)              │
└──────────────────────────────────────────────────────────────┘
```