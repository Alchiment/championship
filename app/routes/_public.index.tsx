import { Navigate } from "@remix-run/react";

export default function HomePage() {
  return <Navigate to="/standings" replace />;
}
