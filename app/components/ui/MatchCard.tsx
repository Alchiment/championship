import { Link } from "react-router";
import { FlagBadge } from "./FlagBadge";

interface MatchCardProps {
  match: {
    id: string;
    status: string;
    homeScore: number | null;
    awayScore: number | null;
    homeTeam: { id: string; name: string; flag: string; code: string };
    awayTeam: { id: string; name: string; flag: string; code: string };
  };
}

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Link
      to={`/match/${match.id}`}
      className="flex items-center justify-between rounded-xl border border-default bg-surface p-4 transition-colors hover:border-accent/30"
    >
      <div className="flex w-1/3 items-center gap-3">
        <FlagBadge flag={match.homeTeam.flag} code={match.homeTeam.code} />
        <span className="truncate font-medium text-primary">{match.homeTeam.name}</span>
      </div>

      <div className="w-1/3 text-center">
        {match.status === "COMPLETED" ? (
          <span className="text-xl font-bold text-accent">
            {match.homeScore} - {match.awayScore}
          </span>
        ) : match.status === "NO_SHOW" ? (
          <span className="text-sm font-bold text-red-400">No se presentaron</span>
        ) : match.status === "IN_PROGRESS" ? (
          <span className="text-emerald-400">
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
            En juego
          </span>
        ) : (
          <span className="text-muted">vs</span>
        )}
      </div>

      <div className="flex w-1/3 items-center justify-end gap-3">
        <span className="truncate font-medium text-primary">{match.awayTeam.name}</span>
        <FlagBadge flag={match.awayTeam.flag} code={match.awayTeam.code} />
      </div>
    </Link>
  );
}
