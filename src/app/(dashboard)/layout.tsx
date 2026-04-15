import { type ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* Sidebar Placeholder */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hidden md:flex flex-col">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-black dark:text-zinc-50">PubliMax</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-2 text-sm font-medium text-zinc-950 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            Dashboard
          </div>
          <div className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
            Campaigns
          </div>
          <div className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
            Clients
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex items-center px-8">
          <div className="flex-1" />
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
