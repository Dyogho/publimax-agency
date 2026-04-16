"use client";

import { useActionState } from "react";
import { createMember } from "@/app/actions/teams";
import { type MemberInput } from "@/lib/validations/team";

interface MemberFormProps {
  onSuccess?: () => void;
}

export function MemberForm({ onSuccess }: MemberFormProps) {
  async function handleSubmit(prevState: any, formData: FormData) {
    const data: MemberInput = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
    };

    const result = await createMember(data);

    if (result.success) {
      onSuccess?.();
      return { success: true, error: null };
    }

    return { success: false, error: result.error };
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);
  const errors = typeof state?.error === "object" ? state.error : null;

  return (
    <form action={formAction} className="space-y-4">
      <div>
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
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Specialized Role</label>
        <select
          name="role"
          required
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
        >
          <option value="">Select a role</option>
          <option value="Designer">Designer</option>
          <option value="Video Editor">Video Editor</option>
          <option value="Copywriter">Copywriter</option>
          <option value="Creative Director">Creative Director</option>
          <option value="Social Media Manager">Social Media Manager</option>
        </select>
        {errors?.role && <p className="text-xs text-red-500 mt-1">{errors.role[0]}</p>}
      </div>

      <button
        disabled={isPending}
        className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all text-sm"
      >
        {isPending ? "Adding..." : "Add to Directory"}
      </button>
    </form>
  );
}
