import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "../infrastructure/database/client";
import { MatchCard } from "../components/ui/MatchCard";

export async function loader() {
  const tournament = await prisma.tournament.findFirst();
  if (!tournament) {
    return json({ rounds: [] });
  }

  const matches = await prisma.match.findMany({
    where: { tournamentId: tournament.id },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: [{ round: "asc" }, { id: "asc" }],
  });

  const roundsMap = new Map<number, typeof matches>();
  for (const match of matches) {
    const existing = roundsMap.get(match.round) || [];
    existing.push(match);
    roundsMap.set(match.round, existing);
  }

  const rounds = Array.from(roundsMap.entries()).map(([round, matches]) => ({
    round,
    matches: matches.map((m) => ({
      id: m.id,
      status: m.status,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, flag: m.homeTeam.flag, code: m.homeTeam.code },
      awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, flag: m.awayTeam.flag, code: m.awayTeam.code },
    })),
  }));

  return json({ rounds });
}

export default function SchedulePage() {
  const { rounds } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Calendario</h2>
      {rounds.length === 0 ? (
        <p className="text-gray-600">No hay partidos programados aún.</p>
      ) : (
        rounds.map((round) => (
          <div key={round.round} className="rounded-lg bg-white p-4 shadow">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              Jornada {round.round}
            </h3>
            <div className="space-y-3">
              {round.matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
