## Context

The championship app tracks round-robin league matches between teams. Matches currently have three statuses: SCHEDULED, IN_PROGRESS, and COMPLETED. There is an existing mechanism for team withdrawal (`TeamStatus.WITHDRAWN`) that auto-completes future matches as 3-0 walkovers. However, when both teams fail to show up for a match, there is no way to represent this — the admin has no UI control to mark the match, and no status exists to signal it. The result is that such matches either remain SCHEDULED indefinitely or are incorrectly recorded as a normal result.

## Goals / Non-Goals

**Goals:**
- Allow admin to mark a match as a double no-show via a checkbox in the match result form
- Ensure NO_SHOW matches are completely excluded from standings calculations (0 played, 0 goals, 0 points for both teams)
- Prevent NO_SHOW matches from being edited (locked status)
- Display a clear "No show" label on public match views instead of scores

**Non-Goals:**
- Handling single-team no-show differently from the existing WITHDRAWN flow (that remains 3-0 walkover)
- Adding per-team no-show flags (NO_SHOW means both teams didn't show)
- Changing the existing WITHDRAWN/auto-walkover mechanism
- Sending notifications for no-show events

## Decisions

**1. Use a new `MatchStatus` enum value rather than per-team boolean flags**

Alternatives considered:
- Per-team `homeNoShow`/`awayNoShow` boolean fields — more flexible but over-engineered for the current need. The requirement is specifically for both teams not showing up; single no-show is already handled by WITHDRAWN.
- Sentinel score values (-1) — implicit, leaks domain logic into score data, requires checks everywhere scores are consumed.

`NO_SHOW` as a match status is explicit, clean, and follows the existing pattern of `MatchStatus` enum values.

**2. NO_SHOW matches are invisible to standings**

Rather than accumulating 0 points and incrementing `played`, NO_SHOW matches are filtered out entirely from `CalculateStandings`. This means: no played count, no goal difference impact, no points — as if the match never occurred in the table.

**3. NO_SHOW is a terminal, non-editable status**

Like forfeit matches (protected by `isForfeit()`), `NO_SHOW` matches cannot have their results modified. The `RecordMatchResult` use case will reject attempts to update a `NO_SHOW` match. If a correction is needed, it must be done manually in the database.

**4. Admin UI uses a checkbox, not the score fields**

When the "both teams no-show" checkbox is checked, score inputs are irrelevant. The action handler sets `status: "NO_SHOW"` and `homeScore: null, awayScore: null` (no scores needed).

## Risks / Trade-offs

- **[Risk] NO_SHOW can't represent single-team no-show** → Out of scope for this change. Single no-show continues via WITHDRAWN team flow. If a team withdraws mid-tournament, existing 3-0 walkover logic applies.
- **[Risk] Incorrect NO_SHOW marking requires manual DB fix** → Accepted. The admin is expected to use this carefully, and the checkbox provides a clear intent signal.
- **[Risk] Schema migration required** → Small migration adding an enum value. Prisma handles this for PostgreSQL with `ALTER TYPE ... ADD VALUE`.

## Migration Plan

1. Add `NO_SHOW` to `MatchStatus` enum in Prisma schema
2. Run `prisma migrate dev` to create and apply the migration
3. Deploy — no existing data is affected (no matches currently have `NO_SHOW` status)
4. Rollback: If needed, the migration can be reverted; no data depends on the new enum value