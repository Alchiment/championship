## 1. Schema & Domain

- [x] 1.1 Add `NO_SHOW` value to `MatchStatus` enum in `prisma/schema.prisma`
- [x] 1.2 Add `NO_SHOW = "NO_SHOW"` to `MatchStatus` enum in `app/domain/entities/Match.ts`
- [x] 1.3 Add `isNoShow()` method to `Match` entity that returns `this.props.status === MatchStatus.NO_SHOW`
- [x] 1.4 Update `Match.recordResult()` to allow null scores when status is NO_SHOW (or adjust validation)
- [x] 1.5 Run `npx prisma migrate dev` to create and apply the migration

## 2. Use Cases

- [x] 2.1 Update `CalculateStandings.execute()` to filter out `NO_SHOW` matches from completed matches (add `&& m.status !== "NO_SHOW"` condition, or filter by checking `isNoShow` on domain objects)
- [x] 2.2 Update `RecordMatchResult` to reject edits on `NO_SHOW` matches (add `isNoShow()` guard similar to `isForfeit()`)

## 3. Admin UI

- [x] 3.1 Update `admin.matches.tsx` action handler: when `noShow` checkbox is present, set `status: "NO_SHOW"` and `homeScore: null, awayScore: null` instead of COMPLETED with scores
- [x] 3.2 Add "Ambos equipos no se presentaron" checkbox to the match result form, hidden when match is already COMPLETED or NO_SHOW
- [x] 3.3 Update the completed match display: show "No se presentaron" for NO_SHOW matches instead of the score

## 4. Public Views

- [x] 4.1 Update `MatchCard.tsx` to render "No se presentaron" label for NO_SHOW matches instead of the scores
- [x] 4.2 Update `_public.match.$id.tsx` to display "No se presentaron" for NO_SHOW matches
- [x] 4.3 Update `_public.schedule.tsx` to handle NO_SHOW status in match display
- [x] 4.4 Update `_public.team.$id.tsx` to handle NO_SHOW status in match history

## 5. Tests

- [x] 5.1 Add test to `CalculateStandings.test.ts`: NO_SHOW match is excluded from standings (no played, no goals, no points)
- [x] 5.2 Add test: head-to-head tiebreaker excludes NO_SHOW matches
- [x] 5.3 Add test: `Match.isNoShow()` returns correct boolean
- [x] 5.4 Add test: `RecordMatchResult` rejects edits on NO_SHOW matches

## 6. API

- [x] 6.1 Update `api.matches.$id.tsx` to accept `noShow` flag and handle NO_SHOW status creation