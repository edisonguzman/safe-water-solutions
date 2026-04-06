import React from "react";
import { sql } from "@/app/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import DashboardActions from "@/app/components/DashboardActions";
import SyncTrigger from "@/app/components/SyncTrigger";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SalesDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ start?: string; end?: string; q?: string; sort?: string; order?: string; page?: string }> 
}) {
  const { userId, sessionClaims } = await auth();
  const client = await clerkClient();
  const filters = await searchParams;
  
  const isAdmin = (sessionClaims?.metadata as any)?.role === 'admin';
  
  // 1. Pagination Settings
  const pageSize = 20;
  const currentPage = Number(filters.page) || 1;
  const offset = (currentPage - 1) * pageSize;

  // 2. Extract Sort and Filter Params
  const sort = filters.sort || "date";
  const order = filters.order || "desc";
  const startDate = filters.start ? `${filters.start} 00:00:00` : '1970-01-01';
  const endDate = filters.end ? `${filters.end} 23:59:59` : '2099-12-31';
  const searchTerm = filters.q ? `%${filters.q}%` : '%';

  const sortMap: Record<string, string> = {
    date: "created_at",
    prospect: "first_name1",
    rep: "sales_rep_id",
    location: "city",
    source: "water_source"
  };
  const dbColumn = sortMap[sort] || "created_at";
  const dbOrder = order === "asc" ? "ASC" : "DESC";

  // 3. Fetch Prospects with LIMIT and OFFSET
  const prospects = await sql.query(`
    SELECT 
      id, first_name1, last_name1, first_name2, last_name2,
      email, address, city, state, created_at, water_source, sales_rep_id,
      COUNT(*) OVER() as total_count
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
    LIMIT ${pageSize} OFFSET ${offset}
  `, [startDate, endDate, searchTerm]);

  const totalResults = prospects[0]?.total_count || 0;
  const totalPages = Math.ceil(totalResults / pageSize);

  // 4. Fetch Clerk users for Admin mapping
  let repMap: Record<string, string> = {};
  if (isAdmin) {
    const clerkUsers = await client.users.getUserList();
    clerkUsers.data.forEach(u => {
      repMap[u.id] = `${u.firstName} ${u.lastName}`;
    });
  }

  const getNavPath = (newParams: Record<string, string | number>) => {
    const nextParams = new URLSearchParams();
    if (filters.q) nextParams.set("q", filters.q);
    if (filters.start) nextParams.set("start", filters.start);
    if (filters.end) nextParams.set("end", filters.end);
    nextParams.set("sort", sort);
    nextParams.set("order", order);
    nextParams.set("page", currentPage.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      nextParams.set(key, value.toString());
    });
    return `?${nextParams.toString()}`;
  };

  return (
    <div key={`${sort}-${order}-${currentPage}`} className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Safe Water CMS</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              {isAdmin ? "Executive Dashboard" : "Sales Dashboard"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div className="w-full md:w-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isAdmin ? "Company Wide Prospects" : "My Prospects"}
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-bold">
              Showing {offset + 1}-{Math.min(offset + pageSize, totalResults)} of {totalResults} prospects
            </p>
            
            <form className="mt-4 flex flex-wrap gap-2 items-center">
              <input type="text" name="q" placeholder="Search..." defaultValue={filters.q} className="border rounded-lg px-3 py-1.5 text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
              <div className="flex items-center gap-2">
                <input type="date" name="start" defaultValue={filters.start} className="border rounded-lg px-2 py-1 text-sm text-gray-600" />
                <span className="text-gray-400">to</span>
                <input type="date" name="end" defaultValue={filters.end} className="border rounded-lg px-2 py-1 text-sm text-gray-600" />
                <button type="submit" className="bg-blue-900 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors">Apply</button>
                {(filters.start || filters.end || filters.q) && (
                  <Link href="/dashboard/prospects" className="text-xs text-red-500 font-bold hover:underline ml-1">Clear All</Link>
                )}
              </div>
            </form>
          </div>

          <div className="flex gap-3">
            <DashboardActions allProspects={prospects} />
            <a href="/presentation" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow-sm">+ New Presentation</a>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortHeader label="Date" field="date" currentSort={sort} currentOrder={order} getNavPath={getNavPath} />
                  <SortHeader label="Prospect Name(s)" field="prospect" currentSort={sort} currentOrder={order} getNavPath={getNavPath} />
                  {isAdmin && <SortHeader label="Sales Rep" field="rep" currentSort={sort} currentOrder={order} getNavPath={getNavPath} />}
                  <SortHeader label="Location" field="location" currentSort={sort} currentOrder={order} getNavPath={getNavPath} />
                  <SortHeader label="Water Source" field="source" currentSort={sort} currentOrder={order} getNavPath={getNavPath} />
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
                        <div className="text-sm text-gray-500">{prospect.email || 'No email provided'}</div>
                      </Link>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                          {repMap[prospect.sales_rep_id] || "Unknown Rep"}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{prospect.city}, {prospect.state}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${prospect.water_source === 'Well Water' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {prospect.water_source || 'Unknown'}
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
        </div>

        <div className="mt-8 flex justify-center items-center gap-4">
          <Link 
            href={getNavPath({ page: Math.max(1, currentPage - 1) })}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg border font-bold text-sm transition-colors ${currentPage <= 1 ? 'pointer-events-none opacity-30' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
          >
            <ChevronLeft size={16} /> Previous
          </Link>
          <div className="text-sm font-bold text-gray-500">
            Page <span className="text-blue-900">{currentPage}</span> of {totalPages}
          </div>
          <Link 
            href={getNavPath({ page: Math.min(totalPages, currentPage + 1) })}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg border font-bold text-sm transition-colors ${currentPage >= totalPages ? 'pointer-events-none opacity-30' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
          >
            Next <ChevronRight size={16} />
          </Link>
        </div>
        <SyncTrigger />
      </main>
    </div>
  );
}

function SortHeader({ label, field, currentSort, currentOrder, getNavPath }: any) {
  const isActive = currentSort === field;
  const nextOrder = isActive && currentOrder === 'asc' ? 'desc' : 'asc';
  return (
    <th className="px-6 py-4">
      <Link href={getNavPath({ sort: field, order: nextOrder, page: 1 })} prefetch={false} className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase group hover:text-blue-600">
        {label}
        <div className="flex flex-col">
          <ChevronUp size={10} className={`${isActive && currentOrder === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
          <ChevronDown size={10} className={`${isActive && currentOrder === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
        </div>
      </Link>
    </th>
  );
}