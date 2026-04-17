import prisma from "@/lib/prisma";
import { CampaignTable } from "@/components/campaigns/campaign-table";
import { NewCampaignButton } from "@/components/campaigns/new-campaign-button";

export default async function CampaignsPage() {
  // Fetch campaigns with their related clients, deliverables (with teams), invoices, moodboards and teams
  const campaigns = await prisma.campaign.findMany({
    include: { 
      client: true,
      deliverables: {
        include: { teams: true }
      },
      invoices: {
        orderBy: { dueDate: 'desc' }
      },
      moodboards: true,
      teams: true
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch clients and teams
  const [clients, allTeams] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: 'asc' } }),
    prisma.team.findMany({ orderBy: { name: 'asc' } })
  ]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Campañas</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Sigue y gestiona tus estrategias de anuncios digitales.</p>
        </div>
        <NewCampaignButton clients={clients} />
      </header>

      <CampaignTable campaigns={campaigns} allTeams={allTeams} />
    </div>
  );
}
