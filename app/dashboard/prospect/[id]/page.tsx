"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Droplets, Receipt, Home, Calendar } from "lucide-react";

export default function ProspectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [prospect, setProspect] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDetails() {
      const res = await fetch(`/api/prospects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProspect(data);
      }
      setLoading(false);
    }
    getDetails();
  }, [id]);

  if (loading) return <div className="p-20 text-center">Loading Report...</div>;
  if (!prospect) return <div className="p-20 text-center">Report not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation */}
      <div className="bg-white border-b px-6 py-4 mb-8 sticky top-0 z-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black text-blue-900 uppercase">
              {prospect.first_name1} {prospect.last_name1}
            </h1>
            <p className="text-gray-500 text-lg flex items-center gap-2 mt-1">
              <Home size={18} /> {prospect.address}, {prospect.city}
            </p>
          </div>
          <div className="text-right">
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-black uppercase">
              {prospect.water_source}
            </span>
            <p className="text-xs text-gray-400 mt-2 flex items-center justify-end gap-1">
              <Calendar size={12} /> Tested on {new Date(prospect.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Water Quality Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6 text-blue-900 border-b pb-4">
              <Droplets size={24} />
              <h2 className="text-xl font-black uppercase tracking-tight">Water Analysis</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Hardness (GPG)</span>
                <span className="font-bold text-gray-900">{prospect.hardness}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">TDS (PPM)</span>
                <span className="font-bold text-gray-900">{prospect.tds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">pH Level</span>
                <span className="font-bold text-gray-900">{prospect.ph}</span>
              </div>
              {prospect.chlorine && (
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Chlorine</span>
                  <span className="font-bold text-red-600">{prospect.chlorine} PPM</span>
                </div>
              )}
            </div>
          </div>

          {/* Financial Breakdown Card */}
          <div className="bg-green-50 rounded-3xl p-8 shadow-sm border border-green-100">
            <div className="flex items-center gap-3 mb-6 text-green-900 border-b border-green-200 pb-4">
              <Receipt size={24} />
              <h2 className="text-xl font-black uppercase tracking-tight">Financial Savings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-green-700">Monthly Grocery Spend</span>
                <span className="font-bold">${prospect.weekly_grocery_bill * 4}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Estimated Soap Waste</span>
                <span className="font-bold text-red-500">
                  ${(prospect.weekly_grocery_bill * 4 * prospect.product_percentage).toFixed(2)}
                </span>
              </div>
              <div className="pt-6 border-t border-green-200">
                <p className="text-xs uppercase font-black text-green-800 tracking-widest mb-1">Total Monthly Savings</p>
                <p className="text-4xl font-black text-green-600">
                  ${((prospect.weekly_grocery_bill * 4 * prospect.product_percentage * 0.75) + (prospect.monthly_bottled_water_cost || 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4">
           <button className="flex-1 bg-blue-900 text-white py-4 rounded-2xl font-black uppercase hover:bg-blue-800 transition-all">
             Print Official PDF Report
           </button>
           <button className="flex-1 bg-white border-2 border-blue-900 text-blue-900 py-4 rounded-2xl font-black uppercase hover:bg-blue-50 transition-all">
             Resend Email to {prospect.first_name1}
           </button>
        </div>
      </div>
    </div>
  );
}