import { describe, it, expect, vi } from "vitest";
import { RecordMatchResult } from "../../app/domain/use-cases/RecordMatchResult";
import { Match, MatchPhase, MatchStatus } from "../../app/domain/entities/Match";

describe("RecordMatchResult", () => {
  it("rejects editing a NO_SHOW match", async () => {
    const noShowMatch = new Match({
      id: "m1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.NO_SHOW,
      homeScore: null,
      awayScore: null,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    const matchRepo = {
      findById: vi.fn().mockResolvedValue(noShowMatch),
      findByTournament: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new RecordMatchResult(matchRepo);

    await expect(useCase.execute("m1", 3, 0)).rejects.toThrow(
      "Cannot modify no-show match results"
    );
  });
});