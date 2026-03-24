"use client";

import React from "react";

interface SlideMasterProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  containerClassName?: string;
}

export default function SlideMaster({ 
  children, 
  title, 
  subtitle,
  containerClassName = "" 
}: SlideMasterProps) {
  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-2 ${containerClassName}`}>
      {/* Slide Header - Reduced margins */}
      {(title || subtitle) && (
        <div className="mb-4 text-left">
          {title && (
            <h1 className="text-2xl md:text-3xl font-black text-blue-900 tracking-tight uppercase">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Main Slide Content - No forced height */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}