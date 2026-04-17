import prisma from "@/lib/prisma";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
export default async function DashboardPage() {
  let isConnected = false;
  let clientCount = 0;
  let campaignCount = 0;
  try {
    // Verificación de conexión y acceso a modelos
    await prisma.$queryRaw`SELECT 1`;
    const [clients, campaigns] = await Promise.all([
      prisma.client.count(),
      prisma.campaign.count(),
    ]);
    clientCount = clients;
    campaignCount = campaigns;
    isConnected = true;
  } catch (e) {
    console.error("Database connection failed:", e);
  }

  return (
    <div className="space-y-6 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Resumen General</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Bienvenido al sistema de gestión PubliMax.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Base de Datos</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-black dark:text-white">
              {isConnected ? "Conectada" : "Error"}
            </span>
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          </div>
          <p className="text-xs text-zinc-400 mt-1">Prisma + Supabase PostgreSQL</p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Clientes Activos</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-black dark:text-white">{clientCount}</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Registrados en el sistema</p>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Campañas</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-black dark:text-white">{campaignCount}</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">En curso o planificación</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <CalendarGrid role="ADMIN" />
        </div>
      </div>
    </div>
  );
}
