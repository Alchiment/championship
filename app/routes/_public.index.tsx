import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "../infrastructure/database/client";
import { TournamentInfo } from "../components/ui/TournamentInfo";

export async function loader() {
  const tournament = await prisma.tournament.findFirst({
    include: { organizers: true, sponsors: true },
  });
  return json({ tournament });
}

export default function HomePage() {
  const { tournament } = useLoaderData<typeof loader>();

  if (!tournament) {
    return (
      <div className="text-center">
        <p className="text-gray-600">No hay torneo activo</p>
      </div>
    );
  }

  return (
    <TournamentInfo
      name={tournament.name}
      venue={tournament.venue}
      status={tournament.status}
      organizers={tournament.organizers}
      sponsors={tournament.sponsors}
    />
  );
}
