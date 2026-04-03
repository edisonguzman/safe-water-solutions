"use client";

import React from "react";

interface ValueAffordabilityProps {
  onNext: () => void;
}

export default function ValueAffordability({ onNext }: ValueAffordabilityProps) {
  const conceptualBlocks = [
    "Need",
    "Equipment",
    "Value",
    "Warrantee"
  ];

  return (
    <div 
      className="h-full w-full flex flex-col items-center justify-center text-center relative p-6 md:p-12"
      style={{ 
        backgroundImage: "url('/images/presentation/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Light overlay to maintain text contrast against background.jpg */}
      <div className="absolute inset-0 bg-white/50 z-0" />

      <div className="relative z-10 px-6 max-w-5xl w-full flex flex-col items-center space-y-12 md:space-y-16">
        
        {/* Main Title */}
        <h2 className="text-5xl md:text-7xl font-black text-blue-900 tracking-tight leading-tight drop-shadow-sm">
          Need, Value and Affordability
        </h2>

        {/* Inactive Buttons Grid - Tablet optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl mx-auto">
          {conceptualBlocks.map((block, index) => (
            <div 
              key={index}
              className="flex items-center justify-center py-8 px-6 bg-white/80 text-blue-950 border-2 border-blue-200/50 text-3xl md:text-4xl font-extrabold rounded-3xl shadow-lg uppercase tracking-wider"
              style={{
                // Explicitly defining 'inactive' visual style beyond Tailwind
                cursor: 'default',
                userSelect: 'none'
              }}
            >
              {block}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}