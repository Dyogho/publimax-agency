"use client";

import { type Campaign, type Deliverable, type Team, DeliverableStatus } from "@prisma/client";
import { useState, useTransition } from "react";
import { DeliverableForm } from "./deliverable-form";
import { deleteDeliverable, updateDeliverableStatus } from "@/app/actions/deliverables";

type DeliverableWithTeams = Deliverable & { teams: Team[] };

interface DeliverableManagerProps {
  campaign: Campaign & { deliverables: DeliverableWithTeams[]; teams: Team[] };
}

export function DeliverableManager({ campaign }: DeliverableManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [, startTransition] = useTransition();

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este entregable?")) return;
    startTransition(async () => {
      await deleteDeliverable(id);
    });
  }

  async function handleStatusChange(id: string, status: DeliverableStatus) {
    startTransition(async () => {
      await updateDeliverableStatus(id, status);
    });
  }

  const statusLabels = {
    PENDING: "Pendiente",
    REVIEW: "En Revisión",
    APPROVED: "Aprobado",
  };

  const statusColors = {
    PENDING: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400",
    REVIEW: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Lista de Tareas</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] font-bold px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          {showForm ? "Cancelar" : "+ Nueva Tarea"}
        </button>
      </div>

      {showForm && (
        <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 animate-in slide-in-from-top-2 duration-200">
          <DeliverableForm 
            campaignId={campaign.id} 
            campaignTeams={campaign.teams} 
            onSuccess={() => setShowForm(false)} 
          />
        </div>
      )}

      <div className="space-y-3">
        {campaign.deliverables.length === 0 ? (
          <p className="text-sm text-zinc-500 italic text-center py-8">No hay tareas creadas para esta campaña.</p>
        ) : (
          campaign.deliverables.map(d => (
            <div key={d.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${statusColors[d.status]}`}>
                    {statusLabels[d.status]}
                  </span>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">{d.type}</span>
                </div>
                <h4 className="text-sm font-bold">{d.title}</h4>
                <div className="flex flex-wrap gap-1">
                  {d.teams.map(t => (
                    <span key={t.id} className="text-[9px] bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md font-medium">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {d.deliveryUrl && (
                  <a 
                    href={d.deliveryUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    <span>🔗</span> Ver Entrega
                  </a>
                )}
                {d.status === "REVIEW" && (
                  <button 
                    onClick={() => handleStatusChange(d.id, "APPROVED")}
                    className="px-3 py-1.5 bg-green-600 text-white text-[10px] font-bold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Aprobar
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(d.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
