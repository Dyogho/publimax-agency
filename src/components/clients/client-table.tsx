"use client";

import { type Client } from "@prisma/client";
import { deleteClient } from "@/app/actions/clients";
import { useState } from "react";

interface ClientTableProps {
  clients: Client[];
}

export function ClientTable({ clients }: ClientTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this client?")) return;
    setIsDeleting(id);
    const result = await deleteClient(id);
    if (result.error) alert(result.error);
    setIsDeleting(null);
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Address</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {clients.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                No clients found. Start by creating one.
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-black dark:text-white">{client.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{client.email}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{client.phone || "-"}</td>
                <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{client.address || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="text-zinc-500 hover:text-black dark:hover:text-white text-xs font-medium"
                      onClick={() => alert("Edit not implemented in this view yet")}
                    >
                      Edit
                    </button>
                    <button 
                      disabled={isDeleting === client.id}
                      className="text-red-500 hover:text-red-600 text-xs font-medium disabled:opacity-50"
                      onClick={() => handleDelete(client.id)}
                    >
                      {isDeleting === client.id ? "..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
