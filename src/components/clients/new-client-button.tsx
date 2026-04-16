"use client";

import { useState } from "react";
import { ClientForm } from "./client-form";

export function NewClientButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all text-sm shadow-lg shadow-black/10 dark:shadow-white/5"
      >
        + New Client
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">Create New Client</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <ClientForm onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
