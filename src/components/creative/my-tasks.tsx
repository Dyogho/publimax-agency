"use client";

import { useState, useTransition } from "react";
import { type Deliverable, type Campaign } from "@prisma/client";
import { updateDeliverableStatus, submitDeliverable } from "@/app/actions/deliverables";

type TaskWithCampaign = Deliverable & { campaign: Campaign };

interface MyTasksProps {
  tasks: TaskWithCampaign[];
}

export function MyTasks({ tasks }: MyTasksProps) {
  const [isPending, startTransition] = useTransition();
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  async function handleStatusToggle(task: TaskWithCampaign) {
    if (task.status === "APPROVED") return;
    
    // If pending, show submission input instead of immediate toggle
    if (task.status === "PENDING") {
      setSubmittingTaskId(task.id);
      return;
    }

    startTransition(async () => {
      await updateDeliverableStatus(task.id, "PENDING");
    });
  }

  async function handleConfirmSubmit(taskId: string) {
    if (!url) return;
    
    startTransition(async () => {
      const result = await submitDeliverable(taskId, url);
      if (result.success) {
        setSubmittingTaskId(null);
        setUrl("");
      } else {
        alert(result.error);
      }
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
    <div className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">Mis Tareas Asignadas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length === 0 ? (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <p className="text-zinc-500 italic">No tienes tareas asignadas por el momento.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className="p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${statusColors[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{task.type}</span>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold leading-tight">{task.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{task.description || "Sin descripción."}</p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.campaign.color || '#3b82f6' }} />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter truncate">
                    {task.campaign.name}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 mt-auto space-y-3">
                {submittingTaskId === task.id ? (
                  <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                    <input 
                      autoFocus
                      type="url" 
                      placeholder="Pega el link de entrega..." 
                      className="w-full px-3 py-2 text-xs border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none focus:ring-2 focus:ring-black"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button 
                        disabled={isPending}
                        onClick={() => handleConfirmSubmit(task.id)}
                        className="flex-1 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-bold"
                      >
                        {isPending ? "..." : "Confirmar"}
                      </button>
                      <button 
                        disabled={isPending}
                        onClick={() => setSubmittingTaskId(null)}
                        className="px-3 py-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded-lg text-[10px] font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : task.status !== "APPROVED" ? (
                  <button
                    disabled={isPending}
                    onClick={() => handleStatusToggle(task)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      task.status === "PENDING"
                        ? "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
                        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                    }`}
                  >
                    {isPending ? "..." : task.status === "PENDING" ? "Enviar a Revisión" : "Revertir a Pendiente"}
                  </button>
                ) : (
                  <div className="w-full py-2 text-center text-[10px] font-bold text-green-600 uppercase">
                    ✓ Tarea Completada
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
