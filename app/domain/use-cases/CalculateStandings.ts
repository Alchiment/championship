import { Standing } from "../value-objects/Standing";
import { MatchStatus } from "../entities/Match";
import type { TeamRepository } from "../repositories/TeamRepository";
import type { MatchRepository } from "../repositories/MatchRepository";

interface MatchResult {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
}

export class CalculateStandings {
  constructor(
    private teamRepo: TeamRepository,
    private matchRepo: MatchRepository
  ) {}

  async execute(tournamentId: string): Promise<Standing[]> {
    const teams = await this.teamRepo.findByTournament(tournamentId);
    const matches = await this.matchRepo.findByTournament(tournamentId);

    const completedMatches: MatchResult[] = matches
      .filter((m) => m.homeScore !== null && m.awayScore !== null && m.status !== MatchStatus.NO_SHOW)
      .map((m) => ({
        homeTeamId: m.homeTeamId,
        awayTeamId: m.awayTeamId,
        homeScore: m.homeScore!,
        awayScore: m.awayScore!,
      }));

    const noShowMatches = matches.filter((m) => m.status === MatchStatus.NO_SHOW);

    const teamStats = new Map<
      string,
      {
        played: number;
        wins: number;
        draws: number;
        losses: number;
        goalsFor: number;
        goalsAgainst: number;
        points: number;
      }
    >();

    for (const team of teams) {
      teamStats.set(team.id, {
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      });
    }

    for (const match of completedMatches) {
      this.accumulateMatch(teamStats, match.homeTeamId, match.homeScore, match.awayScore);
      this.accumulateMatch(teamStats, match.awayTeamId, match.awayScore, match.homeScore);
    }

    for (const match of noShowMatches) {
      this.incrementPlayed(teamStats, match.homeTeamId);
      this.incrementPlayed(teamStats, match.awayTeamId);
    }

    const standings = teams.map((team) => {
      const stats = teamStats.get(team.id)!;
      return new Standing({
        teamId: team.id,
        teamName: team.name,
        teamCode: team.code,
        teamFlag: team.flag,
        teamStatus: team.status,
        played: stats.played,
        wins: stats.wins,
        draws: stats.draws,
        losses: stats.losses,
        goalsFor: stats.goalsFor,
        goalsAgainst: stats.goalsAgainst,
        goalDifference: stats.goalsFor - stats.goalsAgainst,
        points: stats.points,
      });
    });

    return this.applyTiebreakers(standings, completedMatches);
  }

  private accumulateMatch(
    stats: Map<string, any>,
    teamId: string,
    scored: number,
    conceded: number
  ): void {
    const s = stats.get(teamId);
    if (!s) return;
    s.played++;
    s.goalsFor += scored;
    s.goalsAgainst += conceded;
    if (scored > conceded) {
      s.wins++;
      s.points += 3;
    } else if (scored === conceded) {
      s.draws++;
      s.points += 1;
    } else {
      s.losses++;
    }
  }

  private incrementPlayed(stats: Map<string, any>, teamId: string): void {
    const s = stats.get(teamId);
    if (!s) return;
    s.played++;
  }

  private applyTiebreakers(standings: Standing[], matches: MatchResult[]): Standing[] {
    const sorted = [...standings].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;

      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;

      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

      return this.headToHeadTiebreaker(a, b, matches);
    });

    return sorted;
  }

  private headToHeadTiebreaker(a: Standing, b: Standing, matches: MatchResult[]): number {
    const h2hMatches = matches.filter(
      (m) =>
        (m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) ||
        (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId)
    );

    if (h2hMatches.length === 0) return 0;

    let aPoints = 0;
    let bPoints = 0;
    let aGD = 0;
    let bGD = 0;

    for (const m of h2hMatches) {
      if (m.homeTeamId === a.teamId) {
        aPoints += m.homeScore > m.awayScore ? 3 : m.homeScore === m.awayScore ? 1 : 0;
        bPoints += m.awayScore > m.homeScore ? 3 : m.awayScore === m.homeScore ? 1 : 0;
        aGD += m.homeScore - m.awayScore;
        bGD += m.awayScore - m.homeScore;
      } else {
        bPoints += m.homeScore > m.awayScore ? 3 : m.homeScore === m.awayScore ? 1 : 0;
        aPoints += m.awayScore > m.homeScore ? 3 : m.awayScore === m.homeScore ? 1 : 0;
        bGD += m.homeScore - m.awayScore;
        aGD += m.awayScore - m.homeScore;
      }
    }

    if (aPoints !== bPoints) return bPoints - aPoints;
    if (aGD !== bGD) return bGD - aGD;

    return 0;
  }
}
