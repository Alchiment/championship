import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireAdmin } from "../utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  return json({});
}

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <div className="p-4">
            <Link to="/admin" className="text-xl font-bold text-gray-800">
              Admin
            </Link>
          </div>
          <nav className="space-y-1 px-4">
            <Link to="/admin" className="block rounded px-3 py-2 text-gray-700 hover:bg-gray-100">
              Dashboard
            </Link>
            <Link to="/admin/matches" className="block rounded px-3 py-2 text-gray-700 hover:bg-gray-100">
              Partidos
            </Link>
            <Link to="/admin/teams" className="block rounded px-3 py-2 text-gray-700 hover:bg-gray-100">
              Equipos
            </Link>
            <Link to="/admin/settings" className="block rounded px-3 py-2 text-gray-700 hover:bg-gray-100">
              Configuración
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
