import React from "react";
import { sql } from "@/app/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import DashboardActions from "@/app/components/DashboardActions";
import SyncTrigger from "@/app/components/SyncTrigger";
import { ChevronUp, ChevronDown } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SalesDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ start?: string; end?: string; q?: string; sort?: string; order?: string }> 
}) {
  const { userId, sessionClaims } = await auth();
  const client = await clerkClient();
  const filters = await searchParams;
  
  const isAdmin = (sessionClaims?.metadata as any)?.role === 'admin';
  
  // 1. Extract Sort Params
  const sort = filters.sort || "date";
  const order = filters.order || "desc";

  // 2. Date and Search Filtering Logic
  const startDate = filters.start ? `${filters.start} 00:00:00` : '1970-01-01';
  const endDate = filters.end ? `${filters.end} 23:59:59` : '2099-12-31';
  const searchTerm = filters.q ? `%${filters.q}%` : '%';

  // 3. Mapping Sort Fields to DB Columns
  const sortMap: Record<string, string> = {
    date: "created_at",
    prospect: "first_name1",
    rep: "sales_rep_id",
    location: "city",
    source: "water_source"
  };
  const dbColumn = sortMap[sort] || "created_at";
  const dbOrder = order === "asc" ? "ASC" : "DESC";

  // 4. Fetch Prospects with Sanitzed Dynamic Sorting
  // We use .query to bypass tagged-template restrictions for ORDER BY
  const prospects = await sql.query(`
    SELECT 
      id, first_name1, last_name1, first_name2, last_name2,
      email, address, city, state, created_at, water_source, sales_rep_id
    FROM prospects
    WHERE (created_at >= $1 AND created_at <= $2)
    AND (
      first_name1 ILIKE $3 OR 
      last_name1 ILIKE $3 OR 
      first_name2 ILIKE $3 OR 
      last_name2 ILIKE $3 OR 
      email ILIKE $3
    )
    ${isAdmin ? "" : `AND sales_rep_id = '${userId}'`}
    ORDER BY ${dbColumn} ${dbOrder}
  `, [startDate, endDate, searchTerm]);

  // 5. Fetch Clerk users for Admin mapping
  let repMap: Record<string, string> = {};
  if (isAdmin) {
    const clerkUsers = await client.users.getUserList();
    clerkUsers.data.forEach(u => {
      repMap[u.id] = `${u.firstName} ${u.lastName}`;
    });
  }

  // Helper for persistence of search/date filters during sort
  const getSortLink = (field: string) => {
    const newOrder = sort === field && order === "asc" ? "desc" : "asc";
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.start) params.set("start", filters.start);
    if (filters.end) params.set("end", filters.end);
    params.set("sort", field);
    params.set("order", newOrder);
    return `?${params.toString()}`;
  };

  return (
    <div key={`${sort}-${order}`} className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Safe Water CMS</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              {isAdmin ? "Executive Dashboard" : "Sales Dashboard"}
            </span>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              {isAdmin ? "EA" : "SR"}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div className="w-full md:w-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isAdmin ? "Company Wide Prospects" : "My Prospects"}
            </h2>
            
            <form className="mt-4 flex flex-wrap gap-2 items-center">
              <input 
                type="text" 
                name="q" 
                placeholder="Search name..." 
                defaultValue={filters.q}
                className="border rounded-lg px-3 py-1.5 text-sm text-gray-600 w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
              <div className="flex items-center gap-2">
                <input type="date" name="start" defaultValue={filters.start} className="border rounded-lg px-2 py-1 text-sm text-gray-600" />
                <span className="text-gray-400">to</span>
                <input type="date" name="end" defaultValue={filters.end} className="border rounded-lg px-2 py-1 text-sm text-gray-600" />
                <button type="submit" className="bg-blue-900 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors">
                  Apply
                </button>
                {(filters.start || filters.end || filters.q) && (
                  <Link href="/dashboard/prospects" className="text-xs text-red-500 font-bold hover:underline ml-1">
                    Clear All
                  </Link>
                )}
              </div>
            </form>
          </div>

          <div className="flex gap-3">
            <DashboardActions allProspects={prospects} />
            <a href="/presentation" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm whitespace-nowrap">
              + New Presentation
            </a>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {prospects.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700">No prospects found</h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <SortHeader label="Date" field="date" currentSort={sort} currentOrder={order} link={getSortLink('date')} />
                    <SortHeader label="Prospect" field="prospect" currentSort={sort} currentOrder={order} link={getSortLink('prospect')} />
                    {isAdmin && <SortHeader label="Sales Rep" field="rep" currentSort={sort} currentOrder={order} link={getSortLink('rep')} />}
                    <SortHeader label="Location" field="location" currentSort={sort} currentOrder={order} link={getSortLink('location')} />
                    <SortHeader label="Water Source" field="source" currentSort={sort} currentOrder={order} link={getSortLink('source')} />
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prospects.map((prospect: any) => (
                    <tr key={prospect.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {new Date(prospect.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/dashboard/prospect/${prospect.id}`} className="group block">
                          <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {prospect.first_name1} {prospect.last_name1}
                            {prospect.first_name2 && ` & ${prospect.first_name2}`}
                          </div>
                          <div className="text-xs text-gray-500 font-semibold">{prospect.email}</div>
                        </Link>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                            {repMap[prospect.sales_rep_id] || "Unknown Rep"}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prospect.city}, {prospect.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-[10px] font-black uppercase rounded-full ${prospect.water_source === 'Well Water' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {prospect.water_source || 'City'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DashboardActions prospect={prospect} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <SyncTrigger />
      </main>
    </div>
  );
}

function SortHeader({ label, field, currentSort, currentOrder, link }: any) {
  const isActive = currentSort === field;
  return (
    <th className="px-6 py-4">
      <Link href={link} prefetch={false} className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase group hover:text-blue-600 transition-colors">
        {label}
        <div className="flex flex-col">
          <ChevronUp size={10} className={`${isActive && currentOrder === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
          <ChevronDown size={10} className={`${isActive && currentOrder === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
        </div>
      </Link>
    </th>
  );
}