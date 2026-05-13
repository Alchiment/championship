import type { TeamRepository } from "../repositories/TeamRepository";
import type { MatchRepository } from "../repositories/MatchRepository";
import { Match, MatchPhase, MatchStatus } from "../entities/Match";
import { NotFoundError } from "../../errors/NotFoundError";
import { ValidationError } from "../../errors/ValidationError";

export class WithdrawTeam {
  constructor(
    private teamRepo: TeamRepository,
    private matchRepo: MatchRepository
  ) {}

  async execute(tournamentId: string, teamId: string): Promise<void> {
    const team = await this.teamRepo.findById(teamId);
    if (!team) throw new NotFoundError("Team not found");

    if (!team.isActive()) {
      throw new ValidationError("Team has already withdrawn");
    }

    const updatedTeam = team.withdraw();
    await this.teamRepo.update(updatedTeam);

    const futureMatches = await this.matchRepo.findScheduledByTeam(tournamentId, teamId);

    const forfeitMatches: Match[] = futureMatches.map((m) => {
      const isHome = m.homeTeamId === teamId;
      const homeScore = isHome ? 0 : 3;
      const awayScore = isHome ? 3 : 0;

      return new Match({
        id: m.id,
        round: m.round,
        phase: MatchPhase.LEAGUE,
        status: MatchStatus.COMPLETED,
        homeScore,
        awayScore,
        tournamentId: m.tournamentId,
        homeTeamId: m.homeTeamId,
        awayTeamId: m.awayTeamId,
      });
    });

    if (forfeitMatches.length > 0) {
      await this.matchRepo.updateMany(forfeitMatches);
    }
  }
}
