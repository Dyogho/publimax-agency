import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReferenceGrid } from "@/components/moodboards/reference-grid";
import { AddReferenceForm } from "@/components/moodboards/add-reference-form";

export default async function CreativeMoodboardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) redirect("/login");

  // Fetch campaigns assigned to teams where the user is a member
  const campaigns = await prisma.campaign.findMany({
    where: {
      teams: {
        some: {
          members: {
            some: {
              email: user.email
            }
          }
        }
      }
    },
    include: {
      moodboards: true
    }
  });

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Moodboards del Equipo</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Colaboración visual para tus campañas asignadas.</p>
      </header>

      {campaigns.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 italic text-sm">No tienes campañas asignadas con moodboards activos.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {campaigns.map(campaign => {
            const moodboard = campaign.moodboards[0];
            if (!moodboard) return null;

            return (
              <section key={campaign.id} className="space-y-6">
                <div className="flex justify-between items-end border-b border-zinc-100 dark:border-zinc-900 pb-4">
                  <div>
                    <h2 className="text-xl font-bold">{campaign.name}</h2>
                    <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">
                      {moodboard.isLocked ? "🔒 Moodboard Bloqueado (Solo Lectura)" : "🔓 Espacio de Colaboración Abierto"}
                    </p>
                  </div>
                  {!moodboard.isLocked && (
                    <div className="w-full max-w-md">
                      <AddReferenceForm moodboardId={moodboard.id} />
                    </div>
                  )}
                </div>

                <ReferenceGrid 
                  moodboardId={moodboard.id} 
                  urls={moodboard.urls} 
                  isLocked={moodboard.isLocked} 
                  canEdit={true}
                />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
