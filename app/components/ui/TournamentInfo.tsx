interface TournamentInfoProps {
  name: string;
  venue: string;
  status: string;
  organizers: { name: string; role: string }[];
  sponsors: { name: string; description: string | null }[];
}

export function TournamentInfo({ name, venue, status, organizers, sponsors }: TournamentInfoProps) {
  const statusLabels: Record<string, string> = {
    SETUP: "Configuración",
    LEAGUE_PHASE: "Fase de Liga",
    PLAYOFFS: "Playoffs",
    COMPLETED: "Finalizado",
  };

  const statusColors: Record<string, string> = {
    SETUP: "text-amber-400",
    LEAGUE_PHASE: "text-emerald-400",
    PLAYOFFS: "text-emerald-300",
    COMPLETED: "text-muted",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-default bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">{name}</h2>
            <p className="text-secondary">{venue}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-sm font-medium ${statusColors[status] || ""}`}>
            <span className={`inline-block h-2 w-2 rounded-full ${statusColors[status] ? "bg-current" : ""}`} />
            {statusLabels[status] || status}
          </span>
        </div>
      </div>

      {organizers.length > 0 && (
        <div className="rounded-xl border border-default bg-surface p-6">
          <h3 className="mb-3 text-lg font-semibold text-secondary">Organizadores</h3>
          <div className="space-y-2">
            {organizers.map((org, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-primary">{org.name}</span>
                <span className="text-sm text-muted">{org.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sponsors.length > 0 && (
        <div className="rounded-xl border border-default bg-surface p-6">
          <h3 className="mb-3 text-lg font-semibold text-secondary">Patrocinadores</h3>
          <div className="space-y-2">
            {sponsors.map((sp, i) => (
              <div key={i}>
                <span className="text-primary">{sp.name}</span>
                {sp.description && (
                  <p className="text-sm text-muted">{sp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
