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

  // The live math calculation based exactly on Page 5 of the PDF
  const weeklyGrocery = state.financialInputs.weeklyGroceryBill;
  const weeklyProducts = weeklyGrocery * 0.15; // 15% goes to products
  const monthlySpend = weeklyProducts * 4;     // Multiply by 4 weeks
  const monthlySavings = monthlySpend * 0.75;  // 75% savings with soft water

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 overflow-y-auto pb-8">
      
      {/* Left Column: Visuals & Educational Text */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-blue-900 leading-tight">
          Bring great water into your life so you can <br/>
          <span className="text-blue-600">put away the products.</span>
        </h2>
        
        <p className="text-lg text-gray-700 font-medium">
          Families spend on average 15-20% of their total grocery bill on personal care and household cleaning products.
        </p>

        {/* Product Visual Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center text-gray-500 text-xs text-center p-2 shadow-inner">
            [Image: Shampoos & Conditioners]
          </div>
          <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center text-gray-500 text-xs text-center p-2 shadow-inner">
            [Image: Body Wash & Lotions]
          </div>
          <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center text-gray-500 text-xs text-center p-2 shadow-inner">
            [Image: Shaving Cream & Razors]
          </div>
          <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center text-gray-500 text-xs text-center p-2 shadow-inner">
            [Image: Glass & Bathroom Cleaners]
          </div>
          <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center text-gray-500 text-xs text-center p-2 shadow-inner">
            [Image: Dish Soap]
          </div>
          <div className="bg-gray-200 h-24 rounded-lg flex items-center justify-center text-gray-500 text-xs text-center p-2 shadow-inner">
            [Image: Laundry Detergent]
          </div>
        </div>
      </div>

      {/* Right Column: The Interactive Calculator */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            How much can you save with soft water?
          </h3>

          <div className="space-y-6">
            
            {/* Step 1: Grocery Bill Input */}
            <div className="flex items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-lg font-medium text-gray-700 w-1/2">
                Average Weekly Grocery Bill:
              </label>
              <div className="relative w-1/2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  name="weeklyGroceryBill"
                  value={state.financialInputs.weeklyGroceryBill || ""}
                  onChange={handleFinancialChange}
                  className="w-full pl-8 p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Math Breakdown Steps */}
            <div className="pl-4 border-l-4 border-blue-200 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Money Spent On Products (15%):</span>
                <span className="font-semibold">${weeklyProducts.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Monthly Spend (x 4 weeks):</span>
                <span className="font-semibold">${monthlySpend.toFixed(2)}</span>
              </div>
            </div>

            <hr className="border-t-2 border-gray-200 my-4" />

            {/* Final Savings Result */}
            <div className="flex flex-col items-center bg-green-50 p-6 rounded-xl border border-green-200">
              <span className="text-green-800 font-semibold mb-2">Monthly Savings (75% reduction):</span>
              <span className="text-4xl font-black text-green-600">
                ${monthlySavings.toFixed(2)}
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}