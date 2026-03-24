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
      try {
        const res = await fetch(`/api/prospects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProspect(data);
        }
      } catch (error) {
        console.error("Failed to fetch prospect:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) getDetails();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-bold text-blue-900">Loading Report...</div>;
  if (!prospect) return <div className="p-20 text-center font-bold text-red-600">Report not found.</div>;

  // Safety Defaults for Math
  const weeklyGrocery = Number(prospect.weekly_grocery_bill) || 0;
  const productPct = Number(prospect.product_percentage) || 0;
  const bottledCost = Number(prospect.monthly_bottled_water_cost) || 0;
  const monthlyFilter = Number(prospect.monthly_filter_cost) || 0;

  const monthlySoapWaste = weeklyGrocery * 4 * productPct;
  const totalMonthlySavings = (monthlySoapWaste * 0.75) + bottledCost + monthlyFilter;

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
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-black text-blue-900 uppercase">
              {prospect.first_name1 || "Valued"} {prospect.last_name1 || "Customer"}
            </h1>
            <p className="text-gray-500 text-lg flex items-center gap-2 mt-1">
              <Home size={18} /> {prospect.address || "No Address Provided"}, {prospect.city || ""}
            </p>
          </div>
          <div className="md:text-right">
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-black uppercase">
              {prospect.water_source || "Unknown Source"}
            </span>
            <p className="text-xs text-gray-400 mt-2 flex items-center md:justify-end gap-1">
              <Calendar size={12} /> Tested on {prospect.created_at ? new Date(prospect.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Water Quality Card */}
<div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
  <div className="flex items-center gap-3 mb-6 text-blue-900 border-b pb-4">
    {/* Removed <treasure size={24} /> */}
    <Droplets size={24} />
    <h2 className="text-xl font-black uppercase tracking-tight">Water Analysis</h2>
  </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Hardness (GPG)</span>
                <span className="font-bold text-gray-900">{prospect.hardness || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">TDS (PPM)</span>
                <span className="font-bold text-gray-900">{prospect.tds || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">pH Level</span>
                <span className="font-bold text-gray-900">{prospect.ph || "7.0"}</span>
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
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Monthly Grocery Spend</span>
                <span className="font-bold">${(weeklyGrocery * 4).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Estimated Soap Waste</span>
                <span className="font-bold text-red-500">
                  -${monthlySoapWaste.toFixed(2)}
                </span>
              </div>
              <div className="pt-6 border-t border-green-200">
                <p className="text-xs uppercase font-black text-green-800 tracking-widest mb-1">Total Monthly Savings</p>
                <p className="text-4xl font-black text-green-600">
                  ${totalMonthlySavings.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row gap-4">
           <button className="flex-1 bg-blue-900 text-white py-4 rounded-2xl font-black uppercase hover:bg-blue-800 transition-all shadow-lg active:scale-95">
             Print Official PDF Report
           </button>
           <button className="flex-1 bg-white border-2 border-blue-900 text-blue-900 py-4 rounded-2xl font-black uppercase hover:bg-blue-50 transition-all active:scale-95">
             Resend Email to {prospect.first_name1 || "Customer"}
           </button>
        </div>
      </div>
    </div>
  );
}