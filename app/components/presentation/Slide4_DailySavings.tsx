"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function Slide4_DailySavings() {
  const { state, updateState } = usePresentation();

  // We allow them to update the household size here just in case they need to tweak it
  const handlePeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    updateState("prospectInfo", { householdSize: value });
  };

  // Math logic based on Page 6 of the PDF
  const people = state.prospectInfo.householdSize || 1;
  const savingsPerPersonPerDay = 0.75; 
  const dailyTotal = people * savingsPerPersonPerDay;
  const monthlySavings = dailyTotal * 30;
  const yearlySavings = monthlySavings * 12;

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 overflow-y-auto pb-8">
      
      {/* Left Column: Visuals & Savings Percentages */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-blue-900 leading-tight">
          The value of treated water travels  
          <span className="text-blue-600"> throughout your entire home.</span>
        </h2>
        
        {/* Savings Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
            
              <img 
  src="/images/presentation/water-heater.jpg" 
  alt="Water heater" 
  className="w-full h-full object-cover rounded-xl"
/>
            
            <span className="font-semibold text-gray-800 text-sm">Energy savings on water heaters:</span>
            <span className="text-blue-600 font-bold mt-1">Electric: 21% | Gas: 29%</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
            <img 
  src="/images/presentation/clothing-linen.jpg" 
  alt="Clthing Linen" 
  className="w-full h-full object-cover rounded-xl"
/>
            <span className="font-semibold text-gray-800 text-sm">Savings on all linens & clothing:</span>
            <span className="text-blue-600 font-bold mt-1">15 - 30%</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
           <img 
  src="/images/presentation/plumbing.jpg" 
  alt="Plumbing" 
  className="w-full h-full object-cover rounded-xl"
/>
            <span className="font-semibold text-gray-800 text-sm">Replacement plumbing & fixtures:</span>
            <span className="text-blue-600 font-bold mt-1">25 - 75%</span>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
             <img 
  src="/images/presentation/shaving.jpg" 
  alt="Shaving" 
  className="w-full h-full object-cover rounded-xl"
/>
            <span className="font-semibold text-gray-800 text-sm">Extended razor blade life:</span>
            <span className="text-blue-600 font-bold mt-1">50 - 66%</span>
          </div>
        </div>
      </div>

      {/* Right Column: The Interactive Calculator */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
            How much can you save?
          </h3>
          
          <p className="text-gray-600 font-medium mb-6">
            Families easily average $0.75 - $1.00 per day of savings for each person in the home.
          </p>

          <div className="space-y-6">
            
            {/* Household Size Input (Synced with Slide 1) */}
            <div className="flex items-center justify-between gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <label className="text-lg font-medium text-blue-900 w-1/2">
                Number of People in the Home:
              </label>
              <input
                type="number"
                min="1"
                value={people}
                onChange={handlePeopleChange}
                className="w-1/3 p-3 text-2xl text-center border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold text-blue-700 shadow-inner"
              />
            </div>

            {/* Math Breakdown */}
            <div className="pl-4 border-l-4 border-gray-200 space-y-4">
              <div className="flex justify-between items-center text-gray-600">
                <span>Amount Saved Every Day:</span>
                <span className="font-semibold text-lg">x $0.75</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Daily Total:</span>
                <span className="font-semibold text-lg">${dailyTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Days per Month:</span>
                <span className="font-semibold text-lg">x 30</span>
              </div>
            </div>

            <hr className="border-t-2 border-gray-200 my-4" />

            {/* Final Savings Results */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-green-50 p-4 rounded-xl border border-green-200">
                <span className="text-green-800 font-semibold text-lg">Monthly Savings:</span>
                <span className="text-3xl font-black text-green-600">
                  ${monthlySavings.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <span className="text-gray-600 font-semibold text-lg">Yearly Savings:</span>
                <span className="text-2xl font-black text-gray-500">
                  ${yearlySavings.toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}