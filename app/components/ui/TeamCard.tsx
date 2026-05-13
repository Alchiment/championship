import { FlagBadge } from "./FlagBadge";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    code: string;
    flag: string;
    status: string;
    playerCount: number;
    captain: { name: string } | null;
  };
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="rounded-xl border border-default bg-surface p-5 transition-colors hover:border-accent/30">
      <div className="flex items-center gap-3">
        <div className="text-4xl">{team.flag}</div>
        <div>
          <h3 className="font-semibold text-primary">{team.name}</h3>
          <p className="text-sm text-muted">{team.code}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-secondary">
        <span>{team.playerCount} jugadores</span>
        {team.captain && (
          <span className="text-accent">Capitán: {team.captain.name}</span>
        )}
      </div>
      {team.status === "WITHDRAWN" && (
        <div className="mt-2">
          <span className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
            WITHDRAWN
          </span>
        </div>
      )}
    </div>
  );
}
