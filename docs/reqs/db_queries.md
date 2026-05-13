## Scope queries

### Initial schedule
```sql
DO $$
DECLARE
  t_id  TEXT;
  col   TEXT; -- Colombia
  bra   TEXT; -- Brasil
  arg   TEXT; -- Argentina
  fra   TEXT; -- Francia
  esp   TEXT; -- España
  ger   TEXT; -- Alemania
  por   TEXT; -- Portugal
  bel   TEXT; -- Bélgica
BEGIN
  -- Get tournament ID
  SELECT id INTO t_id FROM "Tournament" WHERE name = 'Torneo de Fútbol Intertorres K108';
  -- If Bélgica replaces Italia, update first:
  UPDATE "Team" SET name = 'Bélgica', code = 'BEL', flag = '🇧🇪'
  WHERE name = 'Italia' AND "tournamentId" = t_id;
  -- Get team IDs
  SELECT id INTO col FROM "Team" WHERE name = 'Colombia'    AND "tournamentId" = t_id;
  SELECT id INTO bra FROM "Team" WHERE name = 'Brasil'      AND "tournamentId" = t_id;
  SELECT id INTO arg FROM "Team" WHERE name = 'Argentina'    AND "tournamentId" = t_id;
  SELECT id INTO fra FROM "Team" WHERE name = 'Francia'      AND "tournamentId" = t_id;
  SELECT id INTO esp FROM "Team" WHERE name = 'España'       AND "tournamentId" = t_id;
  SELECT id INTO ger FROM "Team" WHERE name = 'Alemania'     AND "tournamentId" = t_id;
  SELECT id INTO por FROM "Team" WHERE name = 'Portugal'     AND "tournamentId" = t_id;
  SELECT id INTO bel FROM "Team" WHERE name = 'Bélgica'      AND "tournamentId" = t_id;
  -- Create all matches (7 rounds × 4 matches = 28 total)
  INSERT INTO "Match" (id, round, phase, status, "tournamentId", "homeTeamId", "awayTeamId") VALUES
    -- Fecha 1
    (gen_random_uuid()::text, 1, 'LEAGUE', 'SCHEDULED', t_id, col, bra),
    (gen_random_uuid()::text, 1, 'LEAGUE', 'SCHEDULED', t_id, arg, fra),
    (gen_random_uuid()::text, 1, 'LEAGUE', 'SCHEDULED', t_id, esp, ger),
    (gen_random_uuid()::text, 1, 'LEAGUE', 'SCHEDULED', t_id, por, bel),
    -- Fecha 2
    (gen_random_uuid()::text, 2, 'LEAGUE', 'SCHEDULED', t_id, col, arg),
    (gen_random_uuid()::text, 2, 'LEAGUE', 'SCHEDULED', t_id, bra, esp),
    (gen_random_uuid()::text, 2, 'LEAGUE', 'SCHEDULED', t_id, fra, por),
    (gen_random_uuid()::text, 2, 'LEAGUE', 'SCHEDULED', t_id, ger, bel),
    -- Fecha 3
    (gen_random_uuid()::text, 3, 'LEAGUE', 'SCHEDULED', t_id, col, fra),
    (gen_random_uuid()::text, 3, 'LEAGUE', 'SCHEDULED', t_id, bra, ger),
    (gen_random_uuid()::text, 3, 'LEAGUE', 'SCHEDULED', t_id, esp, por),
    (gen_random_uuid()::text, 3, 'LEAGUE', 'SCHEDULED', t_id, arg, bel),
    -- Fecha 4
    (gen_random_uuid()::text, 4, 'LEAGUE', 'SCHEDULED', t_id, col, esp),
    (gen_random_uuid()::text, 4, 'LEAGUE', 'SCHEDULED', t_id, bra, por),
    (gen_random_uuid()::text, 4, 'LEAGUE', 'SCHEDULED', t_id, arg, ger),
    (gen_random_uuid()::text, 4, 'LEAGUE', 'SCHEDULED', t_id, fra, bel),
    -- Fecha 5
    (gen_random_uuid()::text, 5, 'LEAGUE', 'SCHEDULED', t_id, bra, bel),
    (gen_random_uuid()::text, 5, 'LEAGUE', 'SCHEDULED', t_id, arg, por),
    (gen_random_uuid()::text, 5, 'LEAGUE', 'SCHEDULED', t_id, esp, fra),
    (gen_random_uuid()::text, 5, 'LEAGUE', 'SCHEDULED', t_id, col, ger),
    -- Fecha 6
    (gen_random_uuid()::text, 6, 'LEAGUE', 'SCHEDULED', t_id, esp, arg),
    (gen_random_uuid()::text, 6, 'LEAGUE', 'SCHEDULED', t_id, col, bel),
    (gen_random_uuid()::text, 6, 'LEAGUE', 'SCHEDULED', t_id, ger, por),
    (gen_random_uuid()::text, 6, 'LEAGUE', 'SCHEDULED', t_id, bra, fra),
    -- Fecha 7
    (gen_random_uuid()::text, 7, 'LEAGUE', 'SCHEDULED', t_id, col, por),
    (gen_random_uuid()::text, 7, 'LEAGUE', 'SCHEDULED', t_id, fra, ger),
    (gen_random_uuid()::text, 7, 'LEAGUE', 'SCHEDULED', t_id, esp, bel),
    (gen_random_uuid()::text, 7, 'LEAGUE', 'SCHEDULED', t_id, bra, arg);
END $$;
```