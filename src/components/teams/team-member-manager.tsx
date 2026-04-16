"use client";

import { type TeamMember, type Team } from "@prisma/client";
import { addMemberToTeam, removeMemberFromTeam } from "@/app/actions/teams";
import { useState } from "react";

type TeamWithMembers = Team & { members: TeamMember[] };

interface TeamMemberManagerProps {
  team: TeamWithMembers;
  availableMembers: TeamMember[];
}

export function TeamMemberManager({ team, availableMembers }: TeamMemberManagerProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const memberIds = new Set(team.members.map(m => m.id));

  async function handleToggle(memberId: string, isJoined: boolean) {
    setIsUpdating(memberId);
    if (isJoined) {
      await removeMemberFromTeam(team.id, memberId);
    } else {
      await addMemberToTeam(team.id, memberId);
    }
    setIsUpdating(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {team.members.map(member => (
          <div key={member.id} className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full text-xs font-medium">
            {member.name}
            <button 
              disabled={isUpdating === member.id}
              onClick={() => handleToggle(member.id, true)}
              className="hover:text-red-500 transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
        {team.members.length === 0 && <p className="text-xs text-zinc-500 italic">No members in this team yet.</p>}
      </div>

      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <h4 className="text-xs font-bold uppercase text-zinc-500 mb-3">Add Members</h4>
        <div className="max-h-40 overflow-y-auto space-y-1 pr-2">
          {availableMembers.filter(m => !memberIds.has(m.id)).map(member => (
            <button
              key={member.id}
              disabled={isUpdating === member.id}
              onClick={() => handleToggle(member.id, false)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex justify-between items-center group"
            >
              <span>{member.name} <span className="text-[10px] text-zinc-400">({member.role})</span></span>
              <span className="text-xs text-zinc-400 group-hover:text-black dark:group-hover:text-white">+ Add</span>
            </button>
          ))}
          {availableMembers.filter(m => !memberIds.has(m.id)).length === 0 && (
            <p className="text-xs text-zinc-500">All available members are already in this team.</p>
          )}
        </div>
      </div>
    </div>
  );
}
