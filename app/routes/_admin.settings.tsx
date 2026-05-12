import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "../infrastructure/database/client";
import { requireAdmin } from "../utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const tournament = await prisma.tournament.findFirst({
    include: { organizers: true, sponsors: true },
  });
  return json({ tournament });
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const tournament = await prisma.tournament.findFirst();
  if (!tournament) return json({ error: "No tournament" }, { status: 400 });

  if (intent === "settings") {
    await prisma.tournament.update({
      where: { id: tournament.id },
      data: {
        name: formData.get("name") as string,
        venue: formData.get("venue") as string,
        playoffCutoff: parseInt(formData.get("playoffCutoff") as string),
        hasGroupPhase: formData.get("hasGroupPhase") === "true",
        thirdPlaceEnabled: formData.get("thirdPlaceEnabled") === "true",
      },
    });
  }

  if (intent === "add-organizer") {
    await prisma.organizer.create({
      data: {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        tournamentId: tournament.id,
      },
    });
  }

  if (intent === "add-sponsor") {
    await prisma.sponsor.create({
      data: {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || null,
        tournamentId: tournament.id,
      },
    });
  }

  return redirect("/admin/settings");
}

export default function AdminSettings() {
  const { tournament } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (!tournament) {
    return <p className="text-gray-600">No tournament found.</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Configuración</h1>

      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Torneo</h2>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="settings" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-600">Nombre</label>
              <input
                type="text"
                name="name"
                defaultValue={tournament.name}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Sede</label>
              <input
                type="text"
                name="venue"
                defaultValue={tournament.venue}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Corte de playoffs</label>
              <input
                type="number"
                name="playoffCutoff"
                defaultValue={tournament.playoffCutoff}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="hasGroupPhase"
                  value="true"
                  defaultChecked={tournament.hasGroupPhase}
                />
                <span className="text-sm text-gray-600">Fase de grupos (playoffs)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="thirdPlaceEnabled"
                  value="true"
                  defaultChecked={tournament.thirdPlaceEnabled}
                />
                <span className="text-sm text-gray-600">Partido 3er puesto</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Guardar cambios
          </button>
        </Form>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Organizadores</h2>
        <ul className="mb-4 space-y-2">
          {tournament.organizers.map((org) => (
            <li key={org.id} className="flex items-center justify-between text-sm">
              <span>{org.name}</span>
              <span className="text-gray-500">{org.role}</span>
            </li>
          ))}
        </ul>
        <Form method="post" className="flex flex-wrap gap-4">
          <input type="hidden" name="intent" value="add-organizer" />
          <input type="text" name="name" placeholder="Nombre" required className="rounded border px-3 py-2" />
          <input type="text" name="role" placeholder="Rol" required className="rounded border px-3 py-2" />
          <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Añadir
          </button>
        </Form>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Patrocinadores</h2>
        <ul className="mb-4 space-y-2">
          {tournament.sponsors.map((sp) => (
            <li key={sp.id} className="text-sm">
              <span className="font-medium">{sp.name}</span>
              {sp.description && <span className="ml-2 text-gray-500">{sp.description}</span>}
            </li>
          ))}
        </ul>
        <Form method="post" className="flex flex-wrap gap-4">
          <input type="hidden" name="intent" value="add-sponsor" />
          <input type="text" name="name" placeholder="Nombre" required className="rounded border px-3 py-2" />
          <input type="text" name="description" placeholder="Descripción" className="rounded border px-3 py-2" />
          <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Añadir
          </button>
        </Form>
      </div>
    </div>
  );
}
