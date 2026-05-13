## ADDED Requirements

### Requirement: Country code generation from team name
The system SHALL automatically generate a 3-letter country code from the team name during team creation. When a team name matches a known country in the mapping (Spanish names), the system SHALL use the corresponding ISO 3166-1 alpha-3 code. When the team name is not found in the mapping, the system SHALL derive the code from the first 3 uppercase letters of the team name. The system MUST NOT require manual input of the country code from the user.

#### Scenario: Known country name generates correct code
- **WHEN** an admin creates a team with the name "España"
- **THEN** the system SHALL set the code to "ESP"

#### Scenario: Unknown country name falls back to first 3 letters
- **WHEN** an admin creates a team with a name not in the country mapping
- **THEN** the system SHALL set the code to the first 3 uppercase letters of the name

#### Scenario: Short name uses available letters
- **WHEN** an admin creates a team with a name shorter than 3 characters
- **THEN** the system SHALL set the code using available letters, padded if necessary