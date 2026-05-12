import { Link } from "@remix-run/react";
import { FlagBadge } from "./FlagBadge";
import type { StandingDTO } from "../../adapters/standing.adapter";

interface StandingsTableProps {
  standings: StandingDTO[];
}

export function StandingsTable({ standings }: StandingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">#</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Equipo</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">PJ</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">G</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">E</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">P</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">GF</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">GC</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">DG</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {standings.map((s) => (
            <tr key={s.teamId} className={`hover:bg-gray-50 ${s.isWithdrawn ? "opacity-60" : ""}`}>
              <td className="px-4 py-3 text-sm text-gray-500">{s.position}</td>
              <td className="px-4 py-3">
                <Link to={`/team/${s.teamId}`} className="flex items-center space-x-2">
                  <FlagBadge flag={s.teamFlag} code={s.teamCode} />
                  <span className="font-medium text-gray-800">{s.teamName}</span>
                  {s.isWithdrawn && (
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
                      WITHDRAWN
                    </span>
                  )}
                </Link>
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-700">{s.played}</td>
              <td className="px-4 py-3 text-center text-sm text-gray-700">{s.wins}</td>
              <td className="px-4 py-3 text-center text-sm text-gray-700">{s.draws}</td>
              <td className="px-4 py-3 text-center text-sm text-gray-700">{s.losses}</td>
              <td className="px-4 py-3 text-center text-sm text-gray-700">{s.goalsFor}</td>
              <td className="px-4 py-3 text-center text-sm text-gray-700">{s.goalsAgainst}</td>
              <td className={`px-4 py-3 text-center text-sm font-medium ${
                s.goalDifference > 0 ? "text-green-600" : s.goalDifference < 0 ? "text-red-600" : "text-gray-700"
              }`}>
                {s.goalDifference > 0 ? "+" : ""}{s.goalDifference}
              </td>
              <td className="px-4 py-3 text-center text-sm font-bold text-gray-800">{s.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
