"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function Slide1_ProspectInfo() {
  const { state, updateState } = usePresentation();

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState("prospectInfo", { [e.target.name]: e.target.value });
  };

  const handleTestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateState("waterTestResults", { [e.target.name]: e.target.value });
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 overflow-y-auto pb-8">
      
      {/* Left Column: Images & Source Selection */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500 shadow-inner">
          [Image: Child drinking water]
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">Water Source</h3>
          <div className="flex gap-4">
            <button
              onClick={() => updateState("waterSource", "Well Water")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                state.waterSource === "Well Water"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              Well Water
            </button>
            <button
              onClick={() => updateState("waterSource", "City Water")}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                state.waterSource === "City Water"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              City Water
            </button>
          </div>
        </div>

        <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500 shadow-inner">
          [Image: Dishwasher/Glasses]
        </div>
      </div>

      {/* Right Column: Data Entry Form */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        
        {/* Prospect Information Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Prospect Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner 1 Name</label>
              <input type="text" name="partner1Name" value={state.prospectInfo.partner1Name} onChange={handleInfoChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner 2 Name</label>
              <input type="text" name="partner2Name" value={state.prospectInfo.partner2Name} onChange={handleInfoChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="address" value={state.prospectInfo.address} onChange={handleInfoChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" value={state.prospectInfo.email} onChange={handleInfoChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Household Size (# of People)</label>
              <input type="number" min="1" name="householdSize" value={state.prospectInfo.householdSize} onChange={handleInfoChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50 font-bold" />
            </div>
          </div>
        </div>

        {/* Water Test Results Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Current Utility Grade Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TDS</label>
              <input type="text" name="tds" value={state.waterTestResults.tds} onChange={handleTestChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 394" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hardness</label>
              <input type="text" name="hardness" value={state.waterTestResults.hardness} onChange={handleTestChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 19" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">pH</label>
              <input type="text" name="ph" value={state.waterTestResults.ph} onChange={handleTestChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 7.5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chlorine</label>
              <input type="text" name="chlorine" value={state.waterTestResults.chlorine} onChange={handleTestChange} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 1" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}