## ADDED Requirements

### Requirement: React Router v7 package structure
The system SHALL use `react-router` as the sole runtime package, replacing all `@remix-run/react` and `@remix-run/node` imports. The build pipeline SHALL use `@react-router/dev/vite` as the Vite plugin. The local start command SHALL use `@react-router/serve`.

#### Scenario: Import resolution after migration
- **WHEN** a source file previously imported from `@remix-run/react` or `@remix-run/node`
- **THEN** the same named export SHALL be available from `react-router`

#### Scenario: Vite build with new plugin
- **WHEN** the build command runs
- **THEN** `@react-router/dev/vite` plugin processes all route files and produces a deployable build

#### Scenario: Local production server
- **WHEN** `npm run start` executes
- **THEN** `@react-router/serve` serves the built application on localhost

### Requirement: All future flags removed from config
The `vite.config.ts` SHALL NOT contain any `future` flags (`v3_fetcherPersist`, `v3_relativeSplatPath`, `v3_throwAbortReason`). These behaviors are the default in React Router v7.

#### Scenario: Vite config has no future flags
- **WHEN** the vite config is read
- **THEN** no `future` property exists on the remix/react-router plugin configuration

### Requirement: Framework default entry points
The application SHALL NOT contain `entry.server.tsx` or `entry.client.tsx`. The framework defaults for server-side streaming (including `isbot` detection) and client-side hydration SHALL be used.

#### Scenario: SSR with isbot detection
- **WHEN** a bot user-agent requests a page
- **THEN** the framework default entry renders the full page before streaming without a custom entry file

#### Scenario: Client hydration
- **WHEN** the browser loads the page
- **THEN** the framework default entry hydrates the application without a custom entry file

### Requirement: Vercel deployment with React Router adapter
The `vercel.json` framework field SHALL be `"react-router"`. The build and output configuration SHALL match React Router v7's expected build structure.

#### Scenario: Vercel builds with React Router
- **WHEN** Vercel receives a deployment
- **THEN** it detects `framework: "react-router"` and builds using the React Router build command

### Requirement: React 19 compatibility
The application SHALL run on React 19 and React DOM 19. All components using React APIs SHALL remain functionally identical after the upgrade.

#### Scenario: Hydration under React 19
- **WHEN** a page loads in the browser
- **THEN** React 19 hydrates the server-rendered content without errors or hydration mismatches

### Requirement: Vite 6 build pipeline
The application SHALL build and develop using Vite 6.x.

#### Scenario: Dev server starts
- **WHEN** `npm run dev` executes
- **THEN** Vite 6 starts the development server with hot module replacement

#### Scenario: Production build
- **WHEN** `npm run build` executes
- **THEN** Vite 6 produces an optimized production build

### Requirement: Session cookie compatibility
Existing session cookies (name `_session`) created under `@remix-run/node`'s `createCookieSessionStorage` SHALL remain readable after migration to `react-router`'s session API. No user SHALL be logged out by the migration.

#### Scenario: Existing session persists
- **WHEN** a user has an active session cookie set by the Remix v2 app
- **THEN** the React Router v7 app SHALL read and validate that same cookie without requiring re-login