## Visual

```
                         ADMIN UI
                            │
                  ┌─────────┼──────────┐
                  │                    │
            [Score 3-1]       ☑ No-show checkbox
                  │                    │
                  ▼                    ▼
          status: COMPLETED     status: NO_SHOW
          homeScore: 3          homeScore: null
          awayScore: 1          awayScore: null
                  │                    │
                  ▼                    ▼
        ┌─────────────────────────────────────────┐
        │         CalculateStandings              │
        │                                         │
        │   COMPLETED matches → accumulate        │
        │   NO_SHOW matches  → filtered out  ✗    │
        │                                         │
        │   Result for both teams:                │
        │   ┌──────────┬──┬──┬──┬──┬──┬──┬────┐   │
        │   │ Team     │PJ│G │E │P │GF│GC│Pts│   │
        │   ├──────────┼──┼──┼──┼──┼──┼──┼────┤   │
        │   │ Team A   │ 3│ 2│ 0│ 1│ 5│ 2│  6│   │
        │   │ Team B   │ 3│ 1│ 1│ 1│ 3│ 4│  4│   │
        │   │ Team C   │ 3│ 1│ 1│ 1│ 2│ 3│  4│   │
        │   │ Team D*  │ 2│ 1│ 0│ 1│ 2│ 2│  3│   │
        │   └──────────┴──┴──┴──┴──┴──┴──┴────┘   │
        │   *NO_SHOW match not counted              │
        └─────────────────────────────────────────┘

        PUBLIC UI
           │
├─ SCHEDULE: "No se presentaron" instead of "3 - 1"
            ├─ MATCH DETAIL: "No se presentaron" instead of score display
            └─ TEAM DETAIL: "No se presentaron" instead of score display

        GUARD
           │
           └─ RecordMatchResult: reject NO_SHOW edits (like isForfeit)
```

## Impact

| Level | Reason |
|-------|--------|
| 🟡 MED | Prisma schema enum migration required (add NO_SHOW value) |
| 🟡 MED | UI changes: admin form checkbox, public view label updates |
| 🟢 LOW | CalculateStandings logic is additive (filter condition) |
| 🟢 LOW | Match entity change is additive (new enum value + isNoShow method) |