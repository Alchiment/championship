import { Team, TeamStatus } from "../../../domain/entities/Team";
import type { TeamRepository } from "../../../domain/repositories/TeamRepository";
import { prisma } from "../client";

export class PrismaTeamRepository implements TeamRepository {
  async findById(id: string): Promise<Team | null> {
    const row = await prisma.team.findUnique({ where: { id } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findByTournament(tournamentId: string): Promise<Team[]> {
    const rows = await prisma.team.findMany({
      where: { tournamentId },
      orderBy: { name: "asc" },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findActiveByTournament(tournamentId: string): Promise<Team[]> {
    const rows = await prisma.team.findMany({
      where: { tournamentId, status: "ACTIVE" },
      orderBy: { name: "asc" },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(team: Team): Promise<Team> {
    const row = await prisma.team.create({
      data: {
        name: team.name,
        code: team.code,
        flag: team.flag,
        status: team.status,
        tournamentId: team.tournamentId,
      },
    });
    return this.toDomain(row);
  }

  async update(team: Team): Promise<Team> {
    const row = await prisma.team.update({
      where: { id: team.id },
      data: {
        name: team.name,
        code: team.code,
        flag: team.flag,
        status: team.status,
      },
    });
    return this.toDomain(row);
  }

  private toDomain(row: any): Team {
    return new Team({
      id: row.id,
      name: row.name,
      code: row.code,
      flag: row.flag,
      status: row.status as TeamStatus,
      tournamentId: row.tournamentId,
    });
  }
}
