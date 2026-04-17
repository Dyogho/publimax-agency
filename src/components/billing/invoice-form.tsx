"use client";

import { useActionState, useMemo } from "react";
import { createInvoice } from "@/app/actions/billing";
import { BillingType, Campaign, Deliverable, InvoiceStatus } from "@prisma/client";
import { InvoiceInput } from "@/lib/validations/billing";

interface InvoiceFormProps {
  campaign: Campaign & { deliverables: Deliverable[] };
  onSuccess?: () => void;
}

export function InvoiceForm({ campaign, onSuccess }: InvoiceFormProps) {
  // Calculate duration to enforce rule
  const isShortTerm = useMemo(() => {
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 30;
  }, [campaign.startDate, campaign.endDate]);

  async function handleSubmit(prevState: { error?: string } | null, formData: FormData) {
    const data: InvoiceInput = {
      amount: Number(formData.get("amount")),
      dueDate: new Date(formData.get("dueDate") as string),
      description: formData.get("description") as string,
      type: formData.get("type") as BillingType,
      status: InvoiceStatus.PENDING,
      campaignId: campaign.id,
      deliverableId: formData.get("deliverableId") as string || null,
      campaignStartDate: campaign.startDate,
      campaignEndDate: campaign.endDate,
    };

    const result = await createInvoice(data);

    if ("success" in result && result.success) {
      onSuccess?.();
      return { success: true };
    }
    return { error: "error" in result ? (result.error as string) : "Error desconocido" };
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600">
          {typeof state.error === 'string' ? state.error : "Error en el formulario"}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Monto ($)</label>
          <input 
            name="amount" 
            type="number" 
            step="0.01" 
            required 
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Fecha de Vencimiento</label>
          <input 
            name="dueDate" 
            type="date" 
            required 
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" 
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Tipo de Facturación</label>
        <select 
          name="type" 
          defaultValue={BillingType.MILESTONE}
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm"
        >
          <option value={BillingType.MILESTONE}>Por Hito (Milestone)</option>
          {!isShortTerm && (
            <option value={BillingType.MONTHLY}>Mensual (Monthly)</option>
          )}
        </select>
        {isShortTerm && (
          <p className="mt-1 text-[10px] text-amber-600 font-medium">
            * Campañas menores a 30 días solo permiten facturación por hito.
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Vincular Entregable (Opcional)</label>
        <select 
          name="deliverableId" 
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm"
        >
          <option value="">Ninguno</option>
          {campaign.deliverables.map(d => (
            <option key={d.id} value={d.id}>{d.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Descripción</label>
        <textarea 
          name="description" 
          required 
          rows={2}
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none text-sm" 
          placeholder="Ej: Pago inicial 30%..."
        />
      </div>

      <button 
        disabled={isPending}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm shadow-lg shadow-blue-500/20"
      >
        {isPending ? "Generando..." : "Generar Factura"}
      </button>
    </form>
  );
}
