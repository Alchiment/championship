import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-primary">Bienvenido</h1>
        <p className="text-secondary">Panel de administración del torneo</p>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <Link
          to="/admin/teams"
          className="rounded-xl border border-default bg-surface px-5 py-4 font-medium text-primary transition-colors hover:border-accent/30"
        >
          <span className="block text-lg">👥</span>
          <span>Equipos</span>
        </Link>
        <Link
          to="/admin/matches"
          className="rounded-xl border border-default bg-surface px-5 py-4 font-medium text-primary transition-colors hover:border-accent/30"
        >
          <span className="block text-lg">📅</span>
          <span>Partidos</span>
        </Link>
        <Link
          to="/admin/settings"
          className="rounded-xl border border-default bg-surface px-5 py-4 font-medium text-primary transition-colors hover:border-accent/30"
        >
          <span className="block text-lg">⚙️</span>
          <span>Configuración</span>
        </Link>
      </div>

      {tournament ? (
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
      ) : (
        <div className="rounded-xl border border-default bg-surface p-6 text-center">
          <p className="mb-3 text-secondary">No hay torneo activo.</p>
          <Link
            to="/admin/settings"
            className="inline-block rounded-lg bg-accent px-4 py-2 font-medium text-slate-950 hover:bg-accent-600"
          >
            Configurar torneo
          </Link>
        </div>
      )}
    </div>
  );
}
