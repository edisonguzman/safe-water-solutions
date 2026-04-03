"use client";

import React from "react";

export default function HomeownerPriorities() {
  const priorities = [
    "Cost of ownership",
    "Affordability",
    "Where it's made",
    "Low maintenance",
    "Full Service",
    "Certified Performance"
  ];

  return (
    // Changed h-full to min-h-full and adjusted padding for tablet margins
    <div className="min-h-full w-full flex flex-col items-center justify-center bg-white p-4 md:p-8">
      <div className="w-full max-w-4xl flex flex-col items-center space-y-6 md:space-y-8">
        
        {/* Title: Ensured leading-tight and responsive text sizing */}
        <h2 className="text-3xl md:text-5xl lg:text-4xl font-black text-blue-900 tracking-tight text-center leading-tight">
          Here's What Home Owners Tell Us Is Important:
        </h2>

        {/* Image: Adjusted max-height to ensure it doesn't push text off-screen on tablets */}
        <div className="w-full max-w-xl rounded-3xl overflow-hidden shadow-xl border-2 border-gray-50 aspect-video md:max-h-[30vh]">
          <img 
            src="/images/presentation/family2.jpg" 
            alt="Happy Family" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Priorities List: Tightened gap for tablet-first view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full max-w-3xl">
          {priorities.map((item, index) => (
            <div 
              key={index}
              className="flex items-center space-x-3 p-3 md:p-1 bg-blue-50 rounded-xl border border-blue-100"
            >
              <div className="h-2 w-2 md:h-3 md:w-3 bg-blue-600 rounded-full flex-shrink-0" />
              <span className="text-lg md:text-xl lg:text-2xl font-bold text-blue-900">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Button removed as requested - navigation is handled by the footer */}
      </div>
    </div>
  );
}