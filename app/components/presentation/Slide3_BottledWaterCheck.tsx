"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

interface BottledWaterProps {
  onNext: () => void;
}

export default function Slide3_BottledWaterCheck({ onNext }: BottledWaterProps) {
  const { state, updateState } = usePresentation();

  const handleSelection = (buysBottled: boolean) => {
    // Save the preference to context so Slide 4 (Costs) can use it later
    updateState("waterCostPreferences", { buysBottled });
    // Automatically move to the next slide
    onNext();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
      <h2 className="text-4xl md:text-6xl font-black text-blue-900 tracking-tight">
        Do You Buy Bottled Water?
      </h2>

      {/* Image Placeholder */}
      <div className="w-full max-w-lg aspect-video bg-gray-100 rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center shadow-inner">
        <span className="text-gray-400 font-medium text-lg text-center p-6">
          [Image: Cases of bottled water or a water cooler]
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-6 w-full max-w-md">
        <button
          onClick={() => handleSelection(true)}
          className="flex-1 py-6 bg-blue-600 text-white text-2xl font-bold rounded-2xl shadow-xl hover:bg-blue-700 hover:scale-105 transition-all active:scale-95"
        >
          YES
        </button>
        <button
          onClick={() => handleSelection(false)}
          className="flex-1 py-6 bg-white text-blue-600 border-4 border-blue-600 text-2xl font-bold rounded-2xl shadow-xl hover:bg-blue-50 hover:scale-105 transition-all active:scale-95"
        >
          NO
        </button>
      </div>
    </div>
  );
}