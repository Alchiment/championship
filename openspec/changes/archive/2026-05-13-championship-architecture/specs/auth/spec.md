## ADDED Requirements

### Requirement: WhatsApp-based authentication
The system SHALL authenticate users through the Meta WhatsApp Business Cloud API. Users enter their phone number, receive a verification code via WhatsApp, and enter the code to authenticate. Authentication uses Remix cookie-based sessions.

#### Scenario: User initiates login
- **WHEN** a user visits the login page and enters their phone number
- **THEN** the system sends a verification code to that number via WhatsApp using the Meta Business API

#### Scenario: User submits verification code
- **WHEN** the user submits the correct verification code received via WhatsApp
- **THEN** the system authenticates the user and creates a Remix cookie session with their identity

#### Scenario: Invalid verification code
- **WHEN** a user submits an incorrect verification code
- **THEN** the system rejects the attempt and allows retry without creating a session

### Requirement: Role-based access control
The system SHALL distinguish between two roles: admin and public (unauthenticated). Admins have full CRUD access to all tournament data. Public users have read-only access to all public views. Only users flagged as admin in the database SHALL access admin routes and operations.

#### Scenario: Admin user accesses admin dashboard
- **WHEN** an authenticated admin user accesses /admin routes
- **THEN** the system grants access to the admin dashboard with full CRUD capabilities

#### Scenario: Regular user attempts admin access
- **WHEN** an authenticated non-admin user attempts to access /admin routes
- **THEN** the system redirects them to the public home page with an unauthorized message

#### Scenario: Unauthenticated user attempts admin operation
- **WHEN** an unauthenticated user attempts to create, update, or delete any entity
- **THEN** the system rejects the request with a 401 Unauthorized response

### Requirement: Session management
The system SHALL use Remix cookie-based sessions for authenticated users. Sessions SHALL expire after a configurable timeout. Session data SHALL include the user's phone number and admin role flag.

#### Scenario: Session expires
- **WHEN** a user's session expires due to timeout
- **THEN** the user is redirected to the login page and must re-authenticate via WhatsApp

#### Scenario: User logs out
- **WHEN** a user explicitly logs out
- **THEN** the session cookie is destroyed and the user is redirected to the public home page

### Requirement: Admin user seeding
The system SHALL allow at least one admin user to be configured, either through environment configuration or database seeding, so that the first admin can access the system after initial deployment.

#### Scenario: First admin access
- **WHEN** the application is deployed for the first time
- **THEN** at least one phone number is pre-configured as admin via environment variable or seed data, enabling immediate admin access after WhatsApp verification

## Implementation Notes

- **Non-admin auth response non-compliant**: `requireAdmin()` throws `new Response(null, { status: 403, statusText: "Forbidden" })` for non-admin authenticated users. The spec requires a redirect to the public home page with an unauthorized message, not a raw HTTP 403 error.
- **Cookie session `isAdmin` serialization**: The session stores `isAdmin` as a string via cookie, which caused a bug where `"true" || false` evaluated incorrectly. Fixed by parsing with `=== "true"`.