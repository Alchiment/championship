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
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="text-3xl">{team.flag}</div>
        <div>
          <h3 className="font-semibold text-gray-800">{team.name}</h3>
          <p className="text-sm text-gray-500">{team.code}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <span>{team.playerCount} jugadores</span>
        {team.captain && (
          <span className="text-yellow-600">Capitán: {team.captain.name}</span>
        )}
      </div>
      {team.status === "WITHDRAWN" && (
        <div className="mt-2">
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
            WITHDRAWN
          </span>
        </div>
      )}
    </div>
  );
}
