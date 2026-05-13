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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Verify Code
        </h1>
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              type="text"
              name="code"
              id="code"
              required
              maxLength={6}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {actionData?.error && (
            <p className="text-sm text-red-600">{actionData.error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Verify
          </button>
        </Form>
      </div>
    </div>
  );
}
