"use client";

import { type TeamMember } from "@prisma/client";
import { deleteMember } from "@/app/actions/teams";
import { useState } from "react";

interface MemberTableProps {
  members: TeamMember[];
}

export function MemberTable({ members }: MemberTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure? This will remove the member from all teams.")) return;
    setIsDeleting(id);
    await deleteMember(id);
    setIsDeleting(null);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 uppercase">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {members.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-zinc-500 text-sm">No members registered yet.</td>
            </tr>
          ) : (
            members.map(member => (
              <tr key={member.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 group transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-black dark:text-white">{member.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-500">
                  <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[10px] font-bold tracking-wider">{member.role}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    disabled={isDeleting === member.id}
                    onClick={() => handleDelete(member.id)}
                    className="text-red-500 hover:text-red-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isDeleting === member.id ? "..." : "Remove"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
