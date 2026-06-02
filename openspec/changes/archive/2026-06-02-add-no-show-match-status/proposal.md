## Why

When both teams fail to show up for a match, there is currently no way to mark the match as a double no-show. The existing WITHDRAWN flow handles single-team withdrawals (awarding a 3-0 walkover), but if neither team appears, both should receive 0 points and the match should not count in standings. A dedicated NO_SHOW match status provides a clean, explicit way to handle this scenario.

## What Changes

- Add `NO_SHOW` value to the `MatchStatus` enum in Prisma schema and domain entity
- Add a "both teams no-show" checkbox in the admin match form that sets the match status to `NO_SHOW`
- Update `CalculateStandings` to exclude `NO_SHOW` matches from accumulation (0 played, 0 goals, 0 points for both teams)
- Prevent editing of `NO_SHOW` matches (locked like forfeit matches)
- Display "No show" label on public-facing match views instead of scores
- Add `isNoShow()` method to the `Match` domain entity

## Capabilities

### New Capabilities
- `no-show-match`: Handles marking matches as double no-show, displaying them in the UI, and ensuring they are excluded from standings accumulation

### Modified Capabilities

## Impact

- **Prisma schema**: Migration required to add `NO_SHOW` to `MatchStatus` enum
- **Match entity**: New status value and `isNoShow()` method
- **CalculateStandings use case**: Filter logic updated to skip `NO_SHOW` matches
- **Admin match form**: New checkbox UI element and action handler
- **Public views**: Match cards and detail pages must render "No show" instead of scores
- **RecordMatchResult use case**: Guard against editing `NO_SHOW` matches