"use client";

import React from "react";

export default function Slide_ThreeTypes() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
      {/* Main Title */}
      <h2 className="text-4xl md:text-6xl font-black text-blue-900 tracking-tight">
        Three Types of Water
      </h2>

      <p className="text-xl text-gray-600 max-w-3xl">
        Most people think water is just water, but in a modern home, we actually categorize it into three distinct grades:
      </p>

      {/* Three Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-4">
        
        {/* Type 1: Tap */}
        <div className="flex flex-col items-center group">
          <div className="w-full aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-300 transition-colors">
            <img 
  src="/images/presentation/Kitchen-Tap.jpg" 
  alt="Kitchen Tap" 
  className="w-full h-full object-cover rounded-xl"
/>
          </div>
          <div className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-3">
            Level 1
          </div>
          <h3 className="text-3xl font-black text-gray-800 uppercase tracking-wide">Tap</h3>
          <p className="text-gray-500 mt-2 text-sm px-4">Utility grade water for basic needs.</p>
        </div>

        {/* Type 2: Working Grade */}
        <div className="flex flex-col items-center group">
          <div className="w-full aspect-video bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 flex items-center justify-center mb-6 shadow-sm group-hover:border-blue-400 transition-colors">
            <img 
  src="/images/presentation/Shower-Appliances.jpg" 
  alt="Shower & Appliances" 
  className="w-full h-full object-cover rounded-xl"
/>
          </div>
          <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-3">
            Level 2
          </div>
          <h3 className="text-3xl font-black text-blue-800 uppercase tracking-wide">Working Grade</h3>
          <p className="text-gray-500 mt-2 text-sm px-4">Softened water that protects your home.</p>
        </div>

        {/* Type 3: Food Grade */}
        <div className="flex flex-col items-center group">
          <div className="w-full aspect-video bg-green-50 rounded-2xl border-2 border-dashed border-green-200 flex items-center justify-center mb-6 shadow-sm group-hover:border-green-400 transition-colors">
           <img 
  src="/images/presentation/purified-water.jpg" 
  alt="Purified Water" 
  className="w-full h-full object-cover rounded-xl"
/>
          </div>
          <div className="bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-3">
            Level 3
          </div>
          <h3 className="text-3xl font-black text-green-800 uppercase tracking-wide">Food Grade</h3>
          <p className="text-gray-500 mt-2 text-sm px-4">High-purity water for consumption.</p>
        </div>

      </div>
    </div>
  );
}