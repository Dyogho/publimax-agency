"use client";

import { type Campaign, type Client, type Deliverable, type Invoice } from "@prisma/client";
import { deleteCampaign } from "@/app/actions/campaigns";
import { useState } from "react";
import { BillingManager } from "../billing/billing-manager";
import { ReachGauge } from "../reports/reach-gauge";

type CampaignWithExtras = Campaign & { 
  client: Client;
  deliverables: Deliverable[];
  invoices: Invoice[];
};

interface CampaignTableProps {
  campaigns: CampaignWithExtras[];
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [activeBillingCampaign, setActiveBillingCampaign] = useState<CampaignWithExtras | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    setIsDeleting(id);
    const result = await deleteCampaign(id);
    if (result.error) alert(result.error);
    setIsDeleting(null);
  }

  const statusColors = {
    PLANNING: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PAUSED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Campaign</th>
            <th className="px-6 py-4">Reach %</th>
            <th className="px-6 py-4">Client</th>
            <th className="px-6 py-4">Budget</th>
            <th className="px-6 py-4">Dates</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {campaigns.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                No campaigns found.
              </td>
            </tr>
          ) : (
            campaigns.map((campaign) => {
              const reachPct = campaign.targetAudience && campaign.targetAudience > 0 
                ? ((campaign.expectedReach || 0) / campaign.targetAudience) * 100 
                : 0;

              return (
                <tr key={campaign.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-black dark:text-white">{campaign.name}</div>
                    <div className="text-xs text-zinc-500">{campaign.adsType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20">
                      <ReachGauge percent={reachPct} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{campaign.client.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                    ${campaign.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColors[campaign.status]}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="text-blue-600 hover:text-blue-700 text-xs font-bold"
                        onClick={() => setActiveBillingCampaign(campaign)}
                      >
                        Billing
                      </button>
                      <button 
                        disabled={isDeleting === campaign.id}
                        className="text-red-500 hover:text-red-600 text-xs font-medium disabled:opacity-50"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        {isDeleting === campaign.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Billing Modal */}
      {activeBillingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Gestión de Cobros</h2>
                <p className="text-xs text-zinc-500">{activeBillingCampaign.name}</p>
              </div>
              <button 
                onClick={() => setActiveBillingCampaign(null)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <BillingManager campaign={activeBillingCampaign} />
            </div>
            <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-end">
              <button 
                onClick={() => setActiveBillingCampaign(null)}
                className="px-6 py-2 text-sm font-bold text-zinc-500 hover:text-black transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
