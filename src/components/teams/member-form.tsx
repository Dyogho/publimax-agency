"use client";

import { useActionState } from "react";
import { createMember } from "@/app/actions/teams";
import { type MemberInput } from "@/lib/validations/team";

interface MemberFormProps {
  onSuccess?: () => void;
}

type FormState = {
  success?: boolean;
  error?: string | Record<string, string[]>;
} | null;

export function MemberForm({ onSuccess }: MemberFormProps) {
  async function handleSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
    const data: MemberInput = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      systemRole: formData.get("systemRole") as "ADMIN" | "CREATIVE",
    };

    const result = await createMember(data);

    if ("success" in result && result.success) {
      onSuccess?.();
      return { success: true, error: undefined };
    }

    const error = "error" in result ? result.error : "Unknown error";
    return { success: false, error: error as string | Record<string, string[]> };
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);
  const errors = typeof state?.error === "object" ? state.error : null;

  return (
    <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
        <input
          name="name"
          required
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
          placeholder="Juan Pérez"
        />
        {errors?.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
        <input
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
          placeholder="juan@publimax.com"
        />
        {errors?.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">System Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
          placeholder="••••••"
        />
        {errors?.password && <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Specialized Role</label>
        <select
          name="role"
          required
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
        >
          <option value="">Select job role</option>
          <option value="Designer">Designer</option>
          <option value="Video Editor">Video Editor</option>
          <option value="Copywriter">Copywriter</option>
          <option value="Creative Director">Creative Director</option>
          <option value="Social Media Manager">Social Media Manager</option>
        </select>
        {errors?.role && <p className="text-xs text-red-500 mt-1">{errors.role[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">System Permission</label>
        <select
          name="systemRole"
          required
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
        >
          <option value="CREATIVE">Creative (Calendar Access)</option>
          <option value="ADMIN">Admin (Full Dashboard)</option>
        </select>
        {errors?.systemRole && <p className="text-xs text-red-500 mt-1">{errors.systemRole[0]}</p>}
      </div>

      <div className="md:col-span-2 mt-2">
        <button
          disabled={isPending}
          className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all text-sm"
        >
          {isPending ? "Adding Member..." : "Create Member Profile"}
        </button>
      </div>
    </form>
  );
}
