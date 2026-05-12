import { Match, MatchPhase, MatchStatus } from "../entities/Match";
import { TournamentStatus } from "../entities/Tournament";
import type { TournamentRepository } from "../repositories/TournamentRepository";
import type { MatchRepository } from "../repositories/MatchRepository";
import { CalculateStandings } from "./CalculateStandings";
import { ValidationError } from "../../errors/ValidationError";

export class GeneratePlayoffs {
  constructor(
    private tournamentRepo: TournamentRepository,
    private matchRepo: MatchRepository,
    private calculateStandings: CalculateStandings
  ) {}

  async execute(tournamentId: string): Promise<Match[]> {
    const tournament = await this.tournamentRepo.findById(tournamentId);
    if (!tournament) throw new ValidationError("Tournament not found");

    if (!tournament.canStartPlayoffs()) {
      throw new ValidationError("Tournament is not ready for playoffs");
    }

    const standings = await this.calculateStandings.execute(tournamentId);
    const qualified = standings
      .filter((s) => s.teamStatus === "ACTIVE")
      .slice(0, tournament.playoffCutoff);

    if (qualified.length < 2) {
      throw new ValidationError("Not enough teams for playoffs");
    }

    const matches: Match[] = [];
    let idCounter = 0;

    for (let i = 0; i < qualified.length / 2; i++) {
      const home = qualified[i];
      const away = qualified[qualified.length - 1 - i];
      idCounter++;

      const match = new Match({
        id: `playoff-${tournamentId}-semifinal-${idCounter}`,
        round: 1,
        phase: MatchPhase.SEMIFINAL,
        status: MatchStatus.SCHEDULED,
        homeScore: null,
        awayScore: null,
        tournamentId,
        homeTeamId: home.teamId,
        awayTeamId: away.teamId,
      });

      matches.push(match);
    }

    return this.matchRepo.createMany(matches);
  }
}
