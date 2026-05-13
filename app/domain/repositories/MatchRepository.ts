import { Match } from "../entities/Match";

export interface MatchRepository {
  findById(id: string): Promise<Match | null>;
  findByTournament(tournamentId: string): Promise<Match[]>;
  findByRound(tournamentId: string, round: number): Promise<Match[]>;
  findScheduledByTeam(tournamentId: string, teamId: string): Promise<Match[]>;
  create(match: Match): Promise<Match>;
  createMany(matches: Match[]): Promise<Match[]>;
  update(match: Match): Promise<Match>;
  updateMany(matches: Match[]): Promise<Match[]>;
}
