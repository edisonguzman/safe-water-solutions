"use client";

import React from "react";
import { motion } from "framer-motion"; // Optional: for smooth slide transitions

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col min-h-full w-full max-w-4xl mx-auto px-4 pb-24 pt-6 ${containerClassName}`}
    >
      {/* Slide Header Area */}
      {(title || subtitle) && (
        <div className="mb-8 text-center sm:text-left">
          {title && (
            <h1 className="text-3xl md:text-4xl font-black text-blue-900 tracking-tight uppercase">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg text-gray-600 mt-2 font-medium">
              {subtitle}
            </p>
          )}
          <div className="h-1 w-20 bg-blue-600 mt-4 rounded-full mx-auto sm:mx-0"></div>
        </div>
      )}

      {/* Main Slide Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Note: Navigation (Next/Back) usually lives in the page.tsx 
          or a fixed footer to ensure it's always reachable on tablet. */}
    </motion.div>
  );
}