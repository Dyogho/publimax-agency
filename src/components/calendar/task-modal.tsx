"use client";

import type { CalendarTask } from "@/lib/types/calendar";

interface TaskModalProps {
  task: CalendarTask | null;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: task.campaignColor || '#3b82f6' }} 
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Tarea del Entregable
              </span>
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-zinc-50">{task.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto text-black dark:text-white">
          {/* Status & Dates */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-400 uppercase">Estado</p>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                {task.status}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-400 uppercase">Equipos Asignados</p>
              <div className="flex flex-wrap gap-2">
                {task.teams?.map((team) => (
                  <span key={team.id} className="text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                    {team.name}
                  </span>
                ))}
                {(!task.teams || task.teams.length === 0) && (
                  <span className="text-xs text-zinc-500 italic">Sin equipos asignados</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-zinc-400 uppercase">Descripción</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              {task.description || "Sin descripción proporcionada para esta tarea."}
            </p>
          </div>

          {/* File Collaboration Placeholder */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold text-zinc-400 uppercase">Archivos y Entregas</p>
              <button className="text-[10px] font-bold text-blue-600 hover:underline">Ver todo</button>
            </div>
            
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center space-y-3 bg-zinc-50/30 dark:bg-zinc-950/20">
              <div className="w-12 h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-xl">⬆️</span>
              </div>
              <div>
                <p className="text-sm font-bold text-black dark:text-white">Subir archivos finales</p>
                <p className="text-xs text-zinc-500 mt-1">Arrastra tus archivos aquí o haz clic para buscarlos.</p>
              </div>
              <button className="mt-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">
                Seleccionar Archivo
              </button>
            </div>

            {/* List of files (empty placeholder) */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl opacity-50 grayscale">
                <span className="text-lg">📄</span>
                <div className="flex-1">
                  <p className="text-xs font-bold text-zinc-400">referencia_creativa.pdf</p>
                  <p className="text-[10px] text-zinc-500">2.4 MB • Subido por Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Cerrar
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            Marcar como Completada
          </button>
        </div>
      </div>
    </div>
  );
}
