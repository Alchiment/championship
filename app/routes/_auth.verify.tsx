import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import { whatsAppService } from "../infrastructure/auth/whatsapp.service";
import { authService } from "../infrastructure/auth/auth.service";
import { prisma } from "../infrastructure/database/client";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber") as string;
  const code = formData.get("code") as string;

  if (!code || code.length !== 6) {
    return json({ error: "Invalid verification code" }, { status: 400 });
  }

  const valid = whatsAppService.validateCode(phoneNumber, code);
  if (!valid) {
    return json({ error: "Invalid or expired code" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { phoneNumber } });
  const { cookie } = await authService.createSession({
    phoneNumber,
    isAdmin: user?.isAdmin || false,
  });

  return redirect(user?.isAdmin ? "/admin" : "/", {
    headers: { "Set-Cookie": cookie },
  });
}

export default function Verify() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="w-full max-w-md rounded-2xl border border-default bg-surface p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-primary">
          Verify Code
        </h1>
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-secondary">
              Verification Code
            </label>
            <input
              type="text"
              name="code"
              id="code"
              required
              maxLength={6}
              className="mt-1 block w-full rounded-lg border border-default bg-inset px-3 py-2 text-primary placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent/50"
            />
          </div>
          {actionData?.error && (
            <p className="text-sm text-red-400">{actionData.error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-slate-950 hover:bg-accent-600"
          >
            Verify
          </button>
        </Form>
      </div>
    </div>
  );
}
