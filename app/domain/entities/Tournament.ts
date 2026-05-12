export enum TournamentStatus {
  SETUP = "SETUP",
  LEAGUE_PHASE = "LEAGUE_PHASE",
  PLAYOFFS = "PLAYOFFS",
  COMPLETED = "COMPLETED",
}

export interface TournamentProps {
  id: string;
  name: string;
  venue: string;
  status: TournamentStatus;
  playoffCutoff: number;
  hasGroupPhase: boolean;
  thirdPlaceEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Tournament {
  constructor(private props: TournamentProps) {}

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get venue() { return this.props.venue; }
  get status() { return this.props.status; }
  get playoffCutoff() { return this.props.playoffCutoff; }
  get hasGroupPhase() { return this.props.hasGroupPhase; }
  get thirdPlaceEnabled() { return this.props.thirdPlaceEnabled; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  canStartLeague(): boolean {
    return this.props.status === TournamentStatus.SETUP;
  }

  startLeague(): Tournament {
    if (!this.canStartLeague()) {
      throw new Error(`Cannot start league from status: ${this.props.status}`);
    }
    return new Tournament({ ...this.props, status: TournamentStatus.LEAGUE_PHASE });
  }

  canStartPlayoffs(): boolean {
    return this.props.status === TournamentStatus.LEAGUE_PHASE && this.props.hasGroupPhase;
  }

  startPlayoffs(): Tournament {
    if (!this.canStartPlayoffs()) {
      throw new Error(`Cannot start playoffs from status: ${this.props.status}`);
    }
    return new Tournament({ ...this.props, status: TournamentStatus.PLAYOFFS });
  }

  complete(): Tournament {
    if (this.props.status !== TournamentStatus.LEAGUE_PHASE && this.props.status !== TournamentStatus.PLAYOFFS) {
      throw new Error(`Cannot complete tournament from status: ${this.props.status}`);
    }
    return new Tournament({ ...this.props, status: TournamentStatus.COMPLETED });
  }

  updateSettings(settings: Partial<Pick<TournamentProps, "name" | "venue" | "playoffCutoff" | "hasGroupPhase" | "thirdPlaceEnabled">>): Tournament {
    if (this.props.status !== TournamentStatus.SETUP) {
      throw new Error("Can only update settings during SETUP phase");
    }
    return new Tournament({ ...this.props, ...settings });
  }
}
