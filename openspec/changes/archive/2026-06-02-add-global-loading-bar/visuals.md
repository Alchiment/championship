## Visual

```
┌──────────────────────────────────────────────────────────┐
│  root.tsx                                                 │
│                                                          │
│  useNavigation() → state: idle | loading | submitting    │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────────┐│
│  │ ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░  LoadingBar    ││
│  └──────────────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────────────┐│
│  │                                                      ││
│  │  <Outlet />                                          ││
│  │  (page content renders below)                       ││
│  │                                                      ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘

State transitions:

  idle ────────────▶ loading/submitting ────────────▶ idle
  (bar hidden)      (bar slides in, animates)        (bar fades out)

Bar animation (indeterminate):

  ┌────────────────────────────────────┐
  │     ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░    │  ← slides right
  │     ░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓    │  ← resets, slides again
  └────────────────────────────────────┘
  accent-500 at ~70% opacity, 3px tall
```

## Impact

| Level | Reason |
|-------|--------|
| 🟢 LOW | Additive only — new component + mounting in root.tsx, no existing behavior changed |