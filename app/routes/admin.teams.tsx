import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "../infrastructure/database/client";
import { requireAdmin } from "../utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const tournament = await prisma.tournament.findFirst();
  if (!tournament) return json({ teams: [] });

  const teams = await prisma.team.findMany({
    where: { tournamentId: tournament.id },
    include: { players: true },
    orderBy: { name: "asc" },
  });

  return json({
    teams: teams.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      flag: t.flag,
      status: t.status,
      players: t.players.map((p) => ({
        id: p.id,
        name: p.name,
        jerseyNumber: p.jerseyNumber,
        isCaptain: p.isCaptain,
      })),
    })),
  });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "create") {
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    const flag = formData.get("flag") as string;
    const tournament = await prisma.tournament.findFirst();
    if (!tournament) return json({ error: "No tournament found" }, { status: 400 });

    await prisma.team.create({
      data: { name, code, flag, tournamentId: tournament.id },
    });
  }

  if (intent === "withdraw") {
    const teamId = formData.get("teamId") as string;
    await prisma.team.update({
      where: { id: teamId },
      data: { status: "WITHDRAWN" },
    });

    const futureMatches = await prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
        status: "SCHEDULED",
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
  }

  return redirect("/admin/teams");
}

export default function AdminTeams() {
  const { teams } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Equipos</h1>

      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Añadir equipo</h2>
        <Form method="post" className="flex flex-wrap gap-4">
          <input type="hidden" name="intent" value="create" />
          <div>
            <label className="block text-sm text-gray-600">Nombre</label>
            <input type="text" name="name" required className="rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Código</label>
            <input type="text" name="code" required maxLength={3} className="rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Bandera</label>
            <input type="text" name="flag" required placeholder="🇪🇸" className="rounded border px-3 py-2" />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "..." : "Añadir"}
            </button>
          </div>
        </Form>
      </div>

      <div className="rounded-lg bg-white shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Equipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Código</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Jugadores</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Estado</th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase text-gray-500">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="mr-2">{team.flag}</span>
                  <span className="font-medium text-gray-800">{team.name}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{team.code}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-600">{team.players.length}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`rounded px-2 py-1 text-xs ${
                    team.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {team.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {team.status === "ACTIVE" && (
                    <Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="intent" value="withdraw" />
                      <input type="hidden" name="teamId" value={team.id} />
                      <button
                        type="submit"
                        className="text-sm text-red-600 hover:text-red-800"
                        onClick={(e) => {
                          if (!confirm("¿Retirar equipo?")) e.preventDefault();
                        }}
                      >
                        Retirar
                      </button>
                    </Form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
