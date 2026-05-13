import { Link } from "@remix-run/react";
import { FlagBadge } from "./FlagBadge";
import type { StandingDTO } from "../../adapters/standing.adapter";

interface StandingsTableProps {
  standings: StandingDTO[];
  playoffCutoff?: number;
}

export function StandingsTable({ standings, playoffCutoff }: StandingsTableProps) {
  const cutoff = playoffCutoff ?? standings.length;

  return (
    <div className="overflow-x-auto rounded-xl border border-default bg-surface">
      <table className="min-w-full">
        <thead className="bg-elevated">
          <tr>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase text-muted">#</th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase text-muted">Equipo</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium uppercase text-muted">PJ</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium uppercase text-muted">G</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium uppercase text-muted">E</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium uppercase text-muted">P</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium uppercase text-muted">GF</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium uppercase text-muted">GC</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium uppercase text-muted">DG</th>
            <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium uppercase text-muted">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-default">
          {standings.flatMap((s, index) => {
            const prevPosition = index > 0 ? standings[index - 1].position : 0;
            const rows = [];

            if (cutoff > 0 && cutoff < standings.length && s.position > cutoff && prevPosition <= cutoff) {
              rows.push(
                <tr key="playoff-cutoff">
                  <td
                    colSpan={10}
                    className="border-t-2 border-dashed border-accent/50 px-4 py-2 text-center text-xs font-medium text-accent/70"
                  >
                    ── Corte de playoff ──
                  </td>
                </tr>,
              );
            }

            rows.push(
              <tr
                key={s.teamId}
                className={`hover:bg-elevated/50 ${s.isWithdrawn ? "opacity-60" : ""} ${
                  cutoff > 0 && s.position <= cutoff ? "border-l-2 border-accent" : ""
                }`}
              >
                <td className="px-4 py-3 text-sm text-muted">{s.position}</td>
                <td className="px-4 py-3">
                  <Link to={`/team/${s.teamId}`} className="flex items-center gap-2">
                    <FlagBadge flag={s.teamFlag} code={s.teamCode} />
                    <span className="font-medium text-primary">{s.teamName}</span>
                    {s.isWithdrawn && (
                      <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-xs text-red-400">
                        WITHDRAWN
                      </span>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3 text-center text-sm text-secondary">{s.played}</td>
                <td className="px-4 py-3 text-center text-sm text-secondary">{s.wins}</td>
                <td className="px-4 py-3 text-center text-sm text-secondary">{s.draws}</td>
                <td className="px-4 py-3 text-center text-sm text-secondary">{s.losses}</td>
                <td className="px-4 py-3 text-center text-sm text-secondary">{s.goalsFor}</td>
                <td className="px-4 py-3 text-center text-sm text-secondary">{s.goalsAgainst}</td>
                <td
                  className={`px-4 py-3 text-center text-sm font-medium ${
                    s.goalDifference > 0
                      ? "text-emerald-400"
                      : s.goalDifference < 0
                        ? "text-red-400"
                        : "text-secondary"
                  }`}
                >
                  {s.goalDifference > 0 ? "+" : ""}
                  {s.goalDifference}
                </td>
                <td className="px-4 py-3 text-center text-sm font-bold text-accent">{s.points}</td>
              </tr>,
            );

            return rows;
          })}
        </tbody>
      </table>
    </div>
  );
}
