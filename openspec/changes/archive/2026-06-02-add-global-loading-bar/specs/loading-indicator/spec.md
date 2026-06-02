## ADDED Requirements

### Requirement: Global loading bar visibility
The system SHALL display a thin horizontal bar at the top of the viewport whenever React Router navigation state is not "idle" (i.e., during "loading" or "submitting" states).

#### Scenario: Form submission in progress
- **WHEN** a user submits a form and the navigation state transitions to "submitting"
- **THEN** the loading bar SHALL appear at the top of the viewport with an indeterminate animation

#### Scenario: Page navigation in progress
- **WHEN** a user navigates to a new page and the navigation state transitions to "loading"
- **THEN** the loading bar SHALL appear at the top of the viewport with an indeterminate animation

#### Scenario: Navigation completes
- **WHEN** the navigation state returns to "idle"
- **THEN** the loading bar SHALL disappear

### Requirement: Loading bar visual style
The loading bar SHALL be a fixed-position element at the top of the viewport, using the application's accent color with an indeterminate sliding animation.

#### Scenario: Bar appearance
- **WHEN** the loading bar is visible
- **THEN** it SHALL be positioned at the top of the viewport with `position: fixed`, full width, approximately 3px height, and use the accent color (`#f59e0b` / Tailwind `accent`) at partial opacity

#### Scenario: Bar animation
- **WHEN** the loading bar is visible
- **THEN** it SHALL display an indeterminate animation that slides a shorter bar segment across the full width repeatedly

### Requirement: Global mounting in root layout
The loading bar SHALL be mounted in `root.tsx` so it applies to all routes without requiring per-page changes.

#### Scenario: Root layout includes loading bar
- **WHEN** the application renders
- **THEN** the `App` component in `root.tsx` SHALL include the loading bar above the `<Outlet />`

#### Scenario: No per-route setup required
- **WHEN** any route triggers navigation
- **THEN** the loading bar SHALL appear regardless of which route is active, without any additional configuration in that route