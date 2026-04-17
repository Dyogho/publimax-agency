"use client";

import { useActionState } from "react";
import { createCampaign, updateCampaign } from "@/app/actions/campaigns";
import { type CampaignInput } from "@/lib/validations/campaign";
import { type Campaign, type Client, CampaignStatus } from "@prisma/client";

interface CampaignFormProps {
  clients: Client[];
  campaign?: Campaign;
  onSuccess?: () => void;
}

type FormState = {
  success?: boolean;
  error?: string | Record<string, string[]>;
} | null;

export function CampaignForm({ clients, campaign, onSuccess }: CampaignFormProps) {
  const isEditing = !!campaign;

  async function handleSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
    const data: CampaignInput = {
      name: formData.get("name") as string,
      budget: Number(formData.get("budget")),
      adsType: formData.get("adsType") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      clientId: formData.get("clientId") as string,
      status: (formData.get("status") as CampaignStatus) || CampaignStatus.PLANNING,
      color: formData.get("color") as string,
    };

    const result = isEditing 
      ? await updateCampaign(campaign.id, data) 
      : await createCampaign(data);

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
        {errors?.clientId && <p className="mt-1 text-xs text-red-500">{errors.clientId[0]}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Campaign Name</label>
        <input name="name" defaultValue={campaign?.name} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all" placeholder="Summer 2024 Campaign..." />
        {errors?.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Ads Type</label>
          <input name="adsType" defaultValue={campaign?.adsType} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all" placeholder="Meta Ads, Google Ads..." />
          {errors?.adsType && <p className="mt-1 text-xs text-red-500">{errors.adsType[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Budget ($)</label>
          <input name="budget" type="number" defaultValue={campaign?.budget} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all" placeholder="0.00" />
          {errors?.budget && <p className="mt-1 text-xs text-red-500">{errors.budget[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Start Date</label>
          <input name="startDate" type="date" defaultValue={campaign?.startDate?.toISOString().split('T')[0]} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all" />
          {errors?.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate[0]}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">End Date</label>
          <input name="endDate" type="date" defaultValue={campaign?.endDate?.toISOString().split('T')[0]} required className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white transition-all" />
          {errors?.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate[0]}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Campaign Color</label>
        <div className="flex items-center gap-3">
          <input 
            name="color" 
            type="color" 
            defaultValue={campaign?.color || "#3b82f6"} 
            className="w-12 h-12 bg-transparent border-0 rounded-lg cursor-pointer" 
          />
          <span className="text-xs text-zinc-500">Pick a color for the calendar timeline</span>
        </div>
      </div>

      <button disabled={isPending} className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm shadow-lg shadow-black/10 dark:shadow-white/5">
        {isPending ? "Processing..." : isEditing ? "Update Campaign" : "Create Campaign"}
      </button>
    </form>
  );
}
