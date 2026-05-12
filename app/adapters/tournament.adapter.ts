import { Tournament, TournamentStatus } from "../domain/entities/Tournament";

export interface TournamentDTO {
  id: string;
  name: string;
  venue: string;
  status: string;
  playoffCutoff: number;
  hasGroupPhase: boolean;
  thirdPlaceEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  organizers?: any[];
  sponsors?: any[];
}

export class TournamentAdapter {
  static toDomain(row: any): Tournament {
    return new Tournament({
      id: row.id,
      name: row.name,
      venue: row.venue,
      status: (row.status as TournamentStatus) || TournamentStatus.SETUP,
      playoffCutoff: row.playoffCutoff ?? 4,
      hasGroupPhase: row.hasGroupPhase ?? false,
      thirdPlaceEnabled: row.thirdPlaceEnabled ?? false,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toDTO(tournament: Tournament, organizers?: any[], sponsors?: any[]): TournamentDTO {
    return {
      id: tournament.id,
      name: tournament.name,
      venue: tournament.venue,
      status: tournament.status,
      playoffCutoff: tournament.playoffCutoff,
      hasGroupPhase: tournament.hasGroupPhase,
      thirdPlaceEnabled: tournament.thirdPlaceEnabled,
      createdAt: tournament.createdAt.toISOString(),
      updatedAt: tournament.updatedAt.toISOString(),
      ...(organizers ? { organizers } : {}),
      ...(sponsors ? { sponsors } : {}),
    };
  }
}
