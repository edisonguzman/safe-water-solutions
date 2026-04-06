"use client";

import React, { useState } from "react";
import { PresentationProvider, usePresentation } from "@/app/context/PresentationContext";
import { SignOutButton } from "@clerk/nextjs";
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
import IssuesAgreement from "@/app/components/presentation/IssuesAgreement";
import HardWaterDefinition from "@/app/components/presentation/HardWaterDefinition";
import HomeownerPriorities from "@/app/components/presentation/HomeownerPriorities";
import ValueAffordability from "@/app/components/presentation/ValueAffordability";
import SendReport from "@/app/components/presentation/SendReport";
import CostComparison from "@/app/components/presentation/CostComparison";


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

  // Updated source of truth for your slides
  const slides = [
    <Slide1_ProspectInfo key="s1" />, // Slide 1
    <Slide2_HelpRequest key="s2" />, // Slide 2
    <Slide3_BottledWaterCheck key="s3" onNext={handleNext} />, // Slide 3
    <Slide2_WaterCosts key="s4" />, // Slide 4
    <Slide_ThreeTypes key="s5" />, // Slide 5
    <Slide_WaterTestResults key="s6" />, // Slide 6
    <Slide4_DailySavings key="s8" />, // Slide 7
    <Slide3_GrocerySavings key="s7" />, // Slide 8
    <IssuesAgreement key="issues-agree" onNext={handleNext} />, // Slide 9
    <HardWaterDefinition key="hard-water-def" onNext={handleNext} />, // Slide 10
    <Slide_ThankYou key="thanks" />, // Slide 11
    <HomeownerPriorities key="priorities" />, // Slide 12
    <ValueAffordability key="value-afford" onNext={handleNext} />, // Slide 13
    <CostComparison key="cost-comparison" />, // Slide 14
    <Slide_HomeBenefits key="s_benefits" onNext={handleNext} />,
    <Slide_Summary key="summary" />,
    <Slide5_Summary key="s9" />,
    <SendReport key="send-report" onNext={handleNext} />,
    
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
    <div className="flex flex-col min-h-screen w-full bg-white text-gray-900 font-sans">
      <header className="bg-blue-600 text-white p-4 shadow-md z-10 shrink-0">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
          <div className="w-12 md:w-24"></div>
          <h1 className="text-lg md:text-xl font-bold tracking-wide text-center">Peace of Mind in Every Drop</h1>
          <div className="w-12 md:w-24 text-right">
            <SignOutButton>
              <button className="text-[10px] md:text-xs bg-blue-700 hover:bg-blue-800 px-2 py-1 md:px-3 md:py-1 rounded">Logout</button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Changed: 
          1. items-start + mt-4 ensures slides don't "float" too high on portrait iPads.
          2. p-4 on mobile/tablet to maximize slide real estate.
      */}
      <main className="flex-grow p-4 md:p-8 flex justify-center items-start md:items-center bg-gray-50 overflow-y-auto">
        {/* Changed: 
            1. max-w-4xl (896px) is the "sweet spot" for iPad landscape and portrait.
            2. mb-24 provides a buffer so the fixed footer doesn't cover slide content.
        */}
        <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl border border-gray-100 p-5 md:p-10 mb-24 md:mb-0">
          {slides[currentSlideIndex]}
        </div>
      </main>

      {/* Changed: 
          Fixed bottom on all screens ensures the salesperson always has 
          the "Next" button visible without scrolling.
      */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className={`px-6 py-3 md:px-10 md:py-4 rounded-xl text-base md:text-lg font-bold transition-all ${
              currentSlideIndex === 0
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-gray-50 text-gray-700 border border-gray-200 active:scale-95"
            }`}
          >
            ← Back
          </button>

          {currentSlideIndex === totalSlides - 1 ? (
            <button
              onClick={handleSubmitToCRM}
              disabled={isSubmitting}
              className={`px-6 py-3 md:px-10 md:py-4 rounded-xl text-base md:text-lg font-bold text-white shadow-lg transition-all active:scale-95 ${
                isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Finish & Send ✓'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 md:px-10 md:py-4 rounded-xl text-base md:text-lg font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition-all active:scale-95"
            >
              Next Slide →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}