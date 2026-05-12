import { Match, MatchPhase, MatchStatus } from "../../../domain/entities/Match";
import type { MatchRepository } from "../../../domain/repositories/MatchRepository";
import { prisma } from "../client";

export class PrismaMatchRepository implements MatchRepository {
  async findById(id: string): Promise<Match | null> {
    const row = await prisma.match.findUnique({ where: { id } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async findByTournament(tournamentId: string): Promise<Match[]> {
    const rows = await prisma.match.findMany({
      where: { tournamentId },
      orderBy: [{ round: "asc" }, { id: "asc" }],
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findByRound(tournamentId: string, round: number): Promise<Match[]> {
    const rows = await prisma.match.findMany({
      where: { tournamentId, round },
      orderBy: { id: "asc" },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async findScheduledByTeam(tournamentId: string, teamId: string): Promise<Match[]> {
    const rows = await prisma.match.findMany({
      where: {
        tournamentId,
        status: "SCHEDULED",
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
    });
    return rows.map((r) => this.toDomain(r));
  }

  async create(match: Match): Promise<Match> {
    const row = await prisma.match.create({
      data: {
        round: match.round,
        phase: match.phase,
        status: match.status,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
        tournamentId: match.tournamentId,
        homeTeamId: match.homeTeamId,
        awayTeamId: match.awayTeamId,
      },
    });
    return this.toDomain(row);
  }

  async createMany(matches: Match[]): Promise<Match[]> {
    await prisma.match.createMany({
      data: matches.map((m) => ({
        round: m.round,
        phase: m.phase,
        status: m.status,
        homeScore: m.homeScore,
        awayScore: m.awayScore,
        tournamentId: m.tournamentId,
        homeTeamId: m.homeTeamId,
        awayTeamId: m.awayTeamId,
      })),
    });
    return this.findByTournament(matches[0].tournamentId);
  }

  async update(match: Match): Promise<Match> {
    const row = await prisma.match.update({
      where: { id: match.id },
      data: {
        status: match.status,
        homeScore: match.homeScore,
        awayScore: match.awayScore,
      },
    });
    return this.toDomain(row);
  }

  async updateMany(matches: Match[]): Promise<Match[]> {
    for (const m of matches) {
      await prisma.match.update({
        where: { id: m.id },
        data: {
          status: m.status,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
        },
      });
    }
    return matches;
  }

  private toDomain(row: any): Match {
    return new Match({
      id: row.id,
      round: row.round,
      phase: row.phase as MatchPhase,
      status: row.status as MatchStatus,
      homeScore: row.homeScore,
      awayScore: row.awayScore,
      tournamentId: row.tournamentId,
      homeTeamId: row.homeTeamId,
      awayTeamId: row.awayTeamId,
    });
  }
}
