import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPhone = process.env.ADMIN_PHONE || "+573001234567";

  const tournament = await prisma.tournament.create({
    data: {
      name: "Torneo de Fútbol Intertorres K108",
      venue: "Cancha K108 Roble",
      status: "SETUP",
      playoffCutoff: 4,
      hasGroupPhase: false,
      thirdPlaceEnabled: false,
      organizers: {
        create: [
          { name: "Consejo de Administración", role: "Organizador principal" },
          { name: "Comité de Convivencia", role: "Coordinador" },
        ],
      },
      sponsors: {
        create: [
          { name: "K108 Roble", description: "Complejo residencial" },
        ],
      },
      users: {
        create: [
          {
            phoneNumber: adminPhone,
            isAdmin: true,
          },
        ],
      },
      teams: {
        create: [
          { name: "España", code: "ESP", flag: "🇪🇸" },
          { name: "Colombia", code: "COL", flag: "🇨🇴" },
          { name: "Argentina", code: "ARG", flag: "🇦🇷" },
          { name: "Brasil", code: "BRA", flag: "🇧🇷" },
          { name: "Francia", code: "FRA", flag: "🇫🇷" },
          { name: "Alemania", code: "GER", flag: "🇩🇪" },
          { name: "Italia", code: "ITA", flag: "🇮🇹" },
          { name: "Portugal", code: "POR", flag: "🇵🇹" },
        ],
      },
    },
  });

  console.log(`Tournament created: ${tournament.name} (ID: ${tournament.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
