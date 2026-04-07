"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";
import { calculateMonthlySavings } from "@/app/lib/formulas";

export default function CostComparison() {
  const { state } = usePresentation();

  // Use the centralized formula to ensure these specific line items 
  // match the math on Slide 5.
  const savings = calculateMonthlySavings(state);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white p-6 md:p-10 space-y-10">
      {/* Title */}
      <h2 className="text-4xl md:text-6xl font-black text-blue-900 tracking-tight text-center leading-tight">
        Let's Talk About Costs
      </h2>

      {/* Calculations Grid - Back to 2 Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        
        {/* Soaps & Cleansers */}
        <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-100 text-center shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 uppercase tracking-wide">
            Soaps & Cleansers
          </h3>
          <p className="text-5xl md:text-6xl font-black text-blue-600">
            ${savings.soap.toFixed(2)}
          </p>
          <p className="text-sm font-bold text-blue-400 mt-2 uppercase">Est. Monthly Savings</p>
        </div>

        {/* Filtered & Bottled Water */}
        <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-100 text-center shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-4 uppercase tracking-wide">
            Filtered & Bottled Water
          </h3>
          <p className="text-5xl md:text-6xl font-black text-blue-600">
            ${savings.water.toFixed(2)}
          </p>
          <p className="text-sm font-bold text-blue-400 mt-2 uppercase">Est. Monthly Cost</p>
        </div>
      </div>

      {/* Comparison Inactive Buttons */}
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

      <p className="text-gray-400 font-medium italic text-center">
        *Based on the data provided earlier in the presentation.
      </p>
    </div>
  );
}