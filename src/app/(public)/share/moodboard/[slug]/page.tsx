import { getMoodboardBySlug } from "@/app/actions/moodboards";
import { notFound } from "next/navigation";
import { ReferenceGrid } from "@/components/moodboards/reference-grid";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicMoodboardPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center animate-pulse bg-zinc-50 dark:bg-black" />}>
      <MoodboardContent params={params} />
    </Suspense>
  );
}

async function MoodboardContent({ params }: PageProps) {
  const { slug } = await params;
  const result = await getMoodboardBySlug(slug);

  if (!result) notFound();

  // Handle restricted state
  if ("restricted" in result && result.restricted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-6">
        <div className="text-center space-y-4 max-w-md">
          <span className="text-6xl">🚧</span>
          <h1 className="text-2xl font-bold">Enlace Privado</h1>
          <p className="text-zinc-500 text-sm">
            Este moodboard aún está en fase de colaboración interna.
            El enlace público se activará cuando la agencia finalice la propuesta.
          </p>
        </div>
      </div>
    );
  }

  // At this point we know result is the moodboard object
  // Since getMoodboardBySlug returns either null, { restricted: true }, or the moodboard
  if ("restricted" in result) notFound();

  const board = result;

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans pb-20">
      <nav className="p-8 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
        <div>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-1">Propuesta Creativa</p>
          <h1 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight">
            PubliMax <span className="text-zinc-300 dark:text-zinc-700">/</span> {board.campaign.name}
          </h1>
        </div>
        <div className="hidden sm:block">
          <span className="text-xs font-bold px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">
            Vista de Cliente
          </span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8 lg:p-12 space-y-12">
        <header className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Lienzo de Inspiración</h2>
          <p className="text-lg text-zinc-500 max-w-2xl leading-relaxed">
            Hemos seleccionado estas referencias visuales y estilos para definir la dirección creativa de tu campaña.
            Este moodboard representa la vibra y estética final del proyecto.
          </p>
        </header>

        {board.finalImage && (
          <section className="space-y-4">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Versión Final Seleccionada</p>
            <div className="aspect-video w-full rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">
              <img src={board.finalImage} alt="Moodboard Final" className="w-full h-full object-cover" />
            </div>
          </section>
        )}

        <section className="space-y-6">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Referencias y Guías Visuales</p>
          <ReferenceGrid
            moodboardId={board.id}
            urls={board.urls}
            isLocked={true}
            canEdit={false}
          />
        </section>

        <footer className="pt-20 text-center">
          <p className="text-zinc-400 text-sm">© 2026 PubliMax Marketing Digital. Todos los derechos reservados.</p>
        </footer>
      </main>
    </div>
  );
}
