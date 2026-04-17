"use client";

import { toggleMoodboardLock, setFinalMoodboardImage } from "@/app/actions/moodboards";
import { useState, useTransition } from "react";

interface AdminMoodboardControlsProps {
  moodboardId: string;
  isLocked: boolean;
  slug: string;
  finalImage?: string | null;
}

export function AdminMoodboardControls({ moodboardId, isLocked, slug, finalImage }: AdminMoodboardControlsProps) {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState(finalImage || "");

  const shareUrl = `${window.location.origin}/share/moodboard/${slug}`;

  async function handleToggleLock() {
    startTransition(async () => {
      await toggleMoodboardLock(moodboardId, !isLocked);
    });
  }

  async function handleSetFinalImage() {
    if (!imageUrl) return;
    startTransition(async () => {
      await setFinalMoodboardImage(moodboardId, imageUrl);
    });
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl);
    alert("Enlace copiado al portapapeles");
  }

  return (
    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-sm">Control de Acceso</h3>
          <p className="text-xs text-zinc-500">Bloquear detiene la edición interna y habilita el link público.</p>
        </div>
        <button
          onClick={handleToggleLock}
          disabled={isPending}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            isLocked 
              ? "bg-red-100 text-red-600 hover:bg-red-200" 
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          {isLocked ? "🔒 Bloqueado (Público)" : "🔓 Activo (Privado)"}
        </button>
      </div>

      {isLocked && (
        <div className="p-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-between gap-4">
          <code className="text-[10px] text-zinc-500 truncate flex-1">{shareUrl}</code>
          <button 
            onClick={copyToClipboard}
            className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-bold"
          >
            Copiar Link
          </button>
        </div>
      )}

      <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest">Imagen Final del Moodboard</label>
        <div className="flex gap-2">
          <input 
            type="url" 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Pegar URL de la imagen final..."
            className="flex-1 px-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs outline-none"
          />
          <button
            onClick={handleSetFinalImage}
            disabled={isPending || !imageUrl}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
