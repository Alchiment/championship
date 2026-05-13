import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "../infrastructure/database/client";
import { CalculateStandings } from "../domain/use-cases/CalculateStandings";
import { PrismaTeamRepository } from "../infrastructure/database/repositories/PrismaTeamRepository";
import { PrismaMatchRepository } from "../infrastructure/database/repositories/PrismaMatchRepository";
import { StandingAdapter } from "../adapters/standing.adapter";
import { StandingsTable } from "../components/ui/StandingsTable";

export async function loader() {
  const tournament = await prisma.tournament.findFirst();
  if (!tournament) {
    return json({ standings: [], playoffCutoff: 0 });
  }

  const teamRepo = new PrismaTeamRepository();
  const matchRepo = new PrismaMatchRepository();
  const calculateStandings = new CalculateStandings(teamRepo, matchRepo);

  const standings = await calculateStandings.execute(tournament.id);
  const dtos = standings.map((s, i) => StandingAdapter.toDTO(s, i + 1));

  return json({ standings: dtos, playoffCutoff: tournament.playoffCutoff });
}

export default function StandingsPage() {
  const { standings, playoffCutoff } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Tabla de posiciones</h1>
      <StandingsTable standings={standings} playoffCutoff={playoffCutoff} />
    </div>
  );
}
