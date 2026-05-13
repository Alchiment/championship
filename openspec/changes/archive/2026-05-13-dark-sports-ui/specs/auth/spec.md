## MODIFIED Requirements

### Requirement: WhatsApp-based authentication
The system SHALL authenticate users through the Meta WhatsApp Business Cloud API. Users enter their phone number, receive a verification code via WhatsApp, and enter the code to authenticate. Authentication uses Remix cookie-based sessions. The visual presentation of login and verification pages SHALL use a dark background (`bg-base`) with a contained card (`bg-surface border border-default rounded-2xl`) centered on the page. The app name "K108 Torneo" SHALL display at the top of the card. Input fields SHALL use dark form styling with amber focus rings. The submit button SHALL use the primary button style (amber background, dark text).

#### Scenario: User views login page
- **WHEN** an unauthenticated user navigates to the login page
- **THEN** the page renders with a full dark background, a centered card containing the app name, a phone input field with dark styling, and an amber "Enviar código" button

#### Scenario: User views verification page
- **WHEN** a user has received a verification code and the verification form displays
- **THEN** the page renders with the same dark card styling, showing the phone number that received the code, a 6-character code input field with amber focus ring, and an amber "Verificar" button