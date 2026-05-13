import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getAuthUser } from "../utils/auth.server";
import { prisma } from "../infrastructure/database/client";
import { BottomNav } from "../components/ui/BottomNav";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getAuthUser(request);
  const tournament = await prisma.tournament.findFirst({
    include: { organizers: true, sponsors: true },
  });
  return json({ user, tournament });
}

export default function PublicLayout() {
  const { user, tournament } = useLoaderData<typeof loader>();
  const location = useLocation();

  const navLinks = [
    { to: "/standings", label: "Tabla" },
    { to: "/schedule", label: "Calendario" },
    { to: "/teams", label: "Equipos" },
  ];

  return (
    <div className="min-h-screen bg-base">
      <nav className="sticky top-0 z-40 hidden border-b border-default bg-surface md:block">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-primary">
              K108 Torneo
            </Link>
            <div className="flex gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-accent"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <form method="post" action="/logout">
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:text-primary"
                >
                  Cerrar sesión
                </button>
              </form>
            ) : (
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:text-primary"
              >
                Iniciar sesión
              </Link>
            )}
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="rounded-lg px-3 py-2 text-sm font-medium text-accent hover:text-accent-300"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8 pb-20 md:pb-8">
        {tournament && (
          <div className="mb-6 rounded-xl border border-default bg-surface p-4">
            <h1 className="text-2xl font-bold text-primary">{tournament.name}</h1>
            <p className="text-secondary">{tournament.venue}</p>
          </div>
        )}
        <Outlet />
      </main>
      <BottomNav
        isAuthenticated={!!user}
        isAdmin={user?.isAdmin ?? false}
      />
    </div>
  );
}
