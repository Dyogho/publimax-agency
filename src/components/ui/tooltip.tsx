import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal w-48 text-center shadow-xl border border-zinc-800 dark:border-zinc-200 z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
      </div>
    </div>
  );
}
