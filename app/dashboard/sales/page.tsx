import React from "react";
import { sql } from "@/app/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import SalesRow from "@/app/components/SalesRow";

export const dynamic = 'force-dynamic';

export default async function SalesLedgerPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ start?: string; end?: string; q?: string; page?: string }> 
}) {
  const { userId, sessionClaims } = await auth();
  const filters = await searchParams;
  const isAdmin = (sessionClaims?.metadata as any)?.role === 'admin';

  // 1. Pagination Logic
  const pageSize = 20;
  const currentPage = Number(filters.page) || 1;
  const offset = (currentPage - 1) * pageSize;

  // 2. Filters
  const startDate = filters.start || '1970-01-01';
  const endDate = filters.end || '2099-12-31';
  const searchTerm = filters.q ? `%${filters.q}%` : '%';

  // 3. Fetch Prospects with LIMIT, OFFSET, and Total Count
  const result = await sql.query(`
    SELECT *, COUNT(*) OVER() as total_count
    FROM prospects
    WHERE (created_at >= $1 AND created_at <= $2)
    AND (last_name1 ILIKE $3 OR first_name1 ILIKE $3 OR email ILIKE $3)
    ${isAdmin ? "" : `AND sales_rep_id = '${userId}'`}
    ORDER BY created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `, [startDate, endDate, searchTerm]);

  const prospects = result;
  const totalResults = prospects[0]?.total_count || 0;
  const totalPages = Math.ceil(totalResults / pageSize);

  // 4. URL Helper for Pagination
  const getNavPath = (newPage: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  return (
    <div key={currentPage} className="min-h-screen bg-slate-50 p-4 md:p-8 pb-24">
      <header className="max-w-[1600px] mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">Production Ledger</h1>
          <p className="text-slate-500 text-sm font-bold mt-1">
            Showing {offset + 1}-{Math.min(offset + pageSize, totalResults)} of {totalResults} entries
          </p>
        </div>
        
        <form className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
           <Search size={16} className="text-slate-400 ml-2" />
           <input type="text" name="q" placeholder="Search..." defaultValue={filters.q} className="text-xs outline-none w-32" />
           <div className="h-4 w-px bg-slate-200 mx-1" />
           <Calendar size={16} className="text-slate-400" />
           <input type="date" name="start" defaultValue={filters.start} className="text-xs font-bold outline-none" />
           <input type="date" name="end" defaultValue={filters.end} className="text-xs font-bold outline-none" />
           <button type="submit" className="bg-blue-900 text-white px-4 py-1 rounded-lg text-xs font-bold">Apply</button>
        </form>
      </header>

      <div className="max-w-[1600px] mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1800px]">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-widest font-black">
                <th className="px-4 py-5 sticky left-0 bg-slate-900 z-20">Client Name</th>
                <th className="px-4 py-5">Lead Source</th>
                <th className="px-4 py-5">Sale Date</th>
                <th className="px-4 py-5">Sale Price</th>
                <th className="px-4 py-5">Finance Co.</th>
                <th className="px-4 py-5">Funded Amt</th>
                <th className="px-4 py-5">%</th>
                <th className="px-4 py-5">Install Date</th>
                <th className="px-4 py-5">Status</th>
                <th className="px-4 py-5">SWS Paid</th>
                <th className="px-4 py-5">Rep Paid</th>
                <th className="px-4 py-5">Grade</th>
                <th className="px-4 py-5">EQ Type</th>
                <th className="px-4 py-5 text-center">Save</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prospects.map((p: any) => (
                <SalesRow key={p.id} prospect={p} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW PAGINATION CONTROLS */}
      <div className="mt-10 flex justify-center items-center gap-6">
        <Link 
          href={getNavPath(Math.max(1, currentPage - 1))}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl border-2 font-black text-xs uppercase transition-all ${currentPage <= 1 ? 'opacity-20 pointer-events-none' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-600 hover:text-blue-600'}`}
        >
          <ChevronLeft size={18} /> Previous
        </Link>
        
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Page <span className="text-blue-900 text-lg mx-1">{currentPage}</span> of {totalPages}
        </div>

        <Link 
          href={getNavPath(Math.min(totalPages, currentPage + 1))}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl border-2 font-black text-xs uppercase transition-all ${currentPage >= totalPages ? 'opacity-20 pointer-events-none' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-600 hover:text-blue-600'}`}
        >
          Next <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}