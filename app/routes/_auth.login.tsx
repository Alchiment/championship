import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { whatsAppService } from "../infrastructure/auth/whatsapp.service";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber") as string;

  if (!phoneNumber || !/^\+?\d{7,15}$/.test(phoneNumber)) {
    return json({ error: "Please enter a valid phone number" }, { status: 400 });
  }

  const code = whatsAppService.generateCode();
  whatsAppService.storeCode(phoneNumber, code);
  await whatsAppService.sendVerificationCode(phoneNumber, code);

  return json({ success: true, phoneNumber });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (actionData?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Código de verificación
          </h1>
          <p className="mb-4 text-center text-gray-600">
            Hemos enviado un código a {actionData.phoneNumber}
          </p>
          <form method="post" action="/verify" className="space-y-4">
            <input type="hidden" name="phoneNumber" value={actionData.phoneNumber} />
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Código de verificación
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
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Verificar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Iniciar Sesión
        </h1>
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Número de teléfono
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              required
              placeholder="+573001234567"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          {actionData?.error && (
            <p className="text-sm text-red-600">{actionData.error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar código"}
          </button>
        </Form>
      </div>
    </div>
  );
}
