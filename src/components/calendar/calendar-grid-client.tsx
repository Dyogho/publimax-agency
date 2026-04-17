"use client";

import { useState } from "react";
import { TaskModal } from "./task-modal";

interface CalendarGridClientProps {
  days: any[];
  now: { day: number; month: number; year: number };
  monthName: string;
  year: number;
}

export function CalendarGridClient({ days, now, monthName, year }: CalendarGridClientProps) {
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-black">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-zinc-50">
            {monthName} {year}
          </h1>
          <p className="text-sm text-zinc-500">Cronograma de campañas y tareas por equipo</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            Hoy
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-4 bg-zinc-50/30 dark:bg-zinc-950/20">
        <div className="grid grid-cols-7 border-t border-l border-zinc-100 dark:border-zinc-900 rounded-lg overflow-hidden">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dayName => (
            <div key={dayName} className="p-3 text-center text-xs font-bold text-zinc-400 border-b border-r border-zinc-100 dark:border-zinc-900 uppercase tracking-wider bg-white dark:bg-zinc-900/50">
              {dayName}
            </div>
          ))}
          
          {days.map((item, i) => {
            const primaryCampaign = item.campaigns[0];
            const shadingStyle = primaryCampaign?.color 
              ? { backgroundColor: `${primaryCampaign.color}15` } 
              : {};

            return (
              <div 
                key={i} 
                style={shadingStyle}
                className={`min-h-[140px] p-2 border-b border-r border-zinc-100 dark:border-zinc-900 relative group transition-colors ${!item.day ? 'bg-zinc-50/50 dark:bg-zinc-900/10' : 'hover:bg-zinc-50/50 dark:hover:bg-white/5'}`}
              >
                {item.day && (
                  <>
                    <span className={`text-xs font-medium ${
                      now.day === item.day ? 'flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full' : 'text-zinc-400'
                    }`}>
                      {item.day}
                    </span>
                    <div className="mt-2 space-y-1.5">
                      {item.tasks.map((task: any) => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className="w-full text-left p-1.5 rounded text-[10px] font-bold truncate shadow-sm border border-black/5 hover:scale-[1.02] active:scale-95 transition-all text-white"
                          style={{ backgroundColor: task.campaignColor || '#3b82f6' }}
                          title={`${task.title} (${task.status})`}
                        >
                          {task.title}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </div>
  );
}
