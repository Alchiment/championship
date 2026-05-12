import { Tournament, TournamentStatus } from "../entities/Tournament";
import type { TournamentRepository } from "../repositories/TournamentRepository";
import { ValidationError } from "../../errors/ValidationError";

export interface CreateTournamentInput {
  name: string;
  venue: string;
  playoffCutoff?: number;
  hasGroupPhase?: boolean;
  thirdPlaceEnabled?: boolean;
}

export class CreateTournamentUseCase {
  constructor(private tournamentRepo: TournamentRepository) {}

  async execute(input: CreateTournamentInput): Promise<Tournament> {
    if (!input.name || !input.venue) {
      throw new ValidationError("Name and venue are required");
    }

    const tournament = new Tournament({
      id: "",
      name: input.name,
      venue: input.venue,
      status: TournamentStatus.SETUP,
      playoffCutoff: input.playoffCutoff ?? 4,
      hasGroupPhase: input.hasGroupPhase ?? false,
      thirdPlaceEnabled: input.thirdPlaceEnabled ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.tournamentRepo.create(tournament);
  }
}
