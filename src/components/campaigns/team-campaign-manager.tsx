"use client";

import { useState, useTransition } from "react";
import { type Team } from "@prisma/client";
import { assignTeamsToCampaign } from "@/app/actions/campaigns";

interface TeamCampaignManagerProps {
  campaignId: string;
  allTeams: Team[];
  initialSelectedTeamIds: string[];
}

export function TeamCampaignManager({ campaignId, allTeams, initialSelectedTeamIds }: TeamCampaignManagerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedTeamIds);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  function toggleTeam(teamId: string) {
    setSelectedIds(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId) 
        : [...prev, teamId]
    );
  }

  async function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await assignTeamsToCampaign(campaignId, selectedIds);
      if (result.success) {
        setMessage({ type: 'success', text: 'Equipos actualizados correctamente.' });
      } else {
        setMessage({ type: 'error', text: 'Error al actualizar equipos.' });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {allTeams.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">No hay equipos disponibles para asignar.</p>
        ) : (
          allTeams.map(team => (
            <label 
              key={team.id} 
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                selectedIds.includes(team.id) 
                  ? 'border-black bg-zinc-50 dark:border-white dark:bg-white/5' 
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-bold">{team.name}</span>
                {team.description && <span className="text-xs text-zinc-500">{team.description}</span>}
              </div>
              <input 
                type="checkbox" 
                checked={selectedIds.includes(team.id)} 
                onChange={() => toggleTeam(team.id)}
                className="w-5 h-5 accent-black dark:accent-white"
              />
            </label>
          ))
        )}
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-xs font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'
        }`}>
          {message.text}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm shadow-lg shadow-black/10 dark:shadow-white/5"
      >
        {isPending ? "Guardando..." : "Guardar Cambios"}
      </button>
    </div>
  );
}
