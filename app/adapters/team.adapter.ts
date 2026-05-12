import { Team, TeamStatus } from "../domain/entities/Team";

export interface TeamDTO {
  id: string;
  name: string;
  code: string;
  flag: string;
  status: string;
  tournamentId: string;
  players?: any[];
  playerCount?: number;
  captain?: any;
}

export class TeamAdapter {
  static toDomain(row: any): Team {
    return new Team({
      id: row.id,
      name: row.name,
      code: row.code,
      flag: row.flag,
      status: (row.status as TeamStatus) || TeamStatus.ACTIVE,
      tournamentId: row.tournamentId,
    });
  }

  static toDTO(team: Team, players?: any[], captain?: any): TeamDTO {
    return {
      id: team.id,
      name: team.name,
      code: team.code,
      flag: team.flag,
      status: team.status,
      tournamentId: team.tournamentId,
      ...(players ? { players, playerCount: players.length, captain } : {}),
    };
  }
}
