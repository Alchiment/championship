## ADDED Requirements

### Requirement: Playoff phase activation
The system SHALL support an optional playoff phase that, when enabled, begins after the league phase completes. The admin configures the playoff cutoff (number of teams advancing, default 4) per tournament. Only the top N teams from the final league standings advance.

#### Scenario: Playoff phase starts with default cutoff
- **WHEN** the league phase completes and hasGroupPhase is enabled with playoffCutoff = 4
- **THEN** the top 4 teams from the final standings qualify for playoffs and the tournament transitions to PLAYOFFS

#### Scenario: Custom playoff cutoff
- **WHEN** an admin sets playoffCutoff = 2 and enables the group phase
- **THEN** only the top 2 teams from the league standings advance to playoffs (a direct final)

### Requirement: Semifinal and final bracket
The system SHALL generate a knockout bracket from qualified teams: 1st place vs 4th place (Semifinal 1), 2nd place vs 3rd place (Semifinal 2). Winners advance to the Final. The winner of the Final is declared tournament champion.

#### Scenario: Generate semifinal bracket
- **WHEN** 4 teams qualify from the league phase with positions 1st, 2nd, 3rd, 4th
- **THEN** the system creates Semifinal 1 (1st vs 4th) and Semifinal 2 (2nd vs 3rd) as SCHEDULED matches

#### Scenario: Semifinal winners advance to final
- **WHEN** both semifinal matches are completed
- **THEN** the system creates the Final match between the two semifinal winners

#### Scenario: Tournament champion declared
- **WHEN** the final match is completed
- **THEN** the winning team is declared champion and the tournament status changes to COMPLETED

### Requirement: 3rd place match (future extension)
The system SHALL include a THIRD_PLACE match phase in the data model, but MUST NOT create or enforce 3rd place matches in the current implementation. This phase exists in the MatchPhase enum for future activation.

#### Scenario: 3rd place match not created
- **WHEN** a playoff bracket is generated for the current version
- **THEN** no THIRD_PLACE match is created; only SEMIFINAL and FINAL matches are generated

#### Scenario: 3rd place match data model available
- **WHEN** the MatchPhase enum is defined in the database schema
- **THEN** it includes THIRD_PLACE as a valid value, but no UI or logic triggers its creation

### Requirement: Playoff disabled by default
The system SHALL default the group phase to disabled. When the group phase is disabled, the tournament transitions directly from LEAGUE_PHASE to COMPLETED upon all league matches finishing, and the league winner is the champion.

#### Scenario: Tournament without playoffs
- **WHEN** a tournament has hasGroupPhase = false and all league matches are completed
- **THEN** the tournament transitions directly to COMPLETED and the top-ranked team in standings is the champion

## Implementation Notes

- **Final match creation missing**: `GeneratePlayoffs` only creates SEMIFINAL matches. No trigger exists to detect when both semifinals complete and create a FINAL match. The `MatchPhase.FINAL` enum value exists but is never used.
- **Automatic COMPLETED transition missing**: No route or use case calls `Tournament.complete()`. When all league or playoff matches finish, the tournament status stays at LEAGUE_PHASE or PLAYOFFS indefinitely. An admin must manually change it via settings.