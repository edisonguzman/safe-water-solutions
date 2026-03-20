"use client";

import React from "react";

export default function Slide2_HelpRequest() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-black text-blue-900 tracking-tight">
        I Need Your Help
      </h2>
      
      <p className="text-xl text-gray-600 max-w-2xl">
        To accurately show you the impact of your current water, I'll need a few items from your kitchen and linen closet:
      </p>

      {/* Image Placeholders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-4">
        
        {/* Item 1 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 shadow-sm">
            <span className="text-gray-400 font-medium">[Image: Glass Bowl]</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Glass Bowl</h3>
        </div>

        {/* Item 2 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 shadow-sm">
            <span className="text-gray-400 font-medium">[Image: Water Glass]</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Water Glass</h3>
        </div>

        {/* Item 3 */}
        <div className="flex flex-col items-center">
          <div className="w-full aspect-square bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 shadow-sm">
            <span className="text-gray-400 font-medium">[Image: Towels]</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 uppercase tracking-wide leading-tight">
            Washcloth & <br/> Bath Towel
          </h3>
        </div>

      </div>
    </div>
  );
}