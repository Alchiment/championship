## Why

Remix v2 (2.17.4) is the final v2 release. The project's upstream framework is now React Router v7, which merges Remix and React Router into a single package. Remaining on Remix v2 means no security patches, no bug fixes, and growing dependency drift. All future flags (`v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`) are already enabled, confirming the codebase aligns with v3 defaults.

## What Changes

- **BREAKING**: Replace `@remix-run/react`, `@remix-run/node`, `@remix-run/dev`, `@remix-run/serve` with `react-router`, `@react-router/dev`, `@react-router/node`, `@react-router/serve`
- **BREAKING**: All `@remix-run/*` imports across ~30 files must change to `react-router` / `@react-router/node`
- **BREAKING**: `vite.config.ts` plugin changes from `@remix-run/dev` to `@react-router/dev/vite` and removes future flags (now defaults)
- **BREAKING**: `entry.server.tsx` deleted — framework default handles `isbot` detection and streaming
- **BREAKING**: `entry.client.tsx` deleted — framework default handles hydration
- `package.json` scripts updated (`remix vite:dev` → `react-router dev`, etc.)
- `vercel.json` framework field updated from `"remix"` to `"react-router"`
- Upgrade React 18 → 19, React DOM 18 → 19, and corresponding type packages
- Upgrade Vite 5 → 6 (both supported by React Router v7, v6 recommended for security)

## Capabilities

### New Capabilities
- `framework-upgrade`: Covers the full Remix v2 → React Router v7 migration including package swaps, import renames, config changes, entry file removal, and deployment config

### Modified Capabilities
- `admin-player-access`: Import paths for `@remix-run/*` in auth routes change to `react-router`
- `team-management`: Import paths for `@remix-run/*` in admin/team routes change to `react-router`

## Impact

- **~30 source files**: All files importing from `@remix-run/*` need import path changes
- **Dependencies**: 4 Remix packages removed, 4 React Router packages added, React/Vite major upgrades
- **Build pipeline**: Vite plugin and scripts completely change
- **Deployment**: Vercel framework adapter changes
- **Session cookies**: `createCookieSessionStorage` migrates from `@remix-run/node` to `@react-router/node` — same API, but existing sessions must continue to work (they will: same `cookie` package under the hood)
- **Zero business logic changes**: All domain, infrastructure, and facade layers are unaffected