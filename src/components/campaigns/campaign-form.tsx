"use client";

import { useActionState } from "react";
import { createCampaign, updateCampaign } from "@/app/actions/campaigns";
import { type CampaignInput } from "@/lib/validations/campaign";
import { type Campaign, type Client, type Team, CampaignStatus } from "@prisma/client";

interface CampaignFormProps {
  clients: Client[];
  teams: Team[];
  campaign?: Campaign & { teams: Team[] };
  onSuccess?: () => void;
}

type FormState = {
  success?: boolean;
  error?: string | Record<string, string[]>;
} | null;

export function CampaignForm({ clients, teams, campaign, onSuccess }: CampaignFormProps) {
  const isEditing = !!campaign;

  async function handleSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
    const selectedTeams = formData.getAll("teams") as string[];

    const data: CampaignInput & { teamIds: string[] } = {
      name: formData.get("name") as string,
      budget: Number(formData.get("budget")),
      adsType: formData.get("adsType") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      clientId: formData.get("clientId") as string,
      status: formData.get("status") as CampaignStatus,
      teamIds: selectedTeams,
    };

    const result = isEditing 
      ? await updateCampaign(campaign.id, data) 
      : await createCampaign(data);

    if (result.success) {
      onSuccess?.();
      return { success: true, error: undefined };
    }

    return { success: false, error: result.error as string | Record<string, string[]> };
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
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Client</label>
        <select
          name="clientId"
          defaultValue={campaign?.clientId}
          required
          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm"
        >
          <option value="">Select a client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Campaign Name</label>
        <input name="name" defaultValue={campaign?.name} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Ads Type</label>
          <input name="adsType" defaultValue={campaign?.adsType} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Budget ($)</label>
          <input name="budget" type="number" defaultValue={campaign?.budget} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Start Date</label>
          <input name="startDate" type="date" defaultValue={campaign?.startDate?.toISOString().split('T')[0]} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">End Date</label>
          <input name="endDate" type="date" defaultValue={campaign?.endDate?.toISOString().split('T')[0]} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Assign Teams</label>
        <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl max-h-32 overflow-y-auto">
          {teams.map(team => (
            <label key={team.id} className="flex items-center gap-2 text-xs cursor-pointer">
              <input 
                type="checkbox" 
                name="teams" 
                value={team.id} 
                defaultChecked={campaign?.teams.some(t => t.id === team.id)}
                className="rounded border-zinc-300" 
              />
              {team.name}
            </label>
          ))}
        </div>
      </div>

      <button disabled={isPending} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm">
        {isPending ? "Saving..." : isEditing ? "Update Campaign" : "Create Campaign"}
      </button>
    </form>
  );
}
