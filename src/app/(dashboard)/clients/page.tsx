import prisma from "@/lib/prisma";
import { ClientTable } from "@/components/clients/client-table";
import { NewClientButton } from "@/components/clients/new-client-button";

export default async function ClientsPage() {
  'use cache';
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Clients</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your agencies and partners.</p>
        </div>
        <NewClientButton />
      </header>

      <ClientTable clients={clients} />
    </div>
  );
}
