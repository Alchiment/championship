import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "../infrastructure/database/client";

export async function loader() {
  const tournament = await prisma.tournament.findFirst({
    include: { _count: { select: { teams: true, matches: true } } },
  });

  const statusColors: Record<string, string> = {
    SETUP: "text-amber-400",
    LEAGUE_PHASE: "text-emerald-400",
    PLAYOFFS: "text-emerald-300",
    COMPLETED: "text-muted",
  };

  return json({
    tournament: tournament
      ? {
          id: tournament.id,
          name: tournament.name,
          status: tournament.status,
          statusColor: statusColors[tournament.status] || "text-muted",
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
        <h1 className="mb-6 text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary">No hay torneo activo.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-default bg-surface p-6">
          <h3 className="text-sm font-medium uppercase text-muted">Estado</h3>
          <p className={`mt-2 text-3xl font-bold ${tournament.statusColor}`}>{tournament.status}</p>
        </div>
        <div className="rounded-xl border border-default bg-surface p-6">
          <h3 className="text-sm font-medium uppercase text-muted">Equipos</h3>
          <p className="mt-2 text-3xl font-bold text-primary">{tournament.teamCount}</p>
        </div>
        <div className="rounded-xl border border-default bg-surface p-6">
          <h3 className="text-sm font-medium uppercase text-muted">Partidos</h3>
          <p className="mt-2 text-3xl font-bold text-primary">{tournament.matchCount}</p>
        </div>
      </div>
    </div>
  );
}
