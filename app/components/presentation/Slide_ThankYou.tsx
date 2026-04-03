"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

interface ThankYouProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function Slide_ThankYou({ onNext, onPrev }: ThankYouProps) {
  const { state } = usePresentation();

  return (
    <div className="h-full flex flex-col items-center justify-between text-center py-12 animate-in fade-in zoom-in duration-700">
      
      {/* Top Section: Prospect Names */}
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-blue-900">
          {state.prospectInfo.firstName1} {state.prospectInfo.firstName2 ? `& ${state.prospectInfo.firstName2}` : ''}
        </h2>
        <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full" />
      </div>

      {/* Middle Section: Thank You Branding */}
      <div className="bg-blue-600 p-12 md:p-16 rounded-[3rem] shadow-2xl max-w-3xl mx-6">
        <h1 className="text-7xl md:text-6xl font-black text-white mb-4 uppercase tracking-tighter">
          Thank You
        </h1>
        <p className="text-blue-100 text-2xl md:text-3xl font-medium tracking-wide">
          For your time and attention today.
        </p>
      </div>

      {/* Bottom Section: Questions & Navigation */}
      <div className="w-full max-w-2xl px-6 space-y-10">
        <h3 className="text-3xl font-bold text-gray-800 pt-8 border-t-2 border-gray-100 w-full">
          Do you have any questions?
        </h3>

        {/* Local Navigation Buttons for Tablet-First accessibility */}
        <div className="flex gap-6 w-full">
          {onPrev && (
            <button
              onClick={onPrev}
              className="flex-1 py-6 bg-gray-100 text-gray-600 text-xl font-bold rounded-2xl shadow-md hover:bg-gray-200 transition-all active:scale-95"
            >
              ← PREVIOUS
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="flex-1 py-6 bg-blue-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 uppercase"
            >
              Finish Presentation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}