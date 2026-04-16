export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Header del Calendario */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-black dark:text-white">Calendario de Entregables</h1>
          <p className="text-sm text-zinc-500">Visualización de campañas y fechas límite</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            Hoy
          </button>
          <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-lg p-1">
            <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-black rounded-md shadow-sm">Mes</button>
            <button className="px-3 py-1 text-xs font-medium text-zinc-500">Semana</button>
          </div>
        </div>
      </div>

      {/* Grid del Calendario (Placeholder) */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-7 border-t border-l border-zinc-100 dark:border-zinc-900">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-xs font-bold text-zinc-400 border-b border-r border-zinc-100 dark:border-zinc-900 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/20">
              {day}
            </div>
          ))}
          
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-[120px] p-2 border-b border-r border-zinc-100 dark:border-zinc-900 relative group hover:bg-zinc-50/30 dark:hover:bg-white/5 transition-colors">
              <span className="text-xs text-zinc-400">{(i % 31) + 1}</span>
              {i === 12 && (
                <div className="mt-1 p-1 bg-black dark:bg-white text-white dark:text-black rounded text-[10px] font-bold truncate">
                  Campaña Nike: Banners
                </div>
              )}
              {i === 15 && (
                <div className="mt-1 p-1 bg-blue-500 text-white rounded text-[10px] font-bold truncate">
                  Review Coca-Cola Copy
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
