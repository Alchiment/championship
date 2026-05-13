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
    SETUP: "bg-yellow-100 text-yellow-700",
    LEAGUE_PHASE: "bg-blue-100 text-blue-700",
    PLAYOFFS: "bg-green-100 text-green-700",
    COMPLETED: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <p className="text-gray-600">{venue}</p>
          </div>
          <span className={`rounded px-3 py-1 text-sm font-medium ${statusColors[status] || ""}`}>
            {statusLabels[status] || status}
          </span>
        </div>
      </div>

      {organizers.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Organizadores</h3>
          <div className="space-y-2">
            {organizers.map((org, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-800">{org.name}</span>
                <span className="text-sm text-gray-500">{org.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sponsors.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Patrocinadores</h3>
          <div className="space-y-2">
            {sponsors.map((sp, i) => (
              <div key={i}>
                <span className="text-gray-800">{sp.name}</span>
                {sp.description && (
                  <p className="text-sm text-gray-500">{sp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
