import { data } from "react-router";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "../infrastructure/database/client";
import { NotFoundError } from "../errors/NotFoundError";
import { FlagBadge } from "../components/ui/FlagBadge";

export async function loader({ params }: LoaderFunctionArgs) {
  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: { players: true },
  });

  if (!team) throw new NotFoundError("Team not found");

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    },
    include: { homeTeam: true, awayTeam: true },
    orderBy: { round: "asc" },
  });

  return data({
    team: {
      id: team.id,
      name: team.name,
      code: team.code,
      flag: team.flag,
      status: team.status,
      players: team.players.map((p) => ({
        id: p.id,
        name: p.name,
        jerseyNumber: p.jerseyNumber,
        isCaptain: p.isCaptain,
      })),
      captain: team.players.find((p) => p.isCaptain) || null,
    },
    matches: matches.map((m) => ({
      id: m.id,
      round: m.round,
      status: m.status,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      homeTeam: { name: m.homeTeam.name, flag: m.homeTeam.flag },
      awayTeam: { name: m.awayTeam.name, flag: m.awayTeam.flag },
      isHome: m.homeTeamId === team.id,
    })),
  });
}

export default function TeamDetailPage() {
  const { team, matches } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-default bg-surface p-6">
        <div className="flex items-center gap-4">
          <FlagBadge flag={team.flag} code={team.code} />
          <div>
            <h1 className="text-2xl font-bold text-primary">{team.name}</h1>
            {team.status === "WITHDRAWN" && (
              <span className="inline-block rounded bg-red-500/10 px-2 py-1 text-xs text-red-400">
                WITHDRAWN
              </span>
            )}
          </div>
        </div>
      </div>

      {/* TODO: re-enable when player management is ready
      <div className="rounded-xl border border-default bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary">Jugadores</h2>
        {team.players.length === 0 ? (
          <p className="text-muted">No hay jugadores registrados.</p>
        ) : (
          <ul className="divide-y divide-default">
            {team.players.map((player) => (
              <li key={player.id} className="flex items-center justify-between py-2">
                <span className="text-primary">
                  {player.name}
                  {player.isCaptain && (
                    <span className="ml-2 text-xs text-accent">(C)</span>
                  )}
                </span>
                {player.jerseyNumber && (
                  <span className="text-sm text-muted">#{player.jerseyNumber}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      */}

      <div className="rounded-xl border border-default bg-surface p-6">
        <h2 className="mb-4 text-lg font-semibold text-primary">Partidos</h2>
        {matches.length === 0 ? (
          <p className="text-muted">No hay partidos aún.</p>
        ) : (
          <div className="space-y-2">
            {matches.map((match) => (
              <a
                key={match.id}
                href={`/match/${match.id}`}
                className="flex items-center justify-between rounded-lg border border-default bg-surface p-3 transition-colors hover:border-accent/30"
              >
                <div className="flex items-center gap-2">
                  <span>{match.homeTeam.flag}</span>
                  <span className="text-sm text-primary">{match.homeTeam.name}</span>
                </div>
                <div className="text-center">
                  {match.status === "COMPLETED" ? (
                    <span className="font-bold text-accent">
                      {match.homeScore} - {match.awayScore}
                    </span>
                  ) : (
                    <span className="text-sm text-secondary">vs</span>
                  )}
                  <span className="ml-2 text-xs text-muted">J{match.round}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-primary">{match.awayTeam.name}</span>
                  <span>{match.awayTeam.flag}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
