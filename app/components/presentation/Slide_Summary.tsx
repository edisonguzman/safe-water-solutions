"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";
import { calculateMonthlySavings } from "@/app/lib/formulas";
import { CheckCircle2, TrendingDown } from "lucide-react";

export default function Slide_Summary() {
  const { state } = usePresentation();

  // Use the centralized formula for all math
  const savings = calculateMonthlySavings(state);
  
  const totalMonthlySavings = savings.total;
  const totalYearlySavings = totalMonthlySavings * 12;
  const tenYearSavings = totalMonthlySavings * 120;

  // Helper to format names
  const displayName = state.prospectInfo.firstName2 
    ? `${state.prospectInfo.firstName1} & ${state.prospectInfo.firstName2}`
    : state.prospectInfo.firstName1;

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-6">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tight">
          Your Peace of Mind Summary
        </h2>
        <p className="text-gray-500 font-medium italic">
          Prepared for {displayName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Water Test Snapshot */}
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-blue-800">
            <CheckCircle2 size={24} />
            <h3 className="text-xl font-bold uppercase">Water Quality Report</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600">Hardness:</span>
              <span className="font-bold text-blue-900">{state.waterTestResults.hardness} GPG</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-600">TDS Level:</span>
              <span className="font-bold text-blue-900">{state.waterTestResults.tds} PPM</span>
            </div>
            {state.waterSource === "Well Water" ? (
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Iron/Nitrates:</span>
                <span className="font-bold text-orange-600">Detected</span>
              </div>
            ) : (
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-600">Chlorine:</span>
                <span className="font-bold text-blue-900">{state.waterTestResults.chlorine} PPM</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Savings Snapshot */}
        <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
          <div className="flex items-center gap-2 mb-4 text-green-800">
            <TrendingDown size={24} />
            <h3 className="text-xl font-bold uppercase">Monthly Savings Found</h3>
          </div>
          
          <div className="space-y-3 text-lg">
            <div className="flex justify-between text-green-700">
              <span>Cleaning Products:</span>
              <span className="font-bold">${savings.soap.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Bottled Water/Filters:</span>
              <span className="font-bold">${savings.water.toFixed(2)}</span>
            </div>
            {/* Changed Household Water to Wear and Tear line item */}
            <div className="flex justify-between text-green-700">
              <span>Wear and Tear:</span>
              <span className="font-bold">${savings.householdWater.toFixed(2)}</span>
            </div>
            <div className="pt-4 mt-4 border-t border-green-200 flex justify-between items-center">
              <span className="font-black text-green-900 text-xl">Total Savings:</span>
              <span className="text-3xl font-black text-green-600">${totalMonthlySavings.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* The "Big Picture" Impact Box */}
      <div className="bg-blue-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-around items-center gap-8 text-center">
          <div>
            <p className="text-blue-200 uppercase font-bold tracking-widest text-sm mb-1">Yearly Savings</p>
            <p className="text-5xl font-black">${totalYearlySavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </div>
          <div className="h-16 w-px bg-blue-700 hidden md:block"></div>
          <div>
            <p className="text-blue-200 uppercase font-bold tracking-widest text-sm mb-1">10-Year Impact</p>
            <p className="text-5xl font-black text-yellow-400">${tenYearSavings.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <TrendingDown size={200} />
        </div>
      </div>

      <p className="text-center text-gray-400 text-[10px] leading-tight">
        *Calculations based on provided household data of {state.prospectInfo.householdSize} persons. 
        Savings represent estimated reductions in product waste and energy efficiency.
      </p>
    </div>
  );
}