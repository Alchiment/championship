import { Match, MatchPhase, MatchStatus } from "../entities/Match";
import type { TeamRepository } from "../repositories/TeamRepository";
import type { TournamentRepository } from "../repositories/TournamentRepository";
import type { MatchRepository } from "../repositories/MatchRepository";
import { TournamentStatus } from "../entities/Tournament";
import { ValidationError } from "../../errors/ValidationError";

export class GenerateSchedule {
  constructor(
    private teamRepo: TeamRepository,
    private tournamentRepo: TournamentRepository,
    private matchRepo: MatchRepository
  ) {}

  async execute(tournamentId: string): Promise<Match[]> {
    const tournament = await this.tournamentRepo.findById(tournamentId);
    if (!tournament) throw new ValidationError("Tournament not found");

    if (!tournament.canStartLeague()) {
      throw new ValidationError("Tournament is not in SETUP status");
    }

    const teams = await this.teamRepo.findActiveByTournament(tournamentId);
    if (teams.length < 2) {
      throw new ValidationError("At least 2 teams are required to generate a schedule");
    }

    const matches = this.generateRoundRobin(tournamentId, teams.map((t) => t.id));
    return this.matchRepo.createMany(matches);
  }

  private generateRoundRobin(tournamentId: string, teamIds: string[]): Match[] {
    const teams = [...teamIds];
    const matches: Match[] = [];
    const totalTeams = teams.length;

    if (totalTeams % 2 !== 0) {
      teams.push("BYE");
    }

    const numRounds = teams.length - 1;
    const numMatchesPerRound = Math.floor(teams.length / 2);
    const fixed = teams[0];
    const rotating = teams.slice(1);
    let matchIdCounter = 0;

    for (let round = 1; round <= numRounds; round++) {
      const roundTeams = [fixed, ...rotating];

      for (let m = 0; m < numMatchesPerRound; m++) {
        const home = roundTeams[m];
        const away = roundTeams[roundTeams.length - 1 - m];

        if (home === "BYE" || away === "BYE") continue;

        matchIdCounter++;
        const match = new Match({
          id: `generated-${tournamentId}-r${round}-m${matchIdCounter}`,
          round,
          phase: MatchPhase.LEAGUE,
          status: MatchStatus.SCHEDULED,
          homeScore: null,
          awayScore: null,
          tournamentId,
          homeTeamId: home,
          awayTeamId: away,
        });

        matches.push(match);
      }

      rotating.push(rotating.shift()!);
    }

    return matches;
  }
}
