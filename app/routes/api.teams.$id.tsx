import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { prisma } from "../infrastructure/database/client";
import { requireAdmin } from "../utils/auth.server";

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAdmin(request);

  if (request.method === "DELETE") {
    const teamId = params.id;

    const tournament = await prisma.tournament.findFirst();
    if (!tournament) return data({ error: "No tournament" }, { status: 400 });

    await prisma.team.update({
      where: { id: teamId },
      data: { status: "WITHDRAWN" },
    });

    const futureMatches = await prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
        status: "SCHEDULED",
        tournamentId: tournament.id,
      },
    });

    for (const match of futureMatches) {
      const isHome = match.homeTeamId === teamId;
      await prisma.match.update({
        where: { id: match.id },
        data: {
          status: "COMPLETED",
          homeScore: isHome ? 0 : 3,
          awayScore: isHome ? 3 : 0,
        },
      });
    }

    return data({ success: true });
  }

  return data({ error: "Method not allowed" }, { status: 405 });
}
