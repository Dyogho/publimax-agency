"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

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
          <h1 className="text-2xl font-bold text-black dark:text-white">Bienvenido de nuevo</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Ingresa tus credenciales para acceder</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            disabled={isLoading}
            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            ¿No tienes cuenta? <span className="text-black dark:text-white font-medium cursor-pointer">Contacta a soporte</span>
          </p>
        </div>
      </div>
    </div>
  );
}
