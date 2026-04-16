import { type ReactNode, Suspense } from "react";
import { SidebarWrapper } from "@/components/layout/sidebar-wrapper";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <Suspense fallback={<div className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black animate-pulse" />}>
        <SidebarWrapper />
      </Suspense>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex items-center px-8">
          <div className="flex-1" />
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </header>
        <main className="flex-1 p-8">
          <Suspense fallback={<div className="animate-pulse bg-zinc-100 dark:bg-zinc-900 h-full rounded-2xl" />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
