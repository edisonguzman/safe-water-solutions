"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function Slide2_WaterCosts() {
  const { state, updateState } = usePresentation();

  // Handle number inputs specifically so our math doesn't break
  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateState("financialInputs", { [e.target.name]: value });
  };

  // The live math calculation based on the PDF formula
  const weeklyBottled = state.financialInputs.weeklyBottledWaterCost;
  const monthlyFilter = state.financialInputs.monthlyFilterCost;
  const totalMonthlyCost = (weeklyBottled * 4) + monthlyFilter;

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 overflow-y-auto pb-8">
      
      {/* Left Column: Visuals & Educational Text */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-blue-900 leading-tight">
          The right water will improve your <br/>
          <span className="text-blue-600">Health, Home, Happiness, and Savings!</span>
        </h2>
        
        <p className="text-lg text-gray-700 font-medium">
          Leave the hassle behind and never run out of drinkable water.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center p-2 shadow-inner">
            [Image: Boiling Pasta]
          </div>
          <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center p-2 shadow-inner">
            [Image: Fridge Filter Change]
          </div>
          <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center p-2 shadow-inner">
            [Image: Clear vs Cloudy Tea]
          </div>
          <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500 text-sm text-center p-2 shadow-inner">
            [Image: Water Pitcher]
          </div>
        </div>
      </div>

      {/* Right Column: The Interactive Calculator */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            Your Food Grade Water Consumption
          </h3>

          <div className="space-y-6">
            {/* Weekly Bottled Water Input */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-lg font-medium text-gray-700 w-1/2">
                Weekly Bottled Water Cost:
              </label>
              <div className="relative w-1/2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  name="weeklyBottledWaterCost"
                  value={state.financialInputs.weeklyBottledWaterCost || ""}
                  onChange={handleFinancialChange}
                  className="w-full pl-8 p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50 font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* The "Multiplier" Display */}
            <div className="flex justify-end pr-4 text-gray-400 font-bold text-xl">
              X 4 weeks
            </div>

            {/* Monthly Filter Input */}
            <div className="flex items-center justify-between gap-4">
              <div className="w-1/2">
                <label className="text-lg font-medium text-gray-700 block">
                  Monthly Filter Cost:
                </label>
                <span className="text-xs text-gray-500">(Refrigerator / Pitcher / Faucet)</span>
              </div>
              <div className="relative w-1/2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  name="monthlyFilterCost"
                  value={state.financialInputs.monthlyFilterCost || ""}
                  onChange={handleFinancialChange}
                  className="w-full pl-8 p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50 font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>

            <hr className="border-t-2 border-gray-200 my-4" />

            {/* Live Calculation Result */}
            <div className="flex flex-col items-center bg-green-50 p-6 rounded-xl border border-green-200 mt-6">
              <span className="text-green-800 font-semibold mb-2">Total Monthly Food Grade Water Costs:</span>
              <span className="text-4xl font-black text-green-600">
                ${totalMonthlyCost.toFixed(2)}
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}