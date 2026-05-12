import { Tournament, TournamentStatus } from "../../../domain/entities/Tournament";
import type { TournamentRepository } from "../../../domain/repositories/TournamentRepository";
import { prisma } from "../client";

export class PrismaTournamentRepository implements TournamentRepository {
  async findById(id: string): Promise<Tournament | null> {
    const row = await prisma.tournament.findUnique({ where: { id } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findActive(): Promise<Tournament | null> {
    const row = await prisma.tournament.findFirst({
      where: {
        status: { in: ["SETUP", "LEAGUE_PHASE", "PLAYOFFS"] },
      },
    });
    if (!row) return null;
    return this.toDomain(row);
  }

  async create(tournament: Tournament): Promise<Tournament> {
    const row = await prisma.tournament.create({
      data: {
        name: tournament.name,
        venue: tournament.venue,
        status: tournament.status,
        playoffCutoff: tournament.playoffCutoff,
        hasGroupPhase: tournament.hasGroupPhase,
        thirdPlaceEnabled: tournament.thirdPlaceEnabled,
      },
    });
    return this.toDomain(row);
  }

  async update(tournament: Tournament): Promise<Tournament> {
    const row = await prisma.tournament.update({
      where: { id: tournament.id },
      data: {
        name: tournament.name,
        venue: tournament.venue,
        status: tournament.status,
        playoffCutoff: tournament.playoffCutoff,
        hasGroupPhase: tournament.hasGroupPhase,
        thirdPlaceEnabled: tournament.thirdPlaceEnabled,
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: any): Tournament {
    return new Tournament({
      id: row.id,
      name: row.name,
      venue: row.venue,
      status: row.status as TournamentStatus,
      playoffCutoff: row.playoffCutoff,
      hasGroupPhase: row.hasGroupPhase,
      thirdPlaceEnabled: row.thirdPlaceEnabled,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
