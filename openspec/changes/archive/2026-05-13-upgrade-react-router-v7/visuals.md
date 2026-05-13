## Visual

```
BEFORE (Remix v2)                                AFTER (React Router v7)
────────────────────                             ──────────────────────────

┌──────────────────────┐                         ┌──────────────────────┐
│   vite.config.ts      │                         │   vite.config.ts      │
│   @remix-run/dev      │                         │   @react-router/dev   │
│   future: { v3_* }    │                         │   (no future flags)   │
└──────────┬───────────┘                         └──────────┬───────────┘
           │                                                 │
┌──────────▼───────────┐                         ┌──────────▼───────────┐
│  package.json         │                         │  package.json         │
│  @remix-run/react     │                         │  react-router         │
│  @remix-run/node      │     ──────────▶        │  @react-router/dev   │
│  @remix-run/dev       │                         │  @react-router/node   │
│  @remix-run/serve      │                         │  @react-router/serve  │
│  react 18             │                         │  react 19             │
│  vite 5               │                         │  vite 6               │
└──────────┬───────────┘                         └──────────┬───────────┘
           │                                                 │
┌──────────▼───────────┐                         ┌──────────▼───────────┐
│  app/                 │                         │  app/                 │
│  ├── entry.server.tsx │  DELETED                │  (no entry files)     │
│  ├── entry.client.tsx │  DELETED                │                      │
│  ├── root.tsx         │  import swap            │  root.tsx             │
│  ├── routes/          │  import swap (21 files) │  routes/              │
│  ├── components/      │  import swap (3 files) │  components/          │
│  ├── utils/           │  import swap (2 files)  │  utils/               │
│  └── infrastructure/  │  import swap (1 file)  │  infrastructure/      │
└──────────────────────┘                         └──────────────────────┘

┌──────────────────────┐                         ┌──────────────────────┐
│  vercel.json          │                         │  vercel.json          │
│  framework: "remix"   │     ──────────▶        │  framework:           │
│                       │                         │    "react-router"    │
└──────────────────────┘                         └──────────────────────┘

Import Map:
  @remix-run/react   ──▶  react-router
  @remix-run/node    ──▶  react-router
  @remix-run/dev     ──▶  @react-router/dev/vite

  RemixBrowser  ──▶  (removed, framework default)
  RemixServer   ──▶  (removed, framework default)
  json           ──▶  json (same, from react-router)
  redirect       ──▶  redirect (same, from react-router)
  Form           ──▶  Form (same, from react-router)
  Link           ──▶  Link (same, from react-router)
  useLoaderData  ──▶  useLoaderData (same, from react-router)
  createCookieSessionStorage ──▶  (same, from react-router)
```

## Impact

| Level | Reason |
|-------|--------|
| 🔴 HIGH | `entry.server.tsx` and `entry.client.tsx` deleted — SSR/hydration handled by framework |
| 🔴 HIGH | `vite.config.ts` plugin change and future flags removal — build pipeline affected |
| 🔴 HIGH | `vercel.json` framework change — deployment adapter switched |
| 🟡 MED | ~30 file import renames — mechanical but high volume, must be exact |
| 🟡 MED | React 18 → 19 upgrade — potential deprecation warnings for legacy APIs |
| 🟡 MED | Vite 5 → 6 upgrade — minor config changes possible |
| 🟢 LOW | `package.json` scripts change — simple string replacement |
| 🟢 LOW | Session cookie format — identical underlying `cookie` package, no migration |
| 🟢 LOW | Domain/infrastructure layer — zero changes (no Remix imports) |