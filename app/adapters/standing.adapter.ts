import { Standing } from "../domain/value-objects/Standing";

export interface StandingDTO {
  position: number;
  teamId: string;
  teamName: string;
  teamCode: string;
  teamFlag: string;
  teamStatus: string;
  isWithdrawn: boolean;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export class StandingAdapter {
  static toDTO(standing: Standing, position: number): StandingDTO {
    return {
      position,
      teamId: standing.teamId,
      teamName: standing.teamName,
      teamCode: standing.teamCode,
      teamFlag: standing.teamFlag,
      teamStatus: standing.teamStatus,
      isWithdrawn: standing.isWithdrawn,
      played: standing.played,
      wins: standing.wins,
      draws: standing.draws,
      losses: standing.losses,
      goalsFor: standing.goalsFor,
      goalsAgainst: standing.goalsAgainst,
      goalDifference: standing.goalDifference,
      points: standing.points,
    };
  }
}
