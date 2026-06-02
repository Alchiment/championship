export enum MatchPhase {
  LEAGUE = "LEAGUE",
  SEMIFINAL = "SEMIFINAL",
  FINAL = "FINAL",
  THIRD_PLACE = "THIRD_PLACE",
}

export enum MatchStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

export interface MatchProps {
  id: string;
  round: number;
  phase: MatchPhase;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
}

export class Match {
  constructor(private props: MatchProps) {}

  get id() { return this.props.id; }
  get round() { return this.props.round; }
  get phase() { return this.props.phase; }
  get status() { return this.props.status; }
  get homeScore() { return this.props.homeScore; }
  get awayScore() { return this.props.awayScore; }
  get tournamentId() { return this.props.tournamentId; }
  get homeTeamId() { return this.props.homeTeamId; }
  get awayTeamId() { return this.props.awayTeamId; }

  start(): Match {
    if (this.props.status !== MatchStatus.SCHEDULED) {
      throw new Error("Only scheduled matches can be started");
    }
    return new Match({ ...this.props, status: MatchStatus.IN_PROGRESS });
  }

  recordResult(homeScore: number, awayScore: number): Match {
    if (this.props.status === MatchStatus.COMPLETED) {
      throw new Error("Match is already completed");
    }
    if (this.props.status === MatchStatus.NO_SHOW) {
      throw new Error("Cannot record result for a no-show match");
    }
    if (homeScore < 0 || awayScore < 0) {
      throw new Error("Scores cannot be negative");
    }
    return new Match({
      ...this.props,
      homeScore,
      awayScore,
      status: MatchStatus.COMPLETED,
    });
  }

  markNoShow(): Match {
    if (this.props.status === MatchStatus.COMPLETED) {
      throw new Error("Match is already completed");
    }
    if (this.props.status === MatchStatus.NO_SHOW) {
      throw new Error("Match is already marked as no-show");
    }
    return new Match({
      ...this.props,
      homeScore: null,
      awayScore: null,
      status: MatchStatus.NO_SHOW,
    });
  }

  involvesTeam(teamId: string): boolean {
    return this.props.homeTeamId === teamId || this.props.awayTeamId === teamId;
  }

  isForfeit(): boolean {
    return this.props.homeScore === 3 && this.props.awayScore === 0 &&
      this.props.status === MatchStatus.COMPLETED &&
      this.props.phase === MatchPhase.LEAGUE;
  }

  isNoShow(): boolean {
    return this.props.status === MatchStatus.NO_SHOW;
  }
}
