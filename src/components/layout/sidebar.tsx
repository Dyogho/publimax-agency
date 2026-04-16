import Link from "next/link";
import { SystemRole } from "@prisma/client";

interface SidebarProps {
  role: SystemRole;
}

export function Sidebar({ role }: SidebarProps) {
  const isAdmin = role === "ADMIN";

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hidden md:flex flex-col">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link 
          href={isAdmin ? "/admin" : "/creative"} 
          className="text-xl font-bold text-black dark:text-zinc-50"
        >
          PubliMax
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {/* Admin only dashboard link */}
        {isAdmin && (
          <Link 
            href="/admin" 
            className="block px-4 py-2 text-sm font-medium text-zinc-950 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
          >
            Dashboard
          </Link>
        )}

        {/* Creative only dashboard link */}
        {!isAdmin && (
          <Link 
            href="/creative" 
            className="block px-4 py-2 text-sm font-medium text-zinc-950 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
          >
            Creative Dashboard
          </Link>
        )}

        {isAdmin && (
          <>
            <Link 
              href="/admin/campaigns" 
              className="block px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              Campaigns
            </Link>
            <Link 
              href="/admin/clients" 
              className="block px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              Clients
            </Link>
          </>
        )}

        <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Human Talent</div>
        
        <Link 
          href={isAdmin ? "/admin/team" : "/creative/team"} 
          className="block px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
        >
          Directory
        </Link>

        {isAdmin && (
          <Link 
            href="/admin/teams" 
            className="block px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
          >
            Work Units (Teams)
          </Link>
        )}
      </nav>
    </aside>
  );
}
