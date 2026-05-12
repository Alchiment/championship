import { describe, it, expect, vi } from "vitest";
import { WithdrawTeam } from "../../app/domain/use-cases/WithdrawTeam";
import { Team, TeamStatus } from "../../app/domain/entities/Team";
import { Match, MatchPhase, MatchStatus } from "../../app/domain/entities/Match";

describe("WithdrawTeam", () => {
  it("converts future matches to forfeits and preserves past results", async () => {
    const team = new Team({ id: "team1", name: "Team A", code: "TST", flag: "🏳️", status: TeamStatus.ACTIVE, tournamentId: "t1" });

    const futureMatch = new Match({
      id: "m1", round: 4, phase: MatchPhase.LEAGUE, status: MatchStatus.SCHEDULED,
      homeScore: null, awayScore: null, tournamentId: "t1",
      homeTeamId: "team1", awayTeamId: "team2",
    });

    const teamRepo = {
      findById: vi.fn().mockResolvedValue(team),
      findByTournament: vi.fn(),
      findActiveByTournament: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockImplementation((t: Team) => Promise.resolve(t)),
    };

    const matchRepo = {
      findById: vi.fn(),
      findByTournament: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn().mockResolvedValue([futureMatch]),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn().mockImplementation((matches: Match[]) => Promise.resolve(matches)),
    };

    const useCase = new WithdrawTeam(teamRepo, matchRepo);
    await useCase.execute("t1", "team1");

    expect(teamRepo.update).toHaveBeenCalled();
    expect(matchRepo.updateMany).toHaveBeenCalled();

    const updatedMatches = matchRepo.updateMany.mock.calls[0][0];
    expect(updatedMatches).toHaveLength(1);
    expect(updatedMatches[0].status).toBe(MatchStatus.COMPLETED);
    expect(updatedMatches[0].homeScore).toBe(0);
    expect(updatedMatches[0].awayScore).toBe(3);
  });

  it("throws if team already withdrawn", async () => {
    const withdrawnTeam = new Team({ id: "team1", name: "Team A", code: "TST", flag: "🏳️", status: TeamStatus.WITHDRAWN, tournamentId: "t1" });

    const teamRepo = {
      findById: vi.fn().mockResolvedValue(withdrawnTeam),
      findByTournament: vi.fn(),
      findActiveByTournament: vi.fn(),
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

    const useCase = new WithdrawTeam(teamRepo, matchRepo);
    await expect(useCase.execute("t1", "team1")).rejects.toThrow("already withdrawn");
  });
});
