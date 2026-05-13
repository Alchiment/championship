import { data } from "react-router";
import { prisma } from "../infrastructure/database/client";
import { CalculateStandings } from "../domain/use-cases/CalculateStandings";
import { PrismaTeamRepository } from "../infrastructure/database/repositories/PrismaTeamRepository";
import { PrismaMatchRepository } from "../infrastructure/database/repositories/PrismaMatchRepository";
import { StandingAdapter } from "../adapters/standing.adapter";

export async function loader() {
  const tournament = await prisma.tournament.findFirst();
  if (!tournament) return data([]);

  const teamRepo = new PrismaTeamRepository();
  const matchRepo = new PrismaMatchRepository();
  const calculateStandings = new CalculateStandings(teamRepo, matchRepo);

  const standings = await calculateStandings.execute(tournament.id);
  const dtos = standings.map((s, i) => StandingAdapter.toDTO(s, i + 1));

  return data(dtos);
}
