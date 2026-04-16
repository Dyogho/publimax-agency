"use client";

import { useActionState } from "react";
import { createTeam, updateTeam } from "@/app/actions/teams";
import { type TeamInput } from "@/lib/validations/team";
import { type Team } from "@prisma/client";

interface TeamFormProps {
  team?: Team;
  onSuccess?: () => void;
}

export function TeamForm({ team, onSuccess }: TeamFormProps) {
  const isEditing = !!team;

  async function handleSubmit(prevState: any, formData: FormData) {
    const data: TeamInput = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    const result = isEditing 
      ? await updateTeam(team.id, data) 
      : await createTeam(data);

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
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Team Name</label>
        <input
          name="name"
          defaultValue={team?.name}
          required
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm"
          placeholder="Branding Team, Video Unit..."
        />
        {errors?.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
        <textarea
          name="description"
          defaultValue={team?.description || ""}
          rows={3}
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm resize-none"
          placeholder="What this team does..."
        />
      </div>

      <button
        disabled={isPending}
        className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all text-sm"
      >
        {isPending ? "Saving..." : isEditing ? "Update Team" : "Create Team"}
      </button>
    </form>
  );
}
