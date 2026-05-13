import { useLocation, Link } from "react-router";
import { data } from "react-router";

export async function loader() {
  return data({}, { status: 404 });
}

export default function NotFoundPage() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="max-w-md rounded-2xl border border-default bg-surface p-8 text-center">
        <h1 className="text-6xl font-bold text-accent">404</h1>
        <p className="mt-4 text-xl font-semibold text-primary">Página no encontrada</p>
        <p className="mt-2 text-sm text-secondary">
          La página <code className="text-accent">{location.pathname}</code> no existe.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-accent px-4 py-2.5 font-medium text-slate-950 hover:bg-accent-600"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
