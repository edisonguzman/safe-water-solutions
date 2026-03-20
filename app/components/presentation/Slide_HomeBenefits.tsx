"use client";

import React from "react";

interface HomeBenefitsProps {
  onNext: () => void;
}

export default function Slide_HomeBenefits({ onNext }: HomeBenefitsProps) {
  return (
    <div className="h-full flex flex-col items-center overflow-y-auto pb-8">
      <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-8 text-center tracking-tight">
        How Water Affects Your Home and You
      </h2>

      {/* 6-Grid Benefits Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        
        {/* Benefit 1 */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-300 border-2 border-dashed border-blue-100 group-hover:border-blue-200">
            [Image: Smoother Skin/Shower]
          </div>
          <p className="text-gray-700 font-medium leading-relaxed">
            Skin feels smoother after hand washing, shave and shower with safe water.
          </p>
        </div>

        {/* Benefit 2 */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-300 border-2 border-dashed border-blue-100 group-hover:border-blue-200">
            [Image: Bright Laundry]
          </div>
          <p className="text-gray-700 font-medium leading-relaxed">
            Brighter clothes that dry faster, saves energy and saves on expensive laundry detergent.
          </p>
        </div>

        {/* Benefit 3 */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-300 border-2 border-dashed border-blue-100 group-hover:border-blue-200">
            [Image: Spotless Dishes]
          </div>
          <p className="text-gray-700 font-medium leading-relaxed">
            Reduced streaks and spots on dishes and glasses while saving time and effort.
          </p>
        </div>

        {/* Benefit 4 */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-300 border-2 border-dashed border-blue-100 group-hover:border-blue-200">
            [Image: Food/Coffee]
          </div>
          <p className="text-gray-700 font-medium leading-relaxed">
            Improved taste with food cooked, rinsed or beverages made with safe water.
          </p>
        </div>

        {/* Benefit 5 */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-300 border-2 border-dashed border-blue-100 group-hover:border-blue-200">
            [Image: Plumbing/Appliances]
          </div>
          <p className="text-gray-700 font-medium leading-relaxed">
            Significant savings on plumbing, appliance repair and energy for heating water.
          </p>
        </div>

        {/* Benefit 6 */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex flex-col items-center text-center group hover:shadow-md transition-shadow">
          <div className="w-full aspect-video bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-blue-300 border-2 border-dashed border-blue-100 group-hover:border-blue-200">
            [Image: Soap Savings]
          </div>
          <p className="text-gray-700 font-medium leading-relaxed">
            Savings on significant amount of money on soap and cleaning products every month.
          </p>
        </div>
      </div>

      {/* The Closing Question */}
      <div className="mt-12 w-full max-w-2xl bg-blue-900 rounded-3xl p-8 shadow-2xl text-center">
        <h3 className="text-white text-2xl font-bold mb-6">
          Do you see how safe water can benefit you and your home?
        </h3>
        <div className="flex gap-4">
          <button 
            onClick={onNext}
            className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white font-black text-xl rounded-xl transition-all active:scale-95"
          >
            YES
          </button>
          <button 
            onClick={onNext}
            className="flex-1 py-4 bg-transparent border-2 border-white/30 hover:bg-white/10 text-white font-bold text-xl rounded-xl transition-all"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}