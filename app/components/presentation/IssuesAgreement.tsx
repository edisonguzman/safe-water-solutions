"use client";

import React from "react";
import { usePresentation } from "@/app/context/PresentationContext";

interface IssuesAgreementProps {
  onNext: () => void;
}

export default function IssuesAgreement({ onNext }: IssuesAgreementProps) {
  const { updateState } = usePresentation();

  const handleSelection = (agreesWithIssues: boolean) => {
    // Save the agreement status to context for the CRM/Final summary
    updateState("waterIssuesAgreement", { agreesWithIssues });
    // Proceed to the next slide
    onNext();
  };

  return (
    <div 
      className="h-full w-full flex flex-col items-center justify-center text-center relative"
      style={{    
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Light overlay to maintain text contrast against background.jpg */}
      <div className="absolute inset-0 bg-white/40 z-0" />

      <div className="relative z-10 px-6 max-w-5xl space-y-12">
        <h2 className="text-4xl md:text-4xl font-black text-blue-900 tracking-tight leading-tight drop-shadow-sm">
          Would You agree that we have found some issues with your water today?
        </h2>

        {/* Action Buttons */}
        <div className="flex gap-8 w-full max-w-2xl mx-auto">
          <button
            onClick={() => handleSelection(true)}
            className="flex-1 py-8 bg-blue-600 text-white text-3xl font-bold rounded-3xl shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 uppercase tracking-wide"
          >
            Yes
          </button>
          <button
            onClick={() => handleSelection(false)}
            className="flex-1 py-8 bg-white text-blue-600 border-4 border-blue-600 text-3xl font-bold rounded-3xl shadow-2xl hover:bg-blue-50 hover:scale-105 transition-all active:scale-95 uppercase tracking-wide"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}