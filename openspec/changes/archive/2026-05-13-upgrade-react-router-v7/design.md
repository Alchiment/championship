## Context

The championship app runs on Remix v2.17.4 with the Vite plugin, deployed to Vercel. The codebase has ~30 files importing from `@remix-run/*`, using standard Remix patterns: loaders, actions, `Form`, `Link`, `json`, `redirect`, cookie sessions, and custom entry files for streaming SSR. Three future flags are already enabled (`v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`), indicating alignment with React Router v3 defaults.

Remix v2 is end-of-life. React Router v7 (7.15.0) is the successor — it merges Remix and React Router into a single `react-router` package with `@react-router/*` for build/server concerns. The migration is mechanical but touches every route and config file.

**Current stack:**
- Remix v2.17.4 (`@remix-run/react`, `@remix-run/node`, `@remix-run/dev`, `@remix-run/serve`)
- React 18.3.1 + React DOM 18.3.1
- Vite 5.4.0
- Vercel deployment (`framework: "remix"`)

**Target stack:**
- React Router v7.15.0 (`react-router`, `@react-router/dev`, `@react-router/node`, `@react-router/serve`)
- React 19.x + React DOM 19.x
- Vite 6.x
- Vercel deployment (`framework: "react-router"`)

## Goals / Non-Goals

**Goals:**
- Migrate from Remix v2 to React Router v7 with zero functional regressions
- Upgrade React 18 → 19 and Vite 5 → 6 for security and long-term support
- Remove custom entry files that the framework now handles by default
- Preserve all existing session/cookie behavior (logged-in users keep their sessions)
- Maintain identical deployment to Vercel with framework adapter change

**Non-Goals:**
- Refactoring business logic or domain layer during migration
- Adding new features or changing UI behavior
- Changing the file-based routing structure
- Migrating to a custom server (staying on Vercel adapter)
- Switching CSS/tooling (Tailwind, PostCSS stay as-is)

## Decisions

### Decision 1: Delete entry.server.tsx and entry.client.tsx

**Choice**: Delete both custom entry files and use framework defaults.

**Rationale**: The 107-line `entry.server.tsx` does bot-vs-browser streaming differentiation with `isbot`, which React Router v7 handles internally. The 12-line `entry.client.tsx` only adds `<StrictMode>` wrapping around `RemixBrowser`, which is a dev convenience not worth maintaining a custom entry for. Removing both eliminates migration complexity and lets the framework own streaming/hydration behavior.

**Alternatives considered**:
- Rewrite both files with new imports (`RemixServer` → `ServerRouter`, `RemixBrowser` → `ClientRouter`) — more work, same result
- Keep `entry.client.tsx` with StrictMode wrapping — adds maintenance burden for minimal value

### Decision 2: Upgrade React 18 → 19 in the same migration

**Choice**: Upgrade React alongside the framework migration.

**Rationale**: React Router v7 supports React 18 and 19, but React 18 is approaching end-of-life. Combining both upgrades avoids a second migration pass. React 19's `hydrateRoot` changes are handled by the framework's default entry point, so no custom code needs updating.

**Alternatives considered**:
- Stay on React 18, migrate framework only, upgrade React later — doubles the work
- This was rejected because it creates a window where the stack is partially outdated

### Decision 3: Use Vercel's React Router adapter

**Choice**: Change `vercel.json` framework field to `"react-router"`.

**Rationale**: Vercel has first-class React Router v7 support. No custom server setup is needed. The `@react-router/serve` package is only needed for local `npm run start` testing.

**Alternatives considered**:
- Custom Express server — unnecessary complexity for Vercel deployment
- Custom Hono server — over-engineering for current needs

### Decision 4: Upgrade Vite 5 → 6

**Choice**: Upgrade Vite to v6 alongside the migration.

**Rationale**: `@react-router/dev@7.15.0` supports Vite 5, 6, 7, and 8. Vite 6 is the stable recommended version. Upgrading now avoids another config touch later.

### Decision 5: Import mapping strategy

**Choice**: All `@remix-run/react` and `@remix-run/node` imports map to `react-router`. Only `createCookieSessionStorage`, `createReadableStreamFromReadable`, and `Session` type map to `@react-router/node` (though these are only relevant if entry files are kept, which they aren't). `Session` type used in `auth.service.ts` maps to `react-router`.

**Rationale**: React Router v7 consolidates the Remix runtime APIs into `react-router`. The `@react-router/node` package exists but is primarily for build/server adapters. `createCookieSessionStorage` is re-exported from `react-router`.

### Decision 6: Remove future flags from vite.config.ts

**Choice**: Remove all three future flags (`v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`).

**Rationale**: In React Router v7, these behaviors are the default. The future flags only exist in Remix v2 as opt-in mechanisms.

## Risks / Trade-offs

**[Session cookie format compatibility]** → React Router v7 uses the same `cookie` npm package internally. The `_session` cookie name and serialization format remain identical. Sessions survive the migration. **Mitigation**: Verify manually by logging in before deploy, then accessing the app after deploy with the same browser.

**[API route behavior]** → Resource routes (files under `api.*.tsx`) use standard loader/action patterns. The import changes are mechanical. **Mitigation**: Run integration tests against `/api/teams`, `/api/matches`, `/api/standings` after migration.

**[Vercel build adapter]** → Changing `framework: "remix"` to `"framework": "react-router"` in `vercel.json` changes how Vercel builds and routes. **Mitigation**: Deploy to a preview branch first and verify all routes.

**[Entry file removal]** → Deleting `entry.server.tsx` removes explicit `isbot` handling and streaming configuration. The framework default handles this, but configuration nuances (like `ABORT_DELAY`) are lost. **Mitigation**: Default behavior matches Remix v2's recommended setup. If custom streaming is needed later, re-add the entry file.

**[Type changes]** → `LoaderFunctionArgs`, `ActionFunctionArgs`, `LinksFunction` etc. may have subtle type changes in React Router v7. **Mitigation**: Run `tsc --noEmit` after migration to catch type errors.

**[React 19 breaking changes]** → React 19 removes some deprecated APIs (`defaultProps`, `string refs`). The codebase uses functional components with hooks — low risk. **Mitigation**: Run `typecheck` after upgrade.

## Migration Plan

1. **Branch**: Create `upgrade-react-router-v7` branch
2. **Phase 1 — Package swap**: Remove `@remix-run/*`, add `react-router` + `@react-router/*`, upgrade React + Vite
3. **Phase 2 — Config**: Update `vite.config.ts`, `package.json` scripts, `vercel.json`
4. **Phase 3 — Import migration**: Replace all `@remix-run/*` imports across ~30 files
5. **Phase 4 — Entry files**: Delete `entry.server.tsx` and `entry.client.tsx`
6. **Phase 5 — Verify**: Run typecheck, lint, dev server, all routes
7. **Phase 6 — Deploy**: Push to Vercel preview, verify production behavior
8. **Rollback**: Revert to `@remix-run/*` packages and config — all changes are reversible via git

## Open Questions

- None. The migration path is well-defined and the codebase uses standard patterns throughout.