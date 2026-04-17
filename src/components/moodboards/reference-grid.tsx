"use client";

import { removeReferenceUrl } from "@/app/actions/moodboards";
import { useTransition } from "react";

interface ReferenceGridProps {
  moodboardId: string;
  urls: string[];
  isLocked: boolean;
  canEdit: boolean;
}

export function ReferenceGrid({ moodboardId, urls, isLocked, canEdit }: ReferenceGridProps) {
  const [isPending, startTransition] = useTransition();

  async function handleRemove(url: string) {
    if (!confirm("¿Eliminar esta referencia?")) return;
    startTransition(async () => {
      await removeReferenceUrl(moodboardId, url);
    });
  }

  if (urls.length === 0) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl">
        <p className="text-zinc-500 italic">No hay referencias agregadas aún.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {urls.map((url, index) => (
        <div 
          key={index} 
          className="group relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all aspect-video flex items-center justify-center p-4"
        >
          <div className="text-center overflow-hidden w-full">
            <span className="text-3xl mb-2 block">🔗</span>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Referencia</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline break-all line-clamp-2 px-2"
            >
              {url.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          </div>

          {!isLocked && canEdit && (
            <button
              onClick={() => handleRemove(url)}
              disabled={isPending}
              className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            >
              <span className="text-xs">✕</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
