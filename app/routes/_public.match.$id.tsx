import { data } from "react-router";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { prisma } from "../infrastructure/database/client";
import { NotFoundError } from "../errors/NotFoundError";

export async function loader({ params }: LoaderFunctionArgs) {
  const match = await prisma.match.findUnique({
    where: { id: params.id },
    include: { homeTeam: true, awayTeam: true },
  });

  if (!match) throw new NotFoundError("Match not found");

  return data({
    match: {
      id: match.id,
      round: match.round,
      phase: match.phase,
      status: match.status,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      homeTeam: { name: match.homeTeam.name, flag: match.homeTeam.flag, code: match.homeTeam.code },
      awayTeam: { name: match.awayTeam.name, flag: match.awayTeam.flag, code: match.awayTeam.code },
    },
  });
}

export default function MatchDetailPage() {
  const { match } = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-default bg-surface p-8">
      <h2 className="mb-2 text-center text-sm text-muted">
        Jornada {match.round} · {match.phase === "LEAGUE" ? "Liga" : match.phase}
      </h2>
      <div className="flex items-center justify-center gap-8 py-8">
        <div className="text-center">
          <span className="text-5xl">{match.homeTeam.flag}</span>
          <p className="mt-2 font-semibold text-primary">{match.homeTeam.name}</p>
        </div>
        <div className="text-center">
          {match.status === "COMPLETED" ? (
            <span className="text-4xl font-bold text-accent">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : match.status === "IN_PROGRESS" ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              En juego
            </span>
          ) : (
            <span className="text-lg text-muted">Programado</span>
          )}
        </div>
        <div className="text-center">
          <span className="text-5xl">{match.awayTeam.flag}</span>
          <p className="mt-2 font-semibold text-primary">{match.awayTeam.name}</p>
        </div>
      </div>
    </div>
  );
}
