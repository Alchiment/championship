import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "../infrastructure/database/client";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const tournamentId = url.searchParams.get("tournamentId");
  const round = url.searchParams.get("round") ? parseInt(url.searchParams.get("round")!) : undefined;

  const tournament = await prisma.tournament.findFirst();
  if (!tournament) return json([]);

  const where: any = { tournamentId: tournament.id };
  if (round !== undefined) where.round = round;

  const matches = await prisma.match.findMany({
    where,
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ round: "asc" }, { id: "asc" }],
  });

  return json(
    matches.map((m) => ({
      id: m.id,
      round: m.round,
      phase: m.phase,
      status: m.status,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, flag: m.homeTeam.flag, code: m.homeTeam.code },
      awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, flag: m.awayTeam.flag, code: m.awayTeam.code },
    }))
  );
}
