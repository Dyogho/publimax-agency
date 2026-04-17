"use client";

import { addReferenceUrl } from "@/app/actions/moodboards";
import { useState, useTransition } from "react";

interface AddReferenceFormProps {
  moodboardId: string;
}

export function AddReferenceForm({ moodboardId }: AddReferenceFormProps) {
  const [url, setUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!url.startsWith('http')) {
      setError("La URL debe empezar con http:// o https://");
      return;
    }

    startTransition(async () => {
      const result = await addReferenceUrl(moodboardId, url);
      if (result.error) {
        setError(result.error);
      } else {
        setUrl("");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Pegar link de Pinterest, Behance, etc..."
          required
          className="flex-1 px-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm focus:ring-2 focus:ring-black transition-all"
        />
        <button
          disabled={isPending}
          className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm"
        >
          {isPending ? "Añadiendo..." : "Añadir"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </form>
  );
}
