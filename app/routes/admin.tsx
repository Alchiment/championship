import { Link, Outlet, useLocation } from "react-router";
import { data, redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireAdmin } from "../utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const url = new URL(request.url);
  if (url.pathname === "/admin") return redirect("/admin/teams");
  return data({});
}

export default function AdminLayout() {
  const location = useLocation();

  const navLinks = [
    { to: "/admin/teams", label: "Equipos" },
    { to: "/admin/matches", label: "Partidos" },
    { to: "/admin/standings", label: "Tabla" },
    { to: "/admin/settings", label: "Configuración" },
  ];

  return (
    <div className="min-h-screen bg-base">
      <div className="flex">
        <aside className="hidden w-64 border-r border-default bg-surface md:block">
          <div className="p-4">
            <Link to="/admin/teams" className="text-xl font-bold text-primary">
              Admin
            </Link>
          </div>
          <nav className="space-y-1 px-4">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-elevated/50 text-accent"
                      : "text-secondary hover:bg-elevated hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="my-2 border-t border-default" />
            <a
              href="/standings"
              className="block rounded-lg px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-elevated hover:text-primary"
            >
              ← Sitio público
            </a>
            <form method="post" action="/logout">
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-secondary transition-colors hover:bg-elevated hover:text-primary"
              >
                Cerrar sesión
              </button>
            </form>
          </nav>
        </aside>
        <main className="flex-1">
          <nav className="flex border-b border-default bg-surface md:hidden">
            <div className="flex overflow-x-auto">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-b-2 border-accent text-accent"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="my-auto border-l border-default" />
            <a
              href="/standings"
              className="whitespace-nowrap px-4 py-3 text-sm font-medium text-secondary transition-colors hover:text-primary"
            >
              ← Público
            </a>
            <form method="post" action="/logout">
              <button
                type="submit"
                className="whitespace-nowrap px-4 py-3 text-sm font-medium text-secondary transition-colors hover:text-primary"
              >
                Cerrar sesión
              </button>
            </form>
          </nav>
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
