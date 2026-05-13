import { Match, MatchPhase, MatchStatus } from "../domain/entities/Match";

export interface MatchDTO {
  id: string;
  round: number;
  phase: string;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeam?: any;
  awayTeam?: any;
}

export class MatchAdapter {
  static toDomain(row: any): Match {
    return new Match({
      id: row.id,
      round: row.round,
      phase: (row.phase as MatchPhase) || MatchPhase.LEAGUE,
      status: (row.status as MatchStatus) || MatchStatus.SCHEDULED,
      homeScore: row.homeScore,
      awayScore: row.awayScore,
      tournamentId: row.tournamentId,
      homeTeamId: row.homeTeamId,
      awayTeamId: row.awayTeamId,
    });
  }

  static toDTO(match: Match, homeTeam?: any, awayTeam?: any): MatchDTO {
    return {
      id: match.id,
      round: match.round,
      phase: match.phase,
      status: match.status,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      tournamentId: match.tournamentId,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      ...(homeTeam ? { homeTeam } : {}),
      ...(awayTeam ? { awayTeam } : {}),
    };
  }
}
