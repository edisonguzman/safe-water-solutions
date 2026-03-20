"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function Slide_ThankYou() {
  const { state } = usePresentation();

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-blue-900">
          {state.prospectInfo.firstName1} {state.prospectInfo.firstName2 ? `& ${state.prospectInfo.firstName2}` : ''}
        </h2>
        <p className="text-xl text-gray-500 font-medium">
          That concludes our water test and analysis.
        </p>
      </div>

      <div className="bg-blue-600 p-12 rounded-[3rem] shadow-2xl transform hover:scale-105 transition-transform">
        <h1 className="text-7xl font-black text-white mb-4">THANK YOU</h1>
        <p className="text-blue-100 text-2xl font-medium tracking-wide">
          For your time and attention today.
        </p>
      </div>

      <h3 className="text-3xl font-bold text-gray-800 pt-8 border-t-2 border-gray-100 w-full max-w-md">
        Do you have any questions?
      </h3>
    </div>
  );
}