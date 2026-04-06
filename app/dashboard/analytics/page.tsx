import React from "react";
import { sql } from "@/app/lib/db";
import { auth } from "@clerk/nextjs/server";
import { TrendingUp, DollarSign, PieChart, Target, Calendar } from "lucide-react";

export const dynamic = 'force-dynamic';

// Helper component for the Stat Cards
function AnalyticCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md flex items-center gap-4">
      <div className="p-4 bg-slate-50 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default async function SalesAnalyticsPage(props: { 
  searchParams: Promise<{ start?: string; end?: string }> 
}) {
  const { userId, sessionClaims } = await auth();
  const filters = await props.searchParams;
  const isAdmin = (sessionClaims?.metadata as any)?.role === 'admin';

  // Default to current year
  const startDate = filters.start || '2026-01-01';
  const endDate = filters.end || '2026-12-31';

  // 1. Fetch Aggregate Totals
  const totalsResult = await sql.query(`
    SELECT 
      COUNT(*) as total_sales,
      SUM(sale_price) as gross_sales,
      SUM(amount_funded) as total_funded,
      AVG(CASE WHEN sale_price > 0 THEN (amount_funded / sale_price) * 100 ELSE 0 END) as avg_funding_pct
    FROM prospects
    WHERE sale_date >= $1 AND sale_date <= $2 AND sale_price > 0
    ${isAdmin ? "" : `AND sales_rep_id = '${userId}'`}
  `, [startDate, endDate]);

  const stats = totalsResult[0] || {};

  // 2. Fetch Lead Source Performance
  const sourceBreakdown = await sql.query(`
    SELECT 
      lead_source,
      COUNT(*) as count,
      SUM(sale_price) as revenue,
      SUM(amount_funded) as funded
    FROM prospects
    WHERE sale_date >= $1 AND sale_date <= $2 AND sale_price > 0
    ${isAdmin ? "" : `AND sales_rep_id = '${userId}'`}
    GROUP BY lead_source
    ORDER BY revenue DESC
  `, [startDate, endDate]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Sales Analytics</h1>
          <p className="text-slate-500 font-medium">Performance metrics based on funded production.</p>
        </div>

        <form className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar size={16} className="text-slate-400 ml-2" />
          <input type="date" name="start" defaultValue={startDate} className="text-xs font-bold outline-none" />
          <span className="text-slate-300">to</span>
          <input type="date" name="end" defaultValue={endDate} className="text-xs font-bold outline-none" />
          <button type="submit" className="bg-blue-900 text-white px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-800">Update Report</button>
        </form>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnalyticCard title="Closed Deals" value={stats.total_sales || 0} icon={<Target className="text-blue-600" />} />
          <AnalyticCard title="Gross Volume" value={`$${Number(stats.gross_sales || 0).toLocaleString()}`} icon={<DollarSign className="text-green-600" />} />
          <AnalyticCard title="Total Funded" value={`$${Number(stats.total_funded || 0).toLocaleString()}`} icon={<TrendingUp className="text-purple-600" />} />
          <AnalyticCard title="Funding Eff." value={`${Math.round(stats.avg_funding_pct || 0)}%`} icon={<PieChart className="text-orange-600" />} />
        </div>

        <section className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Revenue by Lead Source</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-tighter border-b border-slate-100">
                <th className="px-8 py-4">Lead Source</th>
                <th className="px-8 py-4 text-center">Qty</th>
                <th className="px-8 py-4">Total Revenue</th>
                <th className="px-8 py-4">Total Funded</th>
                <th className="px-8 py-4 text-right">Avg Sale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sourceBreakdown.map((row: any) => (
                <tr key={row.lead_source || 'unknown'} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900 uppercase text-xs">{row.lead_source || "Unknown"}</td>
                  <td className="px-8 py-5 text-center font-black text-blue-600">{row.count}</td>
                  <td className="px-8 py-5 font-bold text-slate-700">${Number(row.revenue).toLocaleString()}</td>
                  <td className="px-8 py-5 font-bold text-green-600">${Number(row.funded).toLocaleString()}</td>
                  <td className="px-8 py-5 text-right font-medium text-slate-500">
                    ${row.count > 0 ? Math.round(row.revenue / row.count).toLocaleString() : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}