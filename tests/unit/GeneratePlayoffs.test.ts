import { describe, it, expect, vi } from "vitest";
import { GeneratePlayoffs } from "../../app/domain/use-cases/GeneratePlayoffs";
import { Tournament, TournamentStatus } from "../../app/domain/entities/Tournament";

describe("GeneratePlayoffs", () => {
  it("generates correct bracket for 4 teams (1st vs 4th, 2nd vs 3rd)", async () => {
    const tournament = new Tournament({
      id: "t1", name: "Test", venue: "V", status: TournamentStatus.LEAGUE_PHASE,
      playoffCutoff: 4, hasGroupPhase: true, thirdPlaceEnabled: false,
      createdAt: new Date(), updatedAt: new Date(),
    });

    const tournamentRepo = {
      findById: vi.fn().mockResolvedValue(tournament),
      findActive: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const matchRepo = {
      findById: vi.fn(),
      findByTournament: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn().mockImplementation((m: any) => Promise.resolve(m)),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const calculateStandings = {
      execute: vi.fn().mockResolvedValue([
        { teamId: "t1", teamName: "1st", teamStatus: "ACTIVE" },
        { teamId: "t2", teamName: "2nd", teamStatus: "ACTIVE" },
        { teamId: "t3", teamName: "3rd", teamStatus: "ACTIVE" },
        { teamId: "t4", teamName: "4th", teamStatus: "ACTIVE" },
      ]),
    };

    const useCase = new GeneratePlayoffs(tournamentRepo, matchRepo, calculateStandings as any);
    const matches = await useCase.execute("t1");

    expect(matches).toHaveLength(2);
    expect(matches[0].homeTeamId).toBe("t1");
    expect(matches[0].awayTeamId).toBe("t4");
    expect(matches[1].homeTeamId).toBe("t2");
    expect(matches[1].awayTeamId).toBe("t3");
  });
});
