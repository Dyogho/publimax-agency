import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans text-black dark:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black dark:bg-white rounded-lg" />
          <span className="text-xl font-bold tracking-tight">PubliMax</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="#servicios" className="hover:text-black dark:hover:text-white transition-colors">Servicios</Link>
          <Link href="#nosotros" className="hover:text-black dark:hover:text-white transition-colors">Nosotros</Link>
          <Link href="/login" className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity">
            Ingresar
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Nueva plataforma de gestión v1.0
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-black to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
          Potenciamos tu marca con <br className="hidden md:block" /> creatividad inteligente.
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          Agencia PubliMax: Gestión integral de campañas, contenido creativo y estrategia digital enfocada en resultados reales.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/login" 
            className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-2xl shadow-xl shadow-black/5 dark:shadow-white/5 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            Comenzar ahora
            <span className="text-lg">→</span>
          </Link>
          <Link 
            href="#servicios" 
            className="px-8 py-4 bg-white dark:bg-zinc-900 text-black dark:text-white font-semibold rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Nuestros servicios
          </Link>
        </div>

        <div className="mt-24 w-full max-w-4xl aspect-video rounded-3xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
               <div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                 <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black dark:border-l-white border-b-[8px] border-b-transparent ml-1" />
               </div>
               <span className="text-xs mt-4 font-medium uppercase tracking-widest text-zinc-400">Ver Showreel 2026</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm text-zinc-500">
            © 2026 PubliMax Marketing Digital. Todos los derechos reservados.
          </div>
          <div className="flex gap-6 text-sm text-zinc-400">
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
