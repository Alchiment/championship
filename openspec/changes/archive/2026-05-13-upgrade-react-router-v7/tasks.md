## 1. Package Layer

- [x] 1.1 Remove `@remix-run/react`, `@remix-run/node`, `@remix-run/dev`, `@remix-run/serve` from package.json dependencies
- [x] 1.2 Add `react-router`, `@react-router/dev`, `@react-router/node`, `@react-router/serve` as dependencies (version 7.15.0)
- [x] 1.3 Upgrade `react` and `react-dom` to ^19.x
- [x] 1.4 Upgrade `@types/react` and `@types/react-dom` to ^19.x
- [x] 1.5 Upgrade `vite` to ^6.x
- [x] 1.6 Run `npm install` and verify no dependency conflicts

## 2. Configuration

- [x] 2.1 Update `vite.config.ts`: change `@remix-run/dev` import to `@react-router/dev/vite`, rename plugin call from `remix()` to `reactRouter()`, remove all `future` flags
- [x] 2.2 Update `package.json` scripts: `dev` → `react-router dev`, `build` → `react-router build`, `start` → `react-router-serve ./build/server/index.js`
- [x] 2.3 Update `vercel.json`: change `framework` from `"remix"` to `"react-router"`

## 3. Entry File Removal

- [x] 3.1 Delete `app/entry.server.tsx`
- [x] 3.2 Delete `app/entry.client.tsx`

## 4. Import Migration (Route Files)

- [x] 4.1 Update `app/routes/_public.index.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.2 Update `app/routes/_public.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.3 Update `app/routes/_public.team.$id.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.4 Update `app/routes/_public.teams.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.5 Update `app/routes/_public.match.$id.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.6 Update `app/routes/_public.schedule.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.7 Update `app/routes/_public.standings.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.8 Update `app/routes/admin.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.9 Update `app/routes/admin.index.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.10 Update `app/routes/admin.teams.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.11 Update `app/routes/admin.matches.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.12 Update `app/routes/admin.settings.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.13 Update `app/routes/_auth.login.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.14 Update `app/routes/_auth.verify.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.15 Update `app/routes/_auth.logout.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.16 Update `app/routes/api.teams.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.17 Update `app/routes/api.teams.$id.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.18 Update `app/routes/api.matches.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.19 Update `app/routes/api.matches.$id.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.20 Update `app/routes/api.standings.tsx`: replace `@remix-run/*` imports with `react-router`
- [x] 4.21 Update `app/routes/$.tsx`: replace `@remix-run/*` imports with `react-router`

## 5. Import Migration (Shared Files)

- [x] 5.1 Update `app/root.tsx`: replace `@remix-run/react` and `@remix-run/node` imports with `react-router`
- [x] 5.2 Update `app/components/ui/BottomNav.tsx`: replace `@remix-run/react` import with `react-router`
- [x] 5.3 Update `app/components/ui/MatchCard.tsx`: replace `@remix-run/react` import with `react-router`
- [x] 5.4 Update `app/components/ui/StandingsTable.tsx`: replace `@remix-run/react` import with `react-router`
- [x] 5.5 Update `app/utils/session.server.ts`: replace `@remix-run/node` import with `react-router`
- [x] 5.6 Update `app/infrastructure/auth/auth.service.ts`: replace `@remix-run/node` type import with `react-router`

## 6. Verification

- [x] 6.1 Run `npm run typecheck` and fix any type errors
- [x] 6.2 Run `npm run lint` and fix any lint issues
- [x] 6.3 Run `npm run build` and verify successful production build
- [x] 6.4 Run `npm run dev` and verify the dev server starts
- [x] 6.5 Manually verify all public routes load correctly (home, teams, team detail, match detail, schedule, standings)
- [x] 6.6 Manually verify admin routes and auth flows (login, verify, logout, admin CRUD)
- [x] 6.7 Manually verify API routes return correct data (/api/teams, /api/matches, /api/standings)
- [ ] 6.8 Verify existing session cookies still work (login before deploy, check session persists after deploy)
- [ ] 6.9 Deploy to Vercel preview branch and verify production behavior