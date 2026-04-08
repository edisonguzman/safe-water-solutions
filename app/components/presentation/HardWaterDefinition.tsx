"use client";

import React from "react";

interface HardWaterDefinitionProps {
  onNext: () => void;
}

export default function HardWaterDefinition({ onNext }: HardWaterDefinitionProps) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-white p-8 md:p-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl w-full">
        
        {/* Left Column: Title/Text */}
        <div className="flex flex-col space-y-6 text-left">
          <h2 className="text-xl md:text-5xl font-black text-blue-900 tracking-tight leading-tight">
            Contaminants in Water
          </h2>
         
          
          <div className="pt-8">
 
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-100">
            <img 
              src="/images/presentation/contaminated-water-square.jpg" 
              alt="Contaminated Water Example" 
              className="w-full h-full object-cover aspect-square"
            />
          </div>
        </div>

      </div>
    </div>
  );
}