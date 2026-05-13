import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getAuthUser } from "../utils/auth.server";
import { prisma } from "../infrastructure/database/client";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getAuthUser(request);
  const tournament = await prisma.tournament.findFirst({
    include: { organizers: true, sponsors: true },
  });
  return json({ user, tournament });
}

export default function PublicLayout() {
  const { user, tournament } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-gray-800">
                K108 Torneo
              </Link>
              <div className="flex space-x-4">
                <Link to="/standings" className="text-gray-600 hover:text-gray-800">
                  Tabla
                </Link>
                <Link to="/schedule" className="text-gray-600 hover:text-gray-800">
                  Calendario
                </Link>
                <Link to="/teams" className="text-gray-600 hover:text-gray-800">
                  Equipos
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <form method="post" action="/logout">
                  <button type="submit" className="text-sm text-gray-600 hover:text-gray-800">
                    Cerrar sesión
                  </button>
                </form>
              ) : (
                <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800">
                  Iniciar sesión
                </Link>
              )}
              {user?.isAdmin && (
                <Link to="/admin" className="text-sm text-green-600 hover:text-green-800">
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8">
        {tournament && (
          <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <h1 className="text-2xl font-bold text-gray-800">{tournament.name}</h1>
            <p className="text-gray-600">{tournament.venue}</p>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
