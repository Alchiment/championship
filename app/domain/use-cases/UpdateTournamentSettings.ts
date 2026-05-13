import { Tournament, TournamentStatus } from "../entities/Tournament";
import type { TournamentRepository } from "../repositories/TournamentRepository";
import { NotFoundError } from "../../errors/NotFoundError";
import { ValidationError } from "../../errors/ValidationError";

export interface UpdateTournamentSettingsInput {
  name?: string;
  venue?: string;
  playoffCutoff?: number;
  hasGroupPhase?: boolean;
  thirdPlaceEnabled?: boolean;
}

export class UpdateTournamentSettingsUseCase {
  constructor(private tournamentRepo: TournamentRepository) {}

  async execute(tournamentId: string, input: UpdateTournamentSettingsInput): Promise<Tournament> {
    const tournament = await this.tournamentRepo.findById(tournamentId);
    if (!tournament) throw new NotFoundError("Tournament not found");

    if (tournament.status !== TournamentStatus.SETUP) {
      throw new ValidationError("Can only update settings during SETUP phase");
    }

    const updated = tournament.updateSettings(input);
    return this.tournamentRepo.update(updated);
  }
}
