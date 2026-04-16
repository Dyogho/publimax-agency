"use client";

import { useActionState } from "react";
import { createClient, updateClient } from "@/app/actions/clients";
import { type ClientInput } from "@/lib/validations/client";
import { type Client } from "@prisma/client";

interface ClientFormProps {
  client?: Client;
  onSuccess?: () => void;
}

type FormState = {
  success?: boolean;
  error?: string | Record<string, string[]>;
} | null;

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const isEditing = !!client;

  async function handleSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
    const data: ClientInput = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    const result = isEditing 
      ? await updateClient(client.id, data) 
      : await createClient(data);

    if ("success" in result && result.success) {
      onSuccess?.();
      return { success: true, error: undefined };
    }

    const error = "error" in result ? result.error : "Unknown error";
    return { success: false, error: error as string | Record<string, string[]> };
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  const errors = typeof state?.error === "object" ? state.error : null;
  const generalError = typeof state?.error === "string" ? state.error : null;

  return (
    <form action={formAction} className="space-y-5">
      {generalError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {generalError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Name</label>
        <input
          name="name"
          defaultValue={client?.name}
          required
          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none text-sm"
          placeholder="Client or Company Name"
        />
        {errors?.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={client?.email}
          required
          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none text-sm"
          placeholder="contact@email.com"
        />
        {errors?.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Phone</label>
          <input
            name="phone"
            defaultValue={client?.phone || ""}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none text-sm"
            placeholder="+1 ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Address</label>
          <input
            name="address"
            defaultValue={client?.address || ""}
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none text-sm"
            placeholder="Street, City ..."
          />
        </div>
      </div>

      <button
        disabled={isPending}
        className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 text-sm shadow-lg shadow-black/10 dark:shadow-white/5"
      >
        {isPending ? "Saving..." : isEditing ? "Update Client" : "Create Client"}
      </button>
    </form>
  );
}
