"use client";

import React from "react";
import Image from "next/image";
import { usePresentation } from "@/app/context/PresentationContext";
import { calculateMonthlySavings } from "@/app/lib/formulas";

export default function Slide3_GrocerySavings() {
  const { state, updateState } = usePresentation();

  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateState("financialInputs", { [e.target.name]: value });
  };

  const setPercentage = (pct: number) => {
    updateState("financialInputs", { productPercentage: pct });
  };

  // Use the library to calculate local display values
  const savings = calculateMonthlySavings(state);
  const productPct = savings.productPercentage; // Pulling the dynamic % from state
  
  const weeklyProducts = (state.financialInputs?.weeklyGroceryBill || 0) * productPct;
  const monthlySpend = weeklyProducts * 4;

  const productImages: Record<string, string> = {
    "Shampoos": "shampoos.jpg",
    "Body Wash": "body-wash.jpg",
    "Lotions": "lotions.jpg",
    "Cleaners": "cleaners.jpg",
    "Dish Soap": "dish-soap.jpg",
    "Laundry": "laundry.jpg",
    "Less Cleaning": "less-time-cleaning.jpg",
    "Beverages": "beverages.jpg",
    "Hair Care": "hair.jpg"
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 overflow-y-auto pb-8">
      {/* Left Column code remains same as your original snippet... */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
         {/* ... (Visuals Grid) ... */}
         <h2 className="text-3xl font-black text-blue-900 leading-tight">
          Bring great water into your life so you can <br/>
          <span className="text-blue-600 uppercase">put away the products.</span>
        </h2>
        <div className="grid grid-cols-3 gap-y-6 gap-x-3">
          {Object.entries(productImages).map(([label, fileName]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="relative w-full h-20 md:h-24 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <Image src={`/images/presentation/${fileName}`} alt={label} fill className="object-cover" sizes="(max-width: 768px) 33vw, 200px" />
              </div>
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-tight text-center leading-none">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Calculator */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-3xl border-2 border-blue-50 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Savings Calculator</h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Weekly Grocery Bill</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  name="weeklyGroceryBill"
                  value={state.financialInputs?.weeklyGroceryBill || ""}
                  onChange={handleFinancialChange}
                  className="w-full pl-10 p-4 text-3xl border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none bg-gray-50 font-black text-blue-900 transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wider text-center block">% Spent on Cleaning/Personal Care</label>
              <div className="flex gap-2">
                {[0.10, 0.15, 0.20].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setPercentage(pct)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      productPct === pct ? "bg-blue-600 text-white shadow-lg scale-105" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {pct * 100}%
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50/50 p-5 rounded-2xl space-y-3 border border-blue-100">
              <div className="flex justify-between text-gray-600 font-medium">
                <span>Weekly Product Spend:</span>
                <span className="text-blue-900 font-bold">${weeklyProducts.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium border-t border-blue-100 pt-2">
                <span>Monthly Product Spend:</span>
                <span className="text-blue-900 font-bold">${monthlySpend.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col items-center bg-green-500 p-6 rounded-2xl shadow-xl">
              <span className="text-green-100 font-bold uppercase tracking-widest text-[10px] mb-1">Your Projected Monthly Savings</span>
              <span className="text-5xl font-black text-white">${savings.soap.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}