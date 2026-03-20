"use client";

import React, { useState } from "react";
import { usePresentation } from "@/app/context/PresentationContext";
import { Info } from "lucide-react"; // npm install lucide-react if not present

export default function Slide_WaterTestResults() {
  const { state, updateState } = usePresentation();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState("waterTestResults", { [e.target.name]: e.target.value });
  };

  const isWell = state.waterSource === "Well Water";

  // Modal Content Mapping
  const modalContent: Record<string, { title: string; content: React.ReactNode }> = {
    hardness: {
      title: "Hard Water Levels (Grains per Gallon)",
      content: (
        <ul className="space-y-2 text-sm">
          <li><span className="font-bold">Soft:</span> Less than 1.0</li>
          <li><span className="font-bold">Slightly hard:</span> 1.0 - 3.5</li>
          <li><span className="font-bold">Moderately hard:</span> 3.5 - 7.0</li>
          <li><span className="font-bold">Hard:</span> 7.0 - 10.5</li>
          {!isWell && <li><span className="font-bold">Very Hard:</span> Over 10.5</li>}
        </ul>
      )
    },
    iron: {
      title: "Iron in Water",
      content: <p className="text-sm">Rusty color, sediment, metallic taste, reddish or orange staining.</p>
    },
    nitrates: {
      title: "Water Nitrate Levels",
      content: (
        <div className="text-sm space-y-2">
          <p><span className="font-bold">Normal:</span> Less than 1mg/L</p>
          <p className="italic text-gray-600">According to the EPA, these can be runoff from fertilizer use, leaching from septic tanks, or sewage erosion of natural deposits.</p>
        </div>
      )
    },
    tds: {
      title: "TDS (Total Dissolved Solids)",
      content: <p className="text-sm">Hardness; deposits; colored water, staining; salty taste.</p>
    },
    chlorine: {
      title: "Chlorine in Water",
      content: (
        <div className="text-sm space-y-2">
          <p className="font-bold">Why is chlorine added?</p>
          <p className="italic text-gray-600">According to the EPA, it's a water additive used to control microbes.</p>
        </div>
      )
    },
    ph: {
      title: "Water pH Levels",
      content: (
        <div className="text-sm space-y-2">
          <p><span className="font-bold">Low pH:</span> Bitter metallic taste, corrosion</p>
          <p><span className="font-bold">High pH:</span> Slippery feel, soda taste, deposits</p>
        </div>
      )
    }
  };

  const renderField = (label: string, name: string, placeholder: string, modalKey: string) => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">{label}</label>
        <button 
          onClick={() => setActiveModal(modalKey)}
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          <Info size={18} />
        </button>
      </div>
      <input
        type="number"
        step="0.1"
        name={name}
        value={(state.waterTestResults as any)[name] || ""}
        onChange={handleTestChange}
        placeholder={placeholder}
        className="w-full p-4 text-2xl border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none bg-gray-50 font-bold text-blue-900"
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col items-center justify-center relative p-4">
      <h2 className="text-4xl font-black text-blue-900 mb-2">Your Water Test Results</h2>
      <p className="text-gray-500 mb-10 font-medium">Source: <span className="text-blue-600 uppercase">{state.waterSource}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {isWell ? (
          <>
            {renderField("Hardness (gpg)", "hardness", "0.0", "hardness")}
            {renderField("Iron (ppm)", "iron", "0.0", "iron")}
            {renderField("Nitrates (mg/L)", "nitrates", "0.0", "nitrates")}
            {renderField("TDS (ppm)", "tds", "0", "tds")}
          </>
        ) : (
          <>
            {renderField("Hardness (gpg)", "hardness", "0.0", "hardness")}
            {renderField("Chlorine (ppm)", "chlorine", "0.0", "chlorine")}
            {renderField("pH Level", "ph", "7.0", "ph")}
            {renderField("TDS (ppm)", "tds", "0", "tds")}
          </>
        )}
      </div>

      {/* Pop-up Modal Overlay */}
      {activeModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/20 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md border-2 border-blue-100 shadow-2xl rounded-3xl p-8 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
            <h3 className="text-xl font-black text-blue-900 mb-4">{modalContent[activeModal].title}</h3>
            <div className="text-gray-700 leading-relaxed">
              {modalContent[activeModal].content}
            </div>
            <button 
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}