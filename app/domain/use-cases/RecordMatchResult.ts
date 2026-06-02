import type { MatchRepository } from "../repositories/MatchRepository";
import { ValidationError } from "../../errors/ValidationError";
import { NotFoundError } from "../../errors/NotFoundError";

export class RecordMatchResult {
  constructor(private matchRepo: MatchRepository) {}

  async execute(matchId: string, homeScore: number, awayScore: number) {
    const match = await this.matchRepo.findById(matchId);
    if (!match) throw new NotFoundError("Match not found");

    if (match.isForfeit()) {
      throw new ValidationError("Cannot modify forfeit match results");
    }

    if (match.isNoShow()) {
      throw new ValidationError("Cannot modify no-show match results");
    }

    const updated = match.recordResult(homeScore, awayScore);
    return this.matchRepo.update(updated);
  }
}
