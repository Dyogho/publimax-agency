"use client";

import { useActionState } from "react";
import Image from "next/image";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <Image
            className="dark:invert mb-4"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="text-2xl font-bold text-black dark:text-white text-center">PubliMax Agency</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-center text-sm">Panel de Gestión Creativa</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Corporativo</label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none text-sm"
              placeholder="correo@publimax.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
          
          {state?.error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/10 p-2 rounded border border-red-100 dark:border-red-900/20">
              {state.error}
            </p>
          )}

          <button
            disabled={isPending}
            type="submit"
            className="w-full py-2.5 px-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
          >
            {isPending ? "Verificando..." : "Ingresar al Panel"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            © 2026 PubliMax Marketing Digital
          </p>
        </div>
      </div>
    </div>
  );
}
