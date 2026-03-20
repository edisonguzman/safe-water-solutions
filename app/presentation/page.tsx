"use client";

import React, { useState } from "react";
import { PresentationProvider, usePresentation } from "@/app/context/PresentationContext";
import { SignOutButton } from "@clerk/nextjs";
// Import All Slide Components
import Slide1_ProspectInfo from "@/app/components/presentation/Slide1_ProspectInfo";
import Slide2_HelpRequest from "@/app/components/presentation/Slide2_HelpRequest";
import Slide3_BottledWaterCheck from "@/app/components/presentation/Slide3_BottledWaterCheck";
import Slide2_WaterCosts from "@/app/components/presentation/Slide2_WaterCosts"; // Note: Filename doesn't match Slide # yet
import Slide_ThreeTypes from "@/app/components/presentation/Slide_ThreeTypes";
import Slide_WaterTestResults from "@/app/components/presentation/Slide_WaterTestResults";
import Slide3_GrocerySavings from "@/app/components/presentation/Slide3_GrocerySavings";
import Slide4_DailySavings from "@/app/components/presentation/Slide4_DailySavings";
import Slide_HomeBenefits from "@/app/components/presentation/Slide_HomeBenefits";
import Slide_Summary from "@/app/components/presentation/Slide_Summary";
import Slide5_Summary from "@/app/components/presentation/Slide5_Summary";
import Slide_ThankYou from "@/app/components/presentation/Slide_ThankYou";


export default function PresentationPage() {
  return (
    <PresentationProvider>
      <PresentationViewer />
    </PresentationProvider>
  );
}

function PresentationViewer() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { state } = usePresentation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unified navigation function
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // ONE single source of truth for your slides
  const slides = [
    <Slide1_ProspectInfo key="s1" />,
    <Slide2_HelpRequest key="s2" />,
    <Slide3_BottledWaterCheck key="s3" onNext={handleNext} />,
    <Slide2_WaterCosts key="s4" />,
    <Slide_ThreeTypes key="s5" />,
    <Slide_WaterTestResults key="s6" />,
    <Slide3_GrocerySavings key="s7" />,
    <Slide4_DailySavings key="s8" />,
    <Slide_HomeBenefits key="s_benefits" onNext={handleNext} />,
    <Slide_Summary key="summary" />,
    <Slide5_Summary key="s9" />,
    <Slide_ThankYou key="thanks" />
  ];

  const totalSlides = slides.length;

  const handleSubmitToCRM = async () => {
    setIsSubmitting(true);

    // 1. Calculate the values needed for the email report
    const weeklyGrocery = state.financialInputs?.weeklyGroceryBill || 0;
    const productPct = state.financialInputs?.productPercentage || 0.15;
    const weeklyBottled = state.financialInputs?.weeklyBottledWaterCost || 0;
    const monthlyFilter = state.financialInputs?.monthlyFilterCost || 0;

    const monthlySavings = ((weeklyGrocery * productPct) * 4 * 0.75) + 
                           ((weeklyBottled * 4) + monthlyFilter);

    const savingsData = {
      monthly: monthlySavings,
      yearly: monthlySavings * 12
    };

    try {
      // 2. Save to your Neon Database
      const crmResponse = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      });

      // 3. Trigger the Resend Email
      // Note: We are passing 'state' and 'savings' as separate keys
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          state, 
          savings: savingsData 
        }),
      });

      const crmResult = await crmResponse.json();
      const emailResult = await emailResponse.json();

      if (crmResult.success) {
        // 4. Move to the Thank You slide automatically on success
        handleNext();
      } else {
        alert("There was an issue saving to the CRM, but the presentation is complete.");
      }
    } catch (error) {
      console.error("Final Submission Error:", error);
      alert("A network error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-gray-900 overflow-hidden font-sans">
      <header className="bg-blue-600 text-white p-4 shadow-md z-10">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
          <div className="w-24"></div>
          <h1 className="text-xl font-bold tracking-wide">Peace of Mind in Every Drop</h1>
          <div className="w-24 text-right">
            <SignOutButton>
              <button className="text-xs bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">Logout</button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-6 md:p-12 flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-5xl h-full bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
          {slides[currentSlideIndex]}
        </div>
      </main>

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