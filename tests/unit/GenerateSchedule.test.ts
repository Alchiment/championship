import { describe, it, expect, vi } from "vitest";
import { GenerateSchedule } from "../../app/domain/use-cases/GenerateSchedule";
import { Tournament, TournamentStatus } from "../../app/domain/entities/Tournament";
import { Team, TeamStatus } from "../../app/domain/entities/Team";
import { Match } from "../../app/domain/entities/Match";

describe("GenerateSchedule", () => {
  const makeTournament = (id: string) =>
    new Tournament({
      id,
      name: "Test",
      venue: "Venue",
      status: TournamentStatus.SETUP,
      playoffCutoff: 4,
      hasGroupPhase: false,
      thirdPlaceEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  const makeTeam = (id: string) =>
    new Team({ id, name: `Team ${id}`, code: "TST", flag: "🏳️", status: TeamStatus.ACTIVE, tournamentId: "t1" });

  it("generates correct number of matches for 8 teams", async () => {
    const teams = Array.from({ length: 8 }, (_, i) => makeTeam(`team${i + 1}`));

    const tournamentRepo = {
      findById: vi.fn().mockResolvedValue(makeTournament("t1")),
      findActive: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const teamRepo = {
      findById: vi.fn(),
      findByTournament: vi.fn(),
      findActiveByTournament: vi.fn().mockResolvedValue(teams),
      create: vi.fn(),
      update: vi.fn(),
    };

    const matchRepo = {
      findById: vi.fn(),
      findByTournament: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn().mockImplementation((matches: Match[]) => Promise.resolve(matches)),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new GenerateSchedule(teamRepo, tournamentRepo, matchRepo);
    const matches = await useCase.execute("t1");

    expect(matches).toHaveLength(28);
  });

  it("generates correct number of matches for 7 teams (with byes)", async () => {
    const teams = Array.from({ length: 7 }, (_, i) => makeTeam(`team${i + 1}`));

    const tournamentRepo = {
      findById: vi.fn().mockResolvedValue(makeTournament("t1")),
      findActive: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const teamRepo = {
      findById: vi.fn(),
      findByTournament: vi.fn(),
      findActiveByTournament: vi.fn().mockResolvedValue(teams),
      create: vi.fn(),
      update: vi.fn(),
    };

    const matchRepo = {
      findById: vi.fn(),
      findByTournament: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn().mockImplementation((matches: Match[]) => Promise.resolve(matches)),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new GenerateSchedule(teamRepo, tournamentRepo, matchRepo);
    const matches = await useCase.execute("t1");

    expect(matches).toHaveLength(21);
  });

  it("rejects with fewer than 2 teams", async () => {
    const tournamentRepo = {
      findById: vi.fn().mockResolvedValue(makeTournament("t1")),
      findActive: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const teamRepo = {
      findById: vi.fn(),
      findByTournament: vi.fn(),
      findActiveByTournament: vi.fn().mockResolvedValue([makeTeam("team1")]),
      create: vi.fn(),
      update: vi.fn(),
    };

    const matchRepo = {
      findById: vi.fn(),
      findByTournament: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new GenerateSchedule(teamRepo, tournamentRepo, matchRepo);
    await expect(useCase.execute("t1")).rejects.toThrow("at least 2 teams");
  });
});
