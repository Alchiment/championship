import { describe, it, expect, vi } from "vitest";
import { CalculateStandings } from "../../app/domain/use-cases/CalculateStandings";
import { Team, TeamStatus } from "../../app/domain/entities/Team";
import { Match, MatchPhase, MatchStatus } from "../../app/domain/entities/Match";

function makeTeam(id: string, name: string): Team {
  return new Team({ id, name, code: "TST", flag: "🏳️", status: TeamStatus.ACTIVE, tournamentId: "t1" });
}

function makeMatch(
  id: string,
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number
): Match {
  return new Match({
    id,
    round: 1,
    phase: MatchPhase.LEAGUE,
    status: MatchStatus.COMPLETED,
    homeScore,
    awayScore,
    tournamentId: "t1",
    homeTeamId,
    awayTeamId,
  });
}

describe("CalculateStandings", () => {
  it("calculates standings correctly for basic results", async () => {
    const teamRepo = {
      findByTournament: vi.fn().mockResolvedValue([
        makeTeam("a", "Team A"),
        makeTeam("b", "Team B"),
      ]),
      findById: vi.fn(),
      findActiveByTournament: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const matchRepo = {
      findByTournament: vi.fn().mockResolvedValue([
        makeMatch("1", "a", "b", 3, 1),
      ]),
      findById: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new CalculateStandings(teamRepo, matchRepo);
    const standings = await useCase.execute("t1");

    expect(standings).toHaveLength(2);
    expect(standings[0].teamId).toBe("a");
    expect(standings[0].points).toBe(3);
    expect(standings[0].goalsFor).toBe(3);
    expect(standings[0].goalsAgainst).toBe(1);
    expect(standings[0].goalDifference).toBe(2);
    expect(standings[1].points).toBe(0);
  });

  it("breaks ties by goal difference", async () => {
    const teamRepo = {
      findByTournament: vi.fn().mockResolvedValue([
        makeTeam("a", "Team A"),
        makeTeam("b", "Team B"),
      ]),
      findById: vi.fn(),
      findActiveByTournament: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const matchRepo = {
      findByTournament: vi.fn().mockResolvedValue([
        makeMatch("1", "a", "b", 2, 0),
        makeMatch("2", "b", "a", 2, 0),
      ]),
      findById: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new CalculateStandings(teamRepo, matchRepo);
    const standings = await useCase.execute("t1");

    expect(standings[0].points).toBe(3);
    expect(standings[1].points).toBe(3);
    expect(standings[0].goalDifference).toBe(0);
    expect(standings[1].goalDifference).toBe(0);
    expect(standings[0].goalsFor).toBe(2);
    expect(standings[1].goalsFor).toBe(2);
  });

  it("handles 3+ tied teams with mini-league tiebreaker", async () => {
    const teamRepo = {
      findByTournament: vi.fn().mockResolvedValue([
        makeTeam("a", "Team A"),
        makeTeam("b", "Team B"),
        makeTeam("c", "Team C"),
      ]),
      findById: vi.fn(),
      findActiveByTournament: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const matchRepo = {
      findByTournament: vi.fn().mockResolvedValue([
        makeMatch("1", "a", "b", 1, 0),
        makeMatch("2", "b", "c", 1, 0),
        makeMatch("3", "c", "a", 1, 0),
      ]),
      findById: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new CalculateStandings(teamRepo, matchRepo);
    const standings = await useCase.execute("t1");

    expect(standings).toHaveLength(3);
    expect(standings.every((s) => s.points === 3)).toBe(true);
    expect(standings.every((s) => s.goalDifference === 0)).toBe(true);
    expect(standings.every((s) => s.goalsFor === 1)).toBe(true);
  });

  it("excludes NO_SHOW matches from standings calculations", async () => {
    const teamRepo = {
      findByTournament: vi.fn().mockResolvedValue([
        makeTeam("a", "Team A"),
        makeTeam("b", "Team B"),
      ]),
      findById: vi.fn(),
      findActiveByTournament: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const noShowMatch = new Match({
      id: "1",
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
      findByTournament: vi.fn().mockResolvedValue([noShowMatch]),
      findById: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new CalculateStandings(teamRepo, matchRepo);
    const standings = await useCase.execute("t1");

    expect(standings).toHaveLength(2);
    expect(standings[0].played).toBe(1);
    expect(standings[0].points).toBe(0);
    expect(standings[0].goalsFor).toBe(0);
    expect(standings[0].goalsAgainst).toBe(0);
    expect(standings[1].played).toBe(1);
    expect(standings[1].points).toBe(0);
    expect(standings[1].goalsFor).toBe(0);
    expect(standings[1].goalsAgainst).toBe(0);
  });

  it("excludes NO_SHOW matches from head-to-head tiebreaker", async () => {
    const teamRepo = {
      findByTournament: vi.fn().mockResolvedValue([
        makeTeam("a", "Team A"),
        makeTeam("b", "Team B"),
      ]),
      findById: vi.fn(),
      findActiveByTournament: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    };

    const noShowMatch = new Match({
      id: "1",
      round: 1,
      phase: MatchPhase.LEAGUE,
      status: MatchStatus.NO_SHOW,
      homeScore: null,
      awayScore: null,
      tournamentId: "t1",
      homeTeamId: "a",
      awayTeamId: "b",
    });

    const completedMatch = makeMatch("2", "a", "b", 1, 0);

    const matchRepo = {
      findByTournament: vi.fn().mockResolvedValue([noShowMatch, completedMatch]),
      findById: vi.fn(),
      findByRound: vi.fn(),
      findScheduledByTeam: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    };

    const useCase = new CalculateStandings(teamRepo, matchRepo);
    const standings = await useCase.execute("t1");

    expect(standings[0].teamId).toBe("a");
    expect(standings[0].points).toBe(3);
    expect(standings[1].points).toBe(0);
  });
});
