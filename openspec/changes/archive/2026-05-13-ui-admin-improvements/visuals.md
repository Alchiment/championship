## Visual

```
                    ┌─────────────────────────────────────────────┐
                    │           PUBLIC NAVIGATION                 │
                    │                                             │
                    │  Top Nav: Tabla | Calendario | Equipos      │
                    │  ──────────────────────────────────────────  │
                    │  BottomNav: Tabla | Calendario | Equipos    │
                    │             ┌─────────────────────────────┐  │
                    │             │  4th tab (was "Mas"):        │  │
                    │             │  Admin → /admin  (if admin) │  │
                    │             │  Ingresar → /login (if anon) │  │
                    │             │  Hidden (if non-admin auth)  │  │
                    │             └─────────────────────────────┘  │
                    └─────────────────────────────────────────────┘

  ┌──────────────────────┐         ┌──────────────────────────────┐
  │   PUBLIC ROOT (/)     │         │      ADMIN DASHBOARD        │
  │                       │         │                              │
  │  OLD: TournamentInfo  │         │  + "Bienvenido" heading      │
  │  NEW: → redirect to   │         │  + Quick nav links:          │
  │        /standings     │         │    Equipos | Partidos |      │
  │                       │         │    Configuracion              │
  └──────────────────────┘         │  + Status cards (existing)    │
                                   └──────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────┐
  │                  TEAM CREATION FORM (Admin)                   │
  │                                                                │
  │  OLD: [Nombre]  [Codigo]  [Bandera]  → Submit                │
  │  NEW: [Nombre]  [Bandera]          → Submit                   │
  │       └── code auto-generated from name lookup                 │
  └──────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────┐
  │      FLAGBADGE COMPONENT         │
  │                                  │
  │  OLD: 🇪🇸 ESP                    │
  │  NEW: 🇪🇸                        │
  └─────────────────────────────────┘

  ┌──────────────────────────────────────────────────────┐
  │            ADMIN TEAMS TABLE                          │
  │                                                       │
  │  Nombre  | Bandera | Jugadores | Acciones             │
  │  España  | 🇪🇸    | 5          | [→Players] [Retirar] │
  │                        ▲                              │
  │           NEW: link to /team/:id for player view       │
  └──────────────────────────────────────────────────────┘
```

## Impact

| Level | Reason |
|-------|--------|
| 🟢 | Country code generation — additive utility, no schema change |
| 🟡 | Hide code from UI — FlagBadge API change (removes `code` prop display), admin form field removal |
| 🟡 | Admin player link — new navigation link, no data changes |
| 🟡 | Dashboard welcome + links — UI addition, no breaking change |
| 🟡 | Public root redirect — changes `/` behavior from render to redirect |
| 🟡 | BottomNav tab change — replaces "Mas" with conditional links, minor UX shift |