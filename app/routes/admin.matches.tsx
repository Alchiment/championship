import { data, redirect } from "react-router";
import { useLoaderData, Form, useNavigation } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { prisma } from "../infrastructure/database/client";
import { requireAdmin } from "../utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const tournament = await prisma.tournament.findFirst();
  if (!tournament) return data({ rounds: [], tournamentId: "" });

  const matches = await prisma.match.findMany({
    where: { tournamentId: tournament.id },
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ round: "asc" }, { id: "asc" }],
  });

  const roundsMap = new Map<number, typeof matches>();
  for (const match of matches) {
    const existing = roundsMap.get(match.round) || [];
    existing.push(match);
    roundsMap.set(match.round, existing);
  }

  const rounds = Array.from(roundsMap.entries()).map(([round, ms]) => ({
    round,
    matches: ms.map((m) => ({
      id: m.id,
      status: m.status,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, flag: m.homeTeam.flag },
      awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, flag: m.awayTeam.flag },
    })),
  }));

  return data({ rounds, tournamentId: tournament.id });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (intent === "generate") {
    const tournamentId = formData.get("tournamentId") as string;
    const teams = await prisma.team.findMany({
      where: { tournamentId, status: "ACTIVE" },
    });

    const teamIds = teams.map((t) => t.id);
    if (teamIds.length < 2) {
      return data({ error: "Need at least 2 teams" }, { status: 400 });
    }

    if (teamIds.length % 2 !== 0) {
      teamIds.push("BYE");
    }

    const numRounds = teamIds.length - 1;
    const numMatchesPerRound = Math.floor(teamIds.length / 2);
    const fixed = teamIds[0];
    const rotating = teamIds.slice(1);

    for (let round = 1; round <= numRounds; round++) {
      const roundTeams = [fixed, ...rotating];
      for (let m = 0; m < numMatchesPerRound; m++) {
        const home = roundTeams[m];
        const away = roundTeams[roundTeams.length - 1 - m];
        if (home === "BYE" || away === "BYE") continue;

        const exists = await prisma.match.findFirst({
          where: { tournamentId, round, homeTeamId: home, awayTeamId: away },
        });
        if (!exists) {
          await prisma.match.create({
            data: {
              round,
              phase: "LEAGUE",
              status: "SCHEDULED",
              tournamentId,
              homeTeamId: home,
              awayTeamId: away,
            },
          });
        }
      }
      rotating.push(rotating.shift()!);
    }

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { status: "LEAGUE_PHASE" },
    });
  }

  if (intent === "record") {
    const matchId = formData.get("matchId") as string;
    const homeScore = parseInt(formData.get("homeScore") as string);
    const awayScore = parseInt(formData.get("awayScore") as string);

    await prisma.match.update({
      where: { id: matchId },
      data: { status: "COMPLETED", homeScore, awayScore },
    });
  }

  return redirect("/admin/matches");
}

export default function AdminMatches() {
  const { rounds, tournamentId } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Partidos</h1>

      {rounds.length === 0 && (
        <div className="mb-8 rounded-xl border border-default bg-surface p-6">
          <h2 className="mb-4 text-lg font-semibold text-primary">Generar calendario</h2>
          <Form method="post">
            <input type="hidden" name="intent" value="generate" />
            <input type="hidden" name="tournamentId" value={tournamentId} />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-accent px-4 py-2.5 font-medium text-slate-950 hover:bg-accent-600 disabled:opacity-50"
            >
              {isSubmitting ? "Generando..." : "Generar calendario e iniciar liga"}
            </button>
          </Form>
        </div>
      )}

      {rounds.map((round) => (
        <div key={round.round} className="mb-6 rounded-xl border border-default bg-surface p-5">
          <h3 className="mb-4 text-lg font-semibold text-primary">Jornada {round.round}</h3>
          <div className="divide-y divide-default">
            {round.matches.map((match) => (
              <div key={match.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm">{match.homeTeam.flag}</span>
                  <span className="text-primary">{match.homeTeam.name}</span>
                </div>

                {match.status === "COMPLETED" ? (
                  <span className="font-bold text-accent">
                    {match.homeScore} - {match.awayScore}
                  </span>
                ) : (
                  <Form method="post" className="flex items-center gap-2">
                    <input type="hidden" name="intent" value="record" />
                    <input type="hidden" name="matchId" value={match.id} />
                    <input
                      type="number"
                      name="homeScore"
                      required
                      min="0"
                      className="w-16 rounded-lg border border-default bg-inset px-2 py-1.5 text-center text-primary focus:border-accent focus:ring-1 focus:ring-accent/50"
                    />
                    <span className="text-muted">-</span>
                    <input
                      type="number"
                      name="awayScore"
                      required
                      min="0"
                      className="w-16 rounded-lg border border-default bg-inset px-2 py-1.5 text-center text-primary focus:border-accent focus:ring-1 focus:ring-accent/50"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-slate-950 hover:bg-accent-600"
                    >
                      Guardar
                    </button>
                  </Form>
                )}

                <div className="flex items-center gap-3">
                  <span className="text-primary">{match.awayTeam.name}</span>
                  <span className="text-sm">{match.awayTeam.flag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
