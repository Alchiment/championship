export interface PlayerProps {
  id: string;
  name: string;
  jerseyNumber: number | null;
  isCaptain: boolean;
  teamId: string;
}

export class Player {
  constructor(private props: PlayerProps) {}

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get jerseyNumber() { return this.props.jerseyNumber; }
  get isCaptain() { return this.props.isCaptain; }
  get teamId() { return this.props.teamId; }

  assignCaptain(): Player {
    return new Player({ ...this.props, isCaptain: true });
  }

  removeCaptain(): Player {
    return new Player({ ...this.props, isCaptain: false });
  }
}
