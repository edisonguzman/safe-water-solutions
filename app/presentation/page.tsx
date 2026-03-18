"use client";

import React, { useState } from "react";
// This is the line that was missing or broken!
import { usePresentation } from "@/app/context/PresentationContext";

// We will build these individual slide components next. 
// For now, I've created inline placeholders so the app compiles successfully.
import Slide1_ProspectInfo from "@/app/components/presentation/Slide1_ProspectInfo";
import Slide2_WaterCosts from "@/app/components/presentation/Slide2_WaterCosts";
import Slide3_GrocerySavings from "@/app/components/presentation/Slide3_GrocerySavings";
import Slide4_DailySavings from "@/app/components/presentation/Slide4_DailySavings";
import Slide5_Summary from "@/app/components/presentation/Slide5_Summary";

export default function PresentationViewer() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // Now Next.js knows exactly where usePresentation comes from
  const { state } = usePresentation();

  // As we build the real slides, we will replace these placeholders 
  // with the actual imported components.
  const slides = [
   <Slide1_ProspectInfo key="s1" />,
   <Slide2_WaterCosts key="s2" />,
   <Slide3_GrocerySavings key="s3" />,
   <Slide4_DailySavings key="s4" />,
   <Slide5_Summary key="s5" />
  ];

  const totalSlides = slides.length;

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitToCRM = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state), // We pass the entire global context state!
      });

      const data = await response.json();

      if (data.success) {
        alert("Success! Prospect saved to CRM.");
        // Next step will be adding the Resend email trigger here
      } else {
        alert("Error saving to database. Check console.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-gray-900 overflow-hidden font-sans">
      
{/* Top Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md z-10">
        <div className="flex justify-center items-center max-w-6xl mx-auto w-full">
          <h1 className="text-xl font-bold tracking-wide">Peace of Mind in Every Drop</h1>
        </div>
      </header>

      {/* Main Slide Content Area */}
      <main className="flex-grow overflow-y-auto p-6 md:p-12 flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-5xl h-full bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
          {slides[currentSlideIndex]}
        </div>
      </main>

      {/* Bottom Navigation Controls */}
      <footer className="bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className={`px-8 py-4 rounded-lg text-lg font-semibold transition-colors ${
              currentSlideIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
            }`}
          >
            ← Previous
          </button>

         {currentSlideIndex === totalSlides - 1 ? (
            <button
              onClick={handleSubmitToCRM}
              disabled={isSubmitting}
              className={`px-8 py-4 rounded-lg text-lg font-semibold text-white shadow-md transition-colors ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Send Results to CRM ✓'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-4 rounded-lg text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md"
            >
              Next →
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}