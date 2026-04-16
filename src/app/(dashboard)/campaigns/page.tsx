import prisma from "@/lib/prisma";
import { CampaignTable } from "@/components/campaigns/campaign-table";
import { NewCampaignButton } from "@/components/campaigns/new-campaign-button";

export default async function CampaignsPage() {
  'use cache';
  
  // Fetch campaigns with their related clients
  const campaigns = await prisma.campaign.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch clients for the creation form
  const [clients, teams] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: 'asc' } }),
    prisma.team.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Campaigns</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Track and manage your digital ads strategies.</p>
        </div>
        <NewCampaignButton clients={clients} teams={teams} />
      </header>

      <CampaignTable campaigns={campaigns} />
    </div>
  );
}
