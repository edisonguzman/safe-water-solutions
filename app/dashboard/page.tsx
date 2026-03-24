import React from "react";
import { sql } from "@/app/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import DashboardActions from "@/app/components/DashboardActions";

export default async function SalesDashboard({ 
  searchParams 
}: { 
  searchParams: Promise<{ start?: string; end?: string; q?: string }> 
}) {
  const { userId } = await auth();
  const filters = await searchParams;
  
  // Date and Search Filtering Logic
  const startDate = filters.start ? `${filters.start} 00:00:00` : '1970-01-01';
  const endDate = filters.end ? `${filters.end} 23:59:59` : '2099-12-31';
  const searchTerm = filters.q ? `%${filters.q}%` : '%';

  const prospects = await sql`
    SELECT 
      id, first_name1, last_name1, first_name2, last_name2,
      email, address, city, state, created_at, water_source
    FROM prospects
    WHERE sales_rep_id = ${userId}
    AND created_at >= ${startDate}
    AND created_at <= ${endDate}
    AND (
      first_name1 ILIKE ${searchTerm} OR 
      last_name1 ILIKE ${searchTerm} OR 
      first_name2 ILIKE ${searchTerm} OR 
      last_name2 ILIKE ${searchTerm} OR 
      email ILIKE ${searchTerm}
    )
    ORDER BY created_at DESC
  `;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Safe Water Solutions</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Sales Dashboard</span>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">SR</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div className="w-full md:w-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Prospects</h2>
            
            {/* Search and Filter Form */}
            <form className="mt-4 flex flex-wrap gap-2 items-center">
              <input 
                type="text" 
                name="q" 
                placeholder="Search name or email..." 
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
                  <Link href="/dashboard" className="text-xs text-red-500 font-bold hover:underline ml-1">
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
              <p className="text-gray-500 mt-2 text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Prospect Name(s)</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Water Source</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prospects.map((prospect) => (
                    <tr key={prospect.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {new Date(prospect.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/dashboard/prospect/${prospect.id}`} className="group block">
                          <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {prospect.first_name1} {prospect.last_name1}
                            {prospect.first_name2 && ` & ${prospect.first_name2} ${prospect.last_name2}`}
                          </div>
                          <div className="text-sm text-gray-500">{prospect.email || 'No email provided'}</div>
                        </Link>
                      </td>
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
          )}
        </div>
      </main>
    </div>
  );
}