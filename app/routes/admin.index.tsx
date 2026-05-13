import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "../infrastructure/database/client";

export async function loader() {
  const tournament = await prisma.tournament.findFirst({
    include: { _count: { select: { teams: true, matches: true } } },
  });

  return json({
    tournament: tournament
      ? {
          id: tournament.id,
          name: tournament.name,
          status: tournament.status,
          teamCount: tournament._count.teams,
          matchCount: tournament._count.matches,
        }
      : null,
  });
}

export default function AdminDashboard() {
  const { tournament } = useLoaderData<typeof loader>();

  if (!tournament) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">No hay torneo activo.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Estado</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{tournament.status}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Equipos</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{tournament.teamCount}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-sm font-medium text-gray-500">Partidos</h3>
          <p className="mt-2 text-2xl font-bold text-gray-800">{tournament.matchCount}</p>
        </div>
      </div>
    </div>
  );
}
