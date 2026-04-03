"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function CostComparison() {
  const { state } = usePresentation();

  // Logic for Soaps & Cleansers (Using your 15% product impact formula)
  const weeklyGrocery = state.financialInputs?.weeklyGroceryBill || 0;
  const soapSavings = (weeklyGrocery * 0.15).toFixed(2);

  // Logic for Bottled Water
  const weeklyBottled = state.financialInputs?.weeklyBottledWaterCost || 0;
  const monthlyFilter = state.financialInputs?.monthlyFilterCost || 0;
  const waterCosts = (weeklyBottled + (monthlyFilter / 4)).toFixed(2);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white p-6 md:p-10 space-y-10">
      {/* Title */}
      <h2 className="text-4xl md:text-6xl font-black text-blue-900 tracking-tight text-center leading-tight">
        Let's Talk About Costs
      </h2>

      {/* Calculations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-100 text-center shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 uppercase tracking-wide">
            Soaps & Cleansers
          </h3>
          <p className="text-5xl md:text-6xl font-black text-blue-600">
            ${soapSavings}
          </p>
          <p className="text-sm font-bold text-blue-400 mt-2">EST. WEEKLY IMPACT</p>
        </div>

        <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-100 text-center shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 uppercase tracking-wide">
            Filtered & Bottled Water
          </h3>
          <p className="text-5xl md:text-6xl font-black text-blue-600">
            ${waterCosts}
          </p>
          <p className="text-sm font-bold text-blue-400 mt-2">EST. WEEKLY COST</p>
        </div>
      </div>

      {/* Comparison Inactive Buttons (Now with requested colors) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-6">
        
        {/* Present Situation - Red Theme */}
        <div className="py-6 px-10 bg-red-50 text-red-700 border-4 border-red-200 text-2xl md:text-3xl font-black rounded-2xl text-center uppercase cursor-default select-none shadow-sm">
          Present Situation
        </div>

        {/* Safe Water Solution - Blue Theme */}
        <div className="py-6 px-10 bg-blue-600 text-white border-4 border-blue-700 text-2xl md:text-3xl font-black rounded-2xl text-center uppercase cursor-default select-none shadow-xl">
          Safe Water Solution
        </div>

      </div>

      <p className="text-gray-400 font-medium italic">
        *Based on the data provided earlier in the presentation.
      </p>
    </div>
  );
}