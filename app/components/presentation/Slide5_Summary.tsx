"use client";

import React, { useState } from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function Slide5_Summary() {
  const { state } = usePresentation();

  // Local state for the sales rep to input the system pricing on the fly
  const [systemPrice, setSystemPrice] = useState<number | "">("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | "">("");

  // Aggregate all the savings from the previous slides
  const foodWaterSavings = (state.financialInputs.weeklyBottledWaterCost * 4) + state.financialInputs.monthlyFilterCost;
  const grocerySavings = (state.financialInputs.weeklyGroceryBill * 0.15 * 4) * 0.75;
  const dailySavings = (state.prospectInfo.householdSize * 0.75) * 30;
  
  const totalMonthlySavings = foodWaterSavings + grocerySavings + dailySavings;
  
  // Time-based savings projections
  const oneYearSavings = totalMonthlySavings * 12;
  const fiveYearSavings = totalMonthlySavings * 60;
  const tenYearSavings = totalMonthlySavings * 120;

  // Net calculations for the close
  const tenYearNet = tenYearSavings - (typeof systemPrice === "number" ? systemPrice : 0);
  const monthlyNet = totalMonthlySavings - (typeof monthlyPayment === "number" ? monthlyPayment : 0);

  return (
    <div className="h-full flex flex-col overflow-y-auto pb-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Start today and enjoy <br/>
          <span className="text-blue-600 text-4xl mt-2 block">Your Life-Long Savings Plan</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 h-full">
        
        {/* Left Column: Paid in Full */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
          <h3 className="text-2xl font-bold text-center text-blue-900 mb-2">Total Investment Paid in Full</h3>
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
            <h4 className="font-semibold text-blue-800 text-center mb-2">Money Saved By Better Water</h4>
            <div className="flex justify-between text-gray-700"><span>1 Year:</span> <span className="font-bold">${oneYearSavings.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-700"><span>5 Years:</span> <span className="font-bold">${fiveYearSavings.toFixed(2)}</span></div>
            <div className="flex justify-between text-blue-900 text-lg border-t border-blue-200 pt-2 mt-2">
              <span className="font-bold">10 Years:</span> <span className="font-black">${tenYearSavings.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total One-Time Investment</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="number"
                min="0"
                value={systemPrice}
                onChange={(e) => setSystemPrice(parseFloat(e.target.value) || "")}
                className="w-full pl-8 p-4 text-2xl border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold"
                placeholder="0.00"
              />
            </div>
          </div>

          <hr className="border-t-2 border-gray-100 my-2" />

          <div className="flex flex-col items-center bg-green-50 p-6 rounded-xl border border-green-200 mt-auto">
            <span className="text-green-800 font-bold mb-1 uppercase tracking-wide">10-Year Net Savings!</span>
            <span className={`text-5xl font-black ${tenYearNet >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              ${tenYearNet.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Right Column: Easy-Pay Monthly */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
          <h3 className="text-2xl font-bold text-center text-green-900 mb-2">Easy-Pay Program with $0 Down</h3>
          
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col justify-center py-8">
            <h4 className="font-semibold text-green-800 text-center mb-4">Money Saved By Better Water</h4>
            <div className="flex justify-between items-center text-green-900 text-2xl">
              <span className="font-bold">Monthly:</span> 
              <span className="font-black">${totalMonthlySavings.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Monthly Investment Plan</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="number"
                min="0"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(parseFloat(e.target.value) || "")}
                className="w-full pl-8 p-4 text-2xl border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 outline-none font-bold"
                placeholder="0.00"
              />
            </div>
          </div>

          <hr className="border-t-2 border-gray-100 my-2" />

          <div className="flex flex-col items-center bg-blue-50 p-6 rounded-xl border border-blue-200 mt-auto">
            <span className="text-blue-800 font-bold mb-1 uppercase tracking-wide">Total Savings Per Month!</span>
            <span className={`text-5xl font-black ${monthlyNet >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
              ${monthlyNet.toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}