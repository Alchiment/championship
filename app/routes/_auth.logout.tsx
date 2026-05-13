import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { authService } from "../infrastructure/auth/auth.service";

export async function loader({ request }: LoaderFunctionArgs) {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  const cookie = await authService.destroySession(request);
  return redirect("/", {
    headers: { "Set-Cookie": cookie },
  });
}
