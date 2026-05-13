import { Player } from "../entities/Player";

export interface PlayerRepository {
  findByTeam(teamId: string): Promise<Player[]>;
  addPlayer(player: Player): Promise<Player>;
  removePlayer(playerId: string): Promise<void>;
  assignCaptain(playerId: string): Promise<Player>;
  removeCaptainFromTeam(teamId: string): Promise<void>;
}
