export enum TeamStatus {
  ACTIVE = "ACTIVE",
  WITHDRAWN = "WITHDRAWN",
}

export interface TeamProps {
  id: string;
  name: string;
  code: string;
  flag: string;
  status: TeamStatus;
  tournamentId: string;
}

export class Team {
  constructor(private props: TeamProps) {}

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get code() { return this.props.code; }
  get flag() { return this.props.flag; }
  get status() { return this.props.status; }
  get tournamentId() { return this.props.tournamentId; }

  isActive(): boolean {
    return this.props.status === TeamStatus.ACTIVE;
  }

  withdraw(): Team {
    if (this.props.status === TeamStatus.WITHDRAWN) {
      throw new Error("Team has already withdrawn");
    }
    return new Team({ ...this.props, status: TeamStatus.WITHDRAWN });
  }
}
