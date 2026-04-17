"use client";

import { useActionState, useState } from "react";
import { createDeliverable } from "@/app/actions/deliverables";
import { type DeliverableInput } from "@/lib/validations/deliverable";
import { type Team, DeliverableType } from "@prisma/client";

interface DeliverableFormProps {
  campaignId: string;
  campaignTeams: Team[];
  onSuccess?: () => void;
}

type FormState = {
  success?: boolean;
  error?: string | Record<string, string[]>;
} | null;

export function DeliverableForm({ campaignId, campaignTeams, onSuccess }: DeliverableFormProps) {
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  async function handleSubmit(prevState: FormState, formData: FormData): Promise<FormState> {
    const data: DeliverableInput = {
      title: formData.get("title") as string,
      type: formData.get("type") as DeliverableType,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") ? new Date(formData.get("startDate") as string) : null,
      endDate: formData.get("endDate") ? new Date(formData.get("endDate") as string) : null,
      campaignId: campaignId,
      teamIds: selectedTeamIds,
    };

    const result = await createDeliverable(data);

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

  function toggleTeam(id: string) {
    setSelectedTeamIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {generalError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
          {generalError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Título del Entregable</label>
        <input 
          name="title" 
          required 
          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" 
          placeholder="Ej: 3 Banners para Facebook..." 
        />
        {errors?.title && <p className="mt-1 text-xs text-red-500">{errors.title[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Tipo</label>
          <select 
            name="type" 
            required 
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm"
          >
            <option value="BANNER">Banner</option>
            <option value="VIDEO">Video</option>
            <option value="COPY">Copywriter</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Fecha Entrega</label>
          <input 
            name="endDate" 
            type="date" 
            className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" 
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Instrucciones / Descripción</label>
        <textarea 
          name="description" 
          rows={3}
          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" 
          placeholder="Detalles sobre el formato, dimensiones, etc." 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Equipos Responsables</label>
        <div className="flex flex-wrap gap-2">
          {campaignTeams.map(team => (
            <button
              key={team.id}
              type="button"
              onClick={() => toggleTeam(team.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedTeamIds.includes(team.id)
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800'
              }`}
            >
              {team.name}
            </button>
          ))}
          {campaignTeams.length === 0 && (
            <p className="text-xs text-zinc-400 italic">No hay equipos vinculados a esta campaña.</p>
          )}
        </div>
        {errors?.teamIds && <p className="mt-1 text-xs text-red-500">{errors.teamIds[0]}</p>}
      </div>

      <button 
        disabled={isPending} 
        className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm shadow-lg"
      >
        {isPending ? "Creando..." : "Crear Tarea"}
      </button>
    </form>
  );
}
