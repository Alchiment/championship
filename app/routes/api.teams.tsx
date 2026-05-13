import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { prisma } from "../infrastructure/database/client";
import { requireAdmin } from "../utils/auth.server";
import { generateCode } from "../utils/country-codes";

export async function loader() {
  const tournament = await prisma.tournament.findFirst();
  if (!tournament) return json([]);

  const teams = await prisma.team.findMany({
    where: { tournamentId: tournament.id },
    include: { players: true },
    orderBy: { name: "asc" },
  });

  return json(
    teams.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      flag: t.flag,
      status: t.status,
      playerCount: t.players.length,
      players: t.players.map((p) => ({
        id: p.id,
        name: p.name,
        jerseyNumber: p.jerseyNumber,
        isCaptain: p.isCaptain,
      })),
    }))
  );
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  if (request.method === "POST") {
    const body = await request.json();
    const tournament = await prisma.tournament.findFirst();
    if (!tournament) return json({ error: "No tournament" }, { status: 400 });

    const team = await prisma.team.create({
      data: {
        name: body.name,
        code: generateCode(body.name),
        flag: body.flag,
        tournamentId: tournament.id,
      },
    });

    return json(team, { status: 201 });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
