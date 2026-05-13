import { Form, useActionData, useNavigation } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { data } from "react-router";
import { whatsAppService } from "../infrastructure/auth/whatsapp.service";

const PHONE_PREFIX = "+57";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const rawNumber = formData.get("phoneNumber") as string;

  if (!rawNumber || !/^\d{7,10}$/.test(rawNumber)) {
    return data({ error: "Ingresa un número de teléfono válido" }, { status: 400 });
  }

  const phoneNumber = `${PHONE_PREFIX}${rawNumber}`;

  const code = whatsAppService.generateCode();
  whatsAppService.storeCode(phoneNumber, code);
  await whatsAppService.sendVerificationCode(phoneNumber, code);

  return data({ success: true, phoneNumber });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (actionData && "success" in actionData && actionData.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <div className="w-full max-w-md rounded-2xl border border-default bg-surface p-8">
          <h1 className="mb-6 text-center text-2xl font-bold text-primary">
            Código de verificación
          </h1>
          <p className="mb-4 text-center text-secondary">
            Hemos enviado un código a {actionData.phoneNumber}
          </p>
          <form method="post" action="/verify" className="space-y-4">
            <input type="hidden" name="phoneNumber" value={actionData.phoneNumber} />
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-secondary">
                Código de verificación
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
            <button
              type="submit"
              className="w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-slate-950 hover:bg-accent-600"
            >
              Verificar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <div className="w-full max-w-md rounded-2xl border border-default bg-surface p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-primary">
          Iniciar Sesión
        </h1>
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-secondary">
              Número de teléfono
            </label>
            <div className="mt-1 flex rounded-lg border border-default bg-inset focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/50">
              <span className="inline-flex items-center rounded-l-lg border-r border-default bg-surface px-3 text-sm font-medium text-muted">
                +57
              </span>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                required
                placeholder="3001234567"
                className="w-full rounded-r-lg bg-transparent px-3 py-2 text-primary placeholder:text-muted focus:outline-none"
              />
            </div>
          </div>
          {actionData && "error" in actionData && (
            <p className="text-sm text-red-400">{actionData.error}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-accent px-4 py-2.5 font-medium text-slate-950 hover:bg-accent-600 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Enviar código"}
          </button>
        </Form>
      </div>
    </div>
  );
}
