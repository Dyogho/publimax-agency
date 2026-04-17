"use client";

import { useState } from "react";
import { InvoiceForm } from "./invoice-form";
import { Campaign, Deliverable, Invoice } from "@prisma/client";

interface BillingManagerProps {
  campaign: Campaign & { deliverables: Deliverable[]; invoices: Invoice[] };
}

export function BillingManager({ campaign }: BillingManagerProps) {
  const [showForm, setShowForm] = useState(false);

  const totalInvoiced = campaign.invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const percentInvoiced = Math.min(Math.round((totalInvoiced / campaign.budget) * 100), 100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Presupuesto Facturado</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</span>
            <span className="text-sm text-zinc-500">de ${campaign.budget.toLocaleString()}</span>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-xl hover:opacity-90 transition-all"
        >
          {showForm ? "Cerrar" : "Nuevo Cobro"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${percentInvoiced > 100 ? 'bg-red-500' : 'bg-blue-600'}`}
          style={{ width: `${percentInvoiced}%` }}
        />
      </div>

      {showForm && (
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-sm font-bold mb-4">Generar Nueva Factura</h3>
          <InvoiceForm 
            campaign={campaign} 
            onSuccess={() => setShowForm(false)} 
          />
        </div>
      )}

      {/* Campaign Invoices List */}
      <div className="space-y-3">
        {campaign.invoices.length === 0 ? (
          <p className="text-sm text-zinc-500 italic text-center py-8 border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-2xl">
            No hay facturas generadas para esta campaña.
          </p>
        ) : (
          campaign.invoices.map(invoice => (
            <div key={invoice.id} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-center shadow-sm">
              <div>
                <p className="text-sm font-bold">{invoice.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-500 font-bold uppercase">
                    {invoice.type}
                  </span>
                  <span className="text-xs text-zinc-500">
                    Vence: {new Date(invoice.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">${invoice.amount.toLocaleString()}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  invoice.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
