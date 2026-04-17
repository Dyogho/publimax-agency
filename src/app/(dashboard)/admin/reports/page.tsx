import { getGlobalROIReport, getAdsTypeDistribution } from "@/app/actions/reports";
import { BudgetROIChart } from "@/components/reports/budget-roi-chart";
import { AdsTypeChart } from "@/components/reports/ads-type-chart";

export default async function ReportsPage() {
  const [roiData, adsData] = await Promise.all([
    getGlobalROIReport(),
    getAdsTypeDistribution()
  ]);

  const totalBudget = adsData.reduce((sum, item) => sum + item.value, 0);
  const totalReturn = roiData.reduce((sum, item) => sum + item.expectedReturn, 0);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">Agency Reports</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Performance analytics and ROI projections.</p>
      </header>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-black text-white dark:bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl flex flex-col justify-between">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Investment Managed</p>
          <div className="mt-4">
            <span className="text-5xl font-bold">${totalBudget.toLocaleString()}</span>
            <p className="text-sm text-zinc-500 mt-2">Sum of all active and planned campaign budgets.</p>
          </div>
        </div>
        <div className="p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col justify-between">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Total Expected ROI</p>
          <div className="mt-4">
            <span className="text-5xl font-bold text-green-600 dark:text-green-400">
              ${totalReturn.toLocaleString()}
            </span>
            <p className="text-sm text-zinc-500 mt-2">Combined projected return based on ROI multipliers.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget vs ROI Chart */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold mb-6">Investment vs. Projected Return</h2>
          <BudgetROIChart data={roiData} />
        </div>

        {/* Ads Type Distribution */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold mb-6">Budget Distribution</h2>
          <AdsTypeChart data={adsData} />
          <div className="mt-4 space-y-2">
            {adsData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">{item.name}</span>
                <span className="font-bold">${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
