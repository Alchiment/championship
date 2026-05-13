## MODIFIED Requirements

### Requirement: Responsive public navigation
The system SHALL provide a two-mode navigation for public pages: a horizontal top navigation bar on screens md and above, and a fixed bottom tab bar on screens below md. The top nav SHALL display the app name "K108 Torneo" on the left, navigation links (Tabla, Calendario, Equipos) in the center-right, and auth links on the far right. The bottom tab bar SHALL display 4 items: Tabla (standings), Calendario (schedule), Equipos (teams), and a context-sensitive tab that shows "Admin" for authenticated admin users (linking to `/admin`), "Ingresar" for unauthenticated users (linking to `/login`), and is hidden for authenticated non-admin users. Active navigation items SHALL use `text-accent` and a bottom border or dot indicator.

#### Scenario: Desktop navigation rendering
- **WHEN** a user views a public page on a screen 768px or wider
- **THEN** the top navigation bar displays with `bg-surface border-b border-default`, showing the app name, navigation links, and auth controls in a horizontal row

#### Scenario: Mobile bottom tab bar for admin user
- **WHEN** an authenticated admin user views a public page on a screen narrower than 768px
- **THEN** the bottom tab bar shows 4 tabs: Tabla, Calendario, Equipos, and "Admin" (with a shield/key icon), where the Admin tab links to `/admin`

#### Scenario: Mobile bottom tab bar for unauthenticated user
- **WHEN** an unauthenticated user views a public page on a screen narrower than 768px
- **THEN** the bottom tab bar shows 4 tabs: Tabla, Calendario, Equipos, and "Ingresar" (with a login icon), where the Ingresar tab links to `/login`

#### Scenario: Active nav item indication
- **WHEN** a user is on the standings page
- **THEN** the "Tabla" nav item and bottom tab display `text-accent` styling with an active indicator, while other nav items show `text-secondary`

### Requirement: Admin dashboard welcome and navigation
The system SHALL render the admin dashboard with a Spanish welcome title "Bienvenido" and quick-access navigation links to key admin sections (Equipos, Partidos, Configuración). The welcome section MUST be displayed above any existing status cards. When no tournament is active, the dashboard SHALL display a message encouraging the admin to configure a tournament with a link to settings.

#### Scenario: Admin views dashboard with active tournament
- **WHEN** an admin navigates to the dashboard with an active tournament
- **THEN** the page displays a "Bienvenido" heading, quick-access links to Equipos, Partidos, and Configuración, followed by the existing status cards

#### Scenario: Admin views dashboard without tournament
- **WHEN** an admin navigates to the dashboard with no active tournament
- **THEN** the page displays a "Bienvenido" heading and a message prompting to configure a tournament, with a link to the settings page

## ADDED Requirements

### Requirement: Public root redirect to standings
The system SHALL redirect the public root URL (`/`) to the standings page (`/standings`) immediately upon navigation, without rendering an intermediate page.

#### Scenario: User navigates to public root
- **WHEN** any user navigates to `/` on the public site
- **THEN** the system redirects to `/standings`