import prisma from "@/lib/prisma";
import { TeamForm } from "@/components/teams/team-form";
import { TeamMemberManager } from "@/components/teams/team-member-manager";

export default async function TeamsPage() {
  'use cache';
  
  const [teams, availableMembers] = await Promise.all([
    prisma.team.findMany({
      include: { members: true },
      orderBy: { name: 'asc' },
    }),
    prisma.teamMember.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Work Units (Teams)</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Organize your creative staff into functional teams.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Create Team Form */}
        <div className="lg:col-span-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-bold mb-4">Create New Team</h2>
          <TeamForm />
        </div>

        {/* Right: Teams List & Member Management */}
        <div className="lg:col-span-8 space-y-6">
          {teams.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <p className="text-zinc-500">No teams created yet.</p>
            </div>
          ) : (
            teams.map(team => (
              <div key={team.id} className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-black dark:text-white">{team.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{team.description || "No description provided."}</p>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {team.members.length} Members
                  </div>
                </div>
                
                <TeamMemberManager team={team} availableMembers={availableMembers} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
