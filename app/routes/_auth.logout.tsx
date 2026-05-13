import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
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
