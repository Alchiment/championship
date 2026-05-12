import { Team } from "../entities/Team";

export interface TeamRepository {
  findById(id: string): Promise<Team | null>;
  findByTournament(tournamentId: string): Promise<Team[]>;
  findActiveByTournament(tournamentId: string): Promise<Team[]>;
  create(team: Team): Promise<Team>;
  update(team: Team): Promise<Team>;
}
