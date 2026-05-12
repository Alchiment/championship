export interface StandingProps {
  teamId: string;
  teamName: string;
  teamCode: string;
  teamFlag: string;
  teamStatus: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export class Standing {
  constructor(private props: StandingProps) {}

  get teamId() { return this.props.teamId; }
  get teamName() { return this.props.teamName; }
  get teamCode() { return this.props.teamCode; }
  get teamFlag() { return this.props.teamFlag; }
  get teamStatus() { return this.props.teamStatus; }
  get played() { return this.props.played; }
  get wins() { return this.props.wins; }
  get draws() { return this.props.draws; }
  get losses() { return this.props.losses; }
  get goalsFor() { return this.props.goalsFor; }
  get goalsAgainst() { return this.props.goalsAgainst; }
  get goalDifference() { return this.props.goalDifference; }
  get points() { return this.props.points; }
  get isWithdrawn() { return this.props.teamStatus === "WITHDRAWN"; }

  toJSON(): StandingProps {
    return { ...this.props };
  }
}
