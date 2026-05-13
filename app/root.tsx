import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import type { LinksFunction } from "react-router";
import styles from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="rounded-2xl border border-default bg-surface p-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-accent">
            {error.status}
          </h1>
          <p className="text-secondary">{error.statusText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="rounded-2xl border border-default bg-surface p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-400">
          Something went wrong
        </h1>
        <p className="text-secondary">Please try again later.</p>
      </div>
    </div>
  );
}
