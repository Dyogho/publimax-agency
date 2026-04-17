"use client";

import Link from "next/link";
import { SystemRole } from "@prisma/client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";

interface SidebarProps {
  role: SystemRole;
}

export function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = role === "ADMIN";

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = isAdmin 
    ? [
        { label: "Dashboard", href: "/admin", icon: "📊", group: "General" },
        { label: "Campañas", href: "/admin/campaigns", icon: "🚀", group: "Negocio" },
        { label: "Clientes", href: "/admin/clients", icon: "👥", group: "Negocio" },
        { label: "Facturación", href: "/admin/billing", icon: "💰", group: "Negocio" },
        { label: "Reportes ROI", href: "/admin/reports", icon: "📈", group: "Negocio" },
        { label: "Directorio", href: "/admin/team", icon: "📂", group: "Talento Humano" },
        { label: "Unidades (Teams)", href: "/admin/teams", icon: "🛡️", group: "Talento Humano" },
      ]
    : [
        { label: "Mi Dashboard", href: "/creative", icon: "🎨", group: "Creatividad" },
        { label: "Moodboards", href: "/creative/moodboards", icon: "✨", group: "Creatividad" },
        { label: "Directorio", href: "/creative/team", icon: "📂", group: "Talento Humano" },
      ];

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black flex flex-col transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <Link 
            href={isAdmin ? "/admin" : "/creative"} 
            className="text-xl font-black text-black dark:text-zinc-50 tracking-tighter"
            onClick={() => setIsOpen(false)}
          >
            PUBLIMAX <span className="text-blue-600">.</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="space-y-1">
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">
                {group}
              </h3>
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl transition-all
                      ${isActive 
                        ? 'bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white' 
                        : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}
                    `}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-900">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
          >
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
