import prisma from "@/lib/prisma";
import { SystemRole } from "@prisma/client";

interface CalendarGridProps {
  role: SystemRole;
  userId?: string;
}

export async function CalendarGrid({ role, userId }: CalendarGridProps) {
  'use cache';
  
  // 1. Get current month context
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // First day of the month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  
  // Last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const totalDaysInMonth = lastDayOfMonth.getDate();
  
  // Month name
  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(now);
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // 2. Fetch events from database
  // We'll fetch campaigns that overlap with this month
  const startDateThreshold = new Date(year, month, 1);
  const endDateThreshold = new Date(year, month + 1, 0);

  const campaigns = await prisma.campaign.findMany({
    where: {
      OR: [
        { startDate: { gte: startDateThreshold, lte: endDateThreshold } },
        { endDate: { gte: startDateThreshold, lte: endDateThreshold } },
        { 
          AND: [
            { startDate: { lte: startDateThreshold } },
            { endDate: { gte: endDateThreshold } }
          ]
        }
      ]
    },
    select: {
      id: true,
      name: true,
      startDate: true,
      endDate: true,
      status: true
    }
  });

  // 3. Generate grid cells (usually 35 or 42 cells to cover the full week spans)
  const days = [];
  
  // Fill leading empty days from previous month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ day: null, events: [] });
  }
  
  // Fill actual days of the month
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const currentDate = new Date(year, month, d);
    
    // Find campaigns for this specific day
    const dayEvents = campaigns.filter(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      // Simple overlap check: event starts on or before today AND ends on or after today
      return start.setHours(0,0,0,0) <= currentDate.setHours(0,0,0,0) && 
             end.setHours(23,59,59,999) >= currentDate.setHours(0,0,0,0);
    });

    days.push({
      day: d,
      events: dayEvents.map(e => ({
        id: e.id,
        title: e.name,
        color: e.status === 'ACTIVE' ? 'bg-green-500' : 'bg-zinc-800'
      }))
    });
  }

  // Fill trailing empty days to complete the last week
  while (days.length % 7 !== 0) {
    days.push({ day: null, events: [] });
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-black">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white">
            {capitalizedMonth} {year}
          </h1>
          <p className="text-sm text-zinc-500">Visualización de campañas y entregables</p>
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
          
          {days.map((item, i) => (
            <div 
              key={i} 
              className={`min-h-[120px] p-2 border-b border-r border-zinc-100 dark:border-zinc-900 relative group transition-colors bg-white dark:bg-black ${!item.day ? 'bg-zinc-50/50 dark:bg-zinc-900/10' : 'hover:bg-zinc-50 dark:hover:bg-white/5'}`}
            >
              {item.day && (
                <>
                  <span className={`text-xs font-medium ${
                    now.getDate() === item.day ? 'flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full' : 'text-zinc-400'
                  }`}>
                    {item.day}
                  </span>
                  <div className="mt-2 space-y-1">
                    {item.events.map(event => (
                      <div 
                        key={event.id} 
                        className={`p-1.5 ${event.color} text-white rounded text-[10px] font-bold truncate shadow-sm`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
