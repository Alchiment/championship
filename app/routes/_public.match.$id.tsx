import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "../infrastructure/database/client";
import { NotFoundError } from "../errors/NotFoundError";

export async function loader({ params }: LoaderFunctionArgs) {
  const match = await prisma.match.findUnique({
    where: { id: params.id },
    include: { homeTeam: true, awayTeam: true },
  });

  if (!match) throw new NotFoundError("Match not found");

  return json({
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
    <div className="mx-auto max-w-lg rounded-lg bg-white p-8 shadow">
      <h2 className="mb-2 text-center text-sm text-gray-500">
        Jornada {match.round} · {match.phase === "LEAGUE" ? "Liga" : match.phase}
      </h2>
      <div className="flex items-center justify-center space-x-8 py-8">
        <div className="text-center">
          <span className="text-4xl">{match.homeTeam.flag}</span>
          <p className="mt-2 font-semibold text-gray-800">{match.homeTeam.name}</p>
        </div>
        <div className="text-center">
          {match.status === "COMPLETED" ? (
            <span className="text-3xl font-bold text-gray-800">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="text-lg text-gray-500">
              {match.status === "IN_PROGRESS" ? "En juego" : "Programado"}
            </span>
          )}
        </div>
        <div className="text-center">
          <span className="text-4xl">{match.awayTeam.flag}</span>
          <p className="mt-2 font-semibold text-gray-800">{match.awayTeam.name}</p>
        </div>
      </div>
    </div>
  );
}
