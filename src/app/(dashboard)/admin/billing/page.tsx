import prisma from "@/lib/prisma";
import { getBillingSummary } from "@/app/actions/billing";

export default async function BillingPage() {
  const [summary, invoices] = await Promise.all([
    getBillingSummary(),
    prisma.invoice.findMany({
      include: { campaign: true, deliverable: true },
      orderBy: { dueDate: "desc" }
    })
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Agency Billing</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Global revenue and payment tracking.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Revenue (Paid)</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            ${summary.paid.toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Pending</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            ${summary.pending.toLocaleString()}
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Projected</p>
          <p className="text-3xl font-bold text-black dark:text-white mt-2">
            ${summary.total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Invoices</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-900">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase">Campaign</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm italic">
                    No invoices recorded yet.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-black dark:text-zinc-200">{invoice.description}</p>
                      {invoice.deliverable && (
                        <p className="text-[10px] text-blue-500 font-medium">Hito: {invoice.deliverable.title}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">{invoice.campaign.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {invoice.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">${invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        invoice.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        invoice.status === 'PENDING' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
