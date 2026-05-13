## ADDED Requirements

### Requirement: Responsive public navigation
The system SHALL provide a two-mode navigation for public pages: a horizontal top navigation bar on screens md and above, and a fixed bottom tab bar on screens below md. The top nav SHALL display the app name "K108 Torneo" on the left, navigation links (Tabla, Calendario, Equipos) in the center-right, and auth links on the far right. The bottom tab bar SHALL display 4 items: Tabla (standings), Calendario (schedule), Equipos (teams), and a Más/Menu overflow for auth. Active navigation items SHALL use `text-accent` and a bottom border or dot indicator.

#### Scenario: Desktop navigation rendering
- **WHEN** a user views a public page on a screen 768px or wider
- **THEN** the top navigation bar displays with `bg-surface border-b border-default`, showing the app name, navigation links, and auth controls in a horizontal row

#### Scenario: Mobile bottom tab bar rendering
- **WHEN** a user views a public page on a screen narrower than 768px
- **THEN** the bottom tab bar is fixed to the viewport bottom with `bg-surface border-t border-default`, showing Tabla, Calendario, Equipos, and Más tabs with the active tab highlighted in amber

#### Scenario: Active nav item indication
- **WHEN** a user is on the standings page
- **THEN** the "Tabla" nav item and bottom tab display `text-accent` styling with an active indicator, while other nav items show `text-secondary`

### Requirement: Public page layout
The system SHALL render public pages with a full `bg-base` background, content constrained to `max-w-5xl mx-auto`, and bottom padding on mobile to account for the fixed tab bar (pb-20). The tournament info section SHALL appear above the outlet content on all public pages.

#### Scenario: Mobile content scroll without overlap
- **WHEN** content extends below the viewport on mobile
- **THEN** the bottom tab bar remains fixed and content scrolls behind it with sufficient bottom padding to prevent content from being hidden

#### Scenario: Desktop content width
- **WHEN** a user views a public page on desktop
- **THEN** content is centered with `max-w-5xl mx-auto` and no bottom tab bar is visible

### Requirement: Admin responsive layout
The system SHALL render the admin layout with a sidebar on desktop (md+) and a horizontal tab bar at the top on mobile (<md). The sidebar SHALL use `bg-surface border-r border-default` with navigation items `text-secondary hover:text-primary hover:bg-elevated`. Active admin nav items SHALL use `text-accent bg-elevated/50`.

#### Scenario: Admin sidebar on desktop
- **WHEN** an admin views the dashboard on a screen 768px or wider
- **THEN** a left sidebar of width 256px (w-64) displays with Dashboard, Partidos, Equipos, and Configuración links, and admin content fills the remaining space

#### Scenario: Admin horizontal tabs on mobile
- **WHEN** an admin views the dashboard on a screen narrower than 768px
- **THEN** a horizontal tab bar displays below the top bar with the same navigation items in a scrollable row, and content fills the full width below