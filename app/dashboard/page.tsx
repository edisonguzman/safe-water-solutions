import React from "react";
import { sql } from "@/app/lib/db";
import SendEmailButton from "@/app/components/SendEmailButton";

export default async function SalesDashboard() {
  // TODO: Once Clerk auth is integrated, we will dynamically pull the logged-in user's ID here.
  // For now, we use the same test ID we used in our API route to fetch your test submissions.
  const salesRepId = 'test_rep_123';

  // Securely fetch prospects directly from Neon, ordered by newest first
  const prospects = await sql`
    SELECT 
      id, 
      partner1_name, 
      partner2_name, 
      email, 
      address,
      presentation_date, 
      water_source
    FROM prospects
    WHERE sales_rep_id = ${salesRepId}
    ORDER BY created_at DESC
  `;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Safe Water Solutions</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">Sales Dashboard</span>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              {/* Placeholder for Rep Initials */}
              SR
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Prospects</h2>
            <p className="text-gray-500 mt-1">Review your recent water test presentations and follow-ups.</p>
          </div>
          <a 
            href="/presentation" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
          >
            + New Presentation
          </a>
        </div>

        {/* The Data Table */}
        <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
          {prospects.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700">No prospects found</h3>
              <p className="text-gray-500 mt-2">You haven't saved any water test presentations yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Prospect Name(s)</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Water Source</th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prospects.map((prospect) => (
                    <tr key={prospect.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {new Date(prospect.presentation_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {prospect.partner1_name} {prospect.partner2_name && `& ${prospect.partner2_name}`}
                        </div>
                        <div className="text-sm text-gray-500">{prospect.email || 'No email provided'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {prospect.address || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          prospect.water_source === 'Well Water' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {prospect.water_source || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
<SendEmailButton prospect={prospect} />
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