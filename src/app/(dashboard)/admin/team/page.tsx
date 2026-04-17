import prisma from "@/lib/prisma";
import { MemberTable } from "@/components/teams/member-table";
import { MemberForm } from "@/components/teams/member-form";

export default async function TeamDirectoryPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Creative Directory</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage the human talent of the agency.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MemberTable members={members} />
        </div>
        
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4">Add New Member</h2>
          <MemberForm />
        </div>
      </div>
    </div>
  );
}
