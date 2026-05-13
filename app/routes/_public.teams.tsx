import { data } from "react-router";
import { useLoaderData, Link } from "react-router";
import { prisma } from "../infrastructure/database/client";
import { TeamCard } from "../components/ui/TeamCard";

export async function loader() {
  const tournament = await prisma.tournament.findFirst();
  if (!tournament) {
    return data({ teams: [] });
  }

  const teams = await prisma.team.findMany({
    where: { tournamentId: tournament.id },
    include: {
      players: true,
    },
    orderBy: { name: "asc" },
  });

  return data({
    teams: teams.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      flag: t.flag,
      status: t.status,
      players: t.players.map((p) => ({
        id: p.id,
        name: p.name,
        jerseyNumber: p.jerseyNumber,
        isCaptain: p.isCaptain,
      })),
      playerCount: t.players.length,
      captain: t.players.find((p) => p.isCaptain) || null,
    })),
  });
}

export default function TeamsPage() {
  const { teams } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Equipos</h1>
      {teams.length === 0 ? (
        <p className="text-muted">No hay equipos registrados.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Link key={team.id} to={`/team/${team.id}`}>
              <TeamCard team={team} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
