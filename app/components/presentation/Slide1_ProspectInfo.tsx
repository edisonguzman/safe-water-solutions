"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function Slide1_ProspectInfo() {
  const { state, updateState } = usePresentation();

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState("prospectInfo", { [e.target.name]: e.target.value });
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-8 overflow-y-auto pb-8">
      
      {/* Left Column: Visuals & Water Source */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-500 shadow-inner overflow-hidden">
          {/* Placeholder for branding or family image */}
          <div className="text-center p-4 italic">"Quality water for your family's future."</div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-sm">
          <h3 className="font-semibold text-blue-900 mb-3 text-lg">Water Source</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => updateState("waterSource", "Well Water")}
              className={`w-full py-4 rounded-lg font-bold transition-all ${
                state.waterSource === "Well Water"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              Well Water
            </button>
            <button
              onClick={() => updateState("waterSource", "City Water")}
              className={`w-full py-4 rounded-lg font-bold transition-all ${
                state.waterSource === "City Water"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-blue-800 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              City Water
            </button>
          </div>
          <p className="text-xs text-blue-600 mt-3 text-center italic">
            *Source affects filtration logic and formulas
          </p>
        </div>
      </div>

      {/* Right Column: Detailed Data Entry */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-6">Prospect Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Person 1 */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Title</label>
              <input type="text" name="title1" placeholder="Mr." value={state.prospectInfo.title1 || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase">First Name</label>
              <input type="text" name="firstName1" value={state.prospectInfo.firstName1 || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Last Name</label>
              <input type="text" name="lastName1" value={state.prospectInfo.lastName1 || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Person 2 */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Title</label>
              <input type="text" name="title2" placeholder="Mrs." value={state.prospectInfo.title2 || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase">First Name</label>
              <input type="text" name="firstName2" value={state.prospectInfo.firstName2 || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Last Name</label>
              <input type="text" name="lastName2" value={state.prospectInfo.lastName2 || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Address Details */}
            <div className="md:col-span-6 mt-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Street Address</label>
              <input type="text" name="address" value={state.prospectInfo.address || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase">City</label>
              <input type="text" name="city" value={state.prospectInfo.city || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase">State</label>
              <input type="text" name="state" placeholder="FL" value={state.prospectInfo.state || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Zip</label>
              <input type="text" name="zip" value={state.prospectInfo.zip || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {/* Contact & Household */}
            <div className="md:col-span-3 mt-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
              <input type="tel" name="phone" placeholder="(555) 555-5555" value={state.prospectInfo.phone || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-3 mt-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Email Address</label>
              <input type="email" name="email" value={state.prospectInfo.email || ""} onChange={handleInfoChange} className="w-full p-2 border rounded border-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-6 mt-2">
              <label className="block text-sm font-bold text-blue-900">Total People in Household</label>
              <input type="number" name="householdSize" min="1" value={state.prospectInfo.householdSize || 1} onChange={handleInfoChange} className="w-full p-3 border rounded-lg border-blue-200 bg-blue-50 text-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 text-center" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}