import { Player } from "../../../domain/entities/Player";
import type { PlayerRepository } from "../../../domain/repositories/PlayerRepository";
import { prisma } from "../client";

export class PrismaPlayerRepository implements PlayerRepository {
  async findByTeam(teamId: string): Promise<Player[]> {
    const rows = await prisma.player.findMany({
      where: { teamId },
      orderBy: { name: "asc" },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async addPlayer(player: Player): Promise<Player> {
    const row = await prisma.player.create({
      data: {
        name: player.name,
        jerseyNumber: player.jerseyNumber,
        isCaptain: player.isCaptain,
        teamId: player.teamId,
      },
    });
    return this.toDomain(row);
  }

  async removePlayer(playerId: string): Promise<void> {
    await prisma.player.delete({ where: { id: playerId } });
  }

  async assignCaptain(playerId: string): Promise<Player> {
    const row = await prisma.player.update({
      where: { id: playerId },
      data: { isCaptain: true },
    });
    return this.toDomain(row);
  }

  async removeCaptainFromTeam(teamId: string): Promise<void> {
    await prisma.player.updateMany({
      where: { teamId, isCaptain: true },
      data: { isCaptain: false },
    });
  }

  private toDomain(row: any): Player {
    return new Player({
      id: row.id,
      name: row.name,
      jerseyNumber: row.jerseyNumber,
      isCaptain: row.isCaptain,
      teamId: row.teamId,
    });
  }
}
