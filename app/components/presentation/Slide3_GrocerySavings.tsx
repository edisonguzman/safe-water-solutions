"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function Slide3_GrocerySavings() {
  const { state, updateState } = usePresentation();

  // Handle the grocery bill input
  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateState("financialInputs", { [e.target.name]: value });
  };

  // Handle percentage selection
  const setPercentage = (pct: number) => {
    updateState("financialInputs", { productPercentage: pct });
  };

  // Dynamic Math Calculations
  const weeklyGrocery = state.financialInputs?.weeklyGroceryBill || 0;
  const productPct = state.financialInputs?.productPercentage || 0.15; // fallback to 15%
  
  const weeklyProducts = weeklyGrocery * productPct;
  const monthlySpend = weeklyProducts * 4;     // Standard 4-week month
  const monthlySavings = monthlySpend * 0.75;  // 75% savings with soft water

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 overflow-y-auto pb-8">
      
      {/* Left Column: Visuals */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <h2 className="text-3xl font-black text-blue-900 leading-tight">
          Bring great water into your life so you can <br/>
          <span className="text-blue-600 uppercase">put away the products.</span>
        </h2>
        
        <p className="text-lg text-gray-700 font-medium">
          Families spend a significant portion of their grocery bill on cleaning and personal care products that simply don't work as well in "Tap Grade" water.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {["Shampoos", "Body Wash", "Lotions", "Cleaners", "Dish Soap", "Laundry"].map((item) => (
            <div key={item} className="bg-gray-100 h-24 rounded-lg flex items-center justify-center text-gray-400 text-[10px] uppercase font-bold text-center p-2 border border-gray-200">
              [Image: {item}]
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Calculator */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-3xl border-2 border-blue-50 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Savings Calculator
          </h3>

          <div className="space-y-6">
            
            {/* Step 1: Input */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Weekly Grocery Bill
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">$</span>
                <input
                  type="number"
                  name="weeklyGroceryBill"
                  value={state.financialInputs?.weeklyGroceryBill || ""}
                  onChange={handleFinancialChange}
                  className="w-full pl-10 p-4 text-3xl border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none bg-gray-50 font-black text-blue-600 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Step 2: Percentage Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center block">
                % Spent on Cleaning/Personal Care
              </label>
              <div className="flex gap-2">
                {[0.10, 0.15, 0.20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setPercentage(pct)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      productPct === pct 
                        ? "bg-blue-600 text-white shadow-lg scale-105" 
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {pct * 100}%
                  </button>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-blue-50/50 p-5 rounded-2xl space-y-3 border border-blue-100">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Weekly Product Spend:</span>
                <span className="text-blue-800">${weeklyProducts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Monthly Product Spend:</span>
                <span className="text-blue-800">${monthlySpend.toFixed(2)}</span>
              </div>
            </div>

            {/* Final Savings */}
            <div className="flex flex-col items-center bg-green-500 p-6 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-transform">
              <span className="text-green-100 font-bold uppercase tracking-widest text-xs mb-1">
                Your Monthly Savings
              </span>
              <span className="text-5xl font-black text-white">
                ${monthlySavings.toFixed(2)}
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}