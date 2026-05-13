import { Tournament } from "../entities/Tournament";

export interface TournamentRepository {
  findById(id: string): Promise<Tournament | null>;
  findActive(): Promise<Tournament | null>;
  create(tournament: Tournament): Promise<Tournament>;
  update(tournament: Tournament): Promise<Tournament>;
}
