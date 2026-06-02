import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { prisma } from "../infrastructure/database/client";
import { requireAdmin } from "../utils/auth.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await requireAdmin(request);

  if (request.method === "PATCH") {
    const body = await request.json();
    const { homeScore, awayScore, noShow } = body;

    if (noShow) {
      const match = await prisma.match.update({
        where: { id: params.id },
        data: { status: "NO_SHOW", homeScore: null, awayScore: null },
        include: { homeTeam: true, awayTeam: true },
      });
      return data(match);
    }

    const match = await prisma.match.update({
      where: { id: params.id },
      data: { status: "COMPLETED", homeScore, awayScore },
      include: { homeTeam: true, awayTeam: true },
    });

    return data(match);
  }

  return data({ error: "Method not allowed" }, { status: 405 });
}
