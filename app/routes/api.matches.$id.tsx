import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "../infrastructure/database/client";
import { requireAdmin } from "../utils/auth.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await requireAdmin(request);

  if (request.method === "PATCH") {
    const body = await request.json();
    const { homeScore, awayScore } = body;

    const match = await prisma.match.update({
      where: { id: params.id },
      data: { status: "COMPLETED", homeScore, awayScore },
      include: { homeTeam: true, awayTeam: true },
    });

    return json(match);
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
