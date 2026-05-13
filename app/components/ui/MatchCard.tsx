import { Link } from "@remix-run/react";
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
      className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
    >
      <div className="flex items-center space-x-3">
        <FlagBadge flag={match.homeTeam.flag} code={match.homeTeam.code} />
        <span className="font-medium text-gray-800">{match.homeTeam.name}</span>
      </div>

      <div className="text-center">
        {match.status === "COMPLETED" ? (
          <span className="text-xl font-bold text-gray-800">
            {match.homeScore} - {match.awayScore}
          </span>
        ) : match.status === "IN_PROGRESS" ? (
          <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
            En juego
          </span>
        ) : (
          <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
            Programado
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <span className="font-medium text-gray-800">{match.awayTeam.name}</span>
        <FlagBadge flag={match.awayTeam.flag} code={match.awayTeam.code} />
      </div>
    </Link>
  );
}
