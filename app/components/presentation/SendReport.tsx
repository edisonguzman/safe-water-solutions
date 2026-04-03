"use client";

import React, { useState, useEffect } from "react";
import { usePresentation } from "@/app/context/PresentationContext";

interface SendReportProps {
  onNext: () => void;
}

export default function SendReport({ onNext }: SendReportProps) {
  const { state } = usePresentation();
  const [status, setStatus] = useState<"idle" | "saving" | "synced" | "offline">("idle");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleAction = async () => {
    setStatus("saving");

    // 1. Calculate savings to match what the Email API expects
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

    const payload = {
      state,
      savings: savingsData,
      timestamp: new Date().toISOString()
    };

    if (isOnline) {
      try {
        // Save to CRM/Neon
        const crmResponse = await fetch("/api/prospects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });

        // Trigger Email with the specific structure your route.ts needs
        const emailResponse = await fetch("/api/send-email", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            state, 
            savings: savingsData 
          }) 
        });

        if (crmResponse.ok && emailResponse.ok) {
          setStatus("synced");
          setTimeout(onNext, 1500);
        } else {
          throw new Error("Partial failure");
        }
      } catch (e) {
        saveOffline(payload);
      }
    } else {
      saveOffline(payload);
    }
  };

  const saveOffline = (data: any) => {
    const existingQueue = JSON.parse(localStorage.getItem("offline_leads") || "[]");
    existingQueue.push(data);
    localStorage.setItem("offline_leads", JSON.stringify(existingQueue));
    setStatus("offline");
    setTimeout(onNext, 2000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-10">
      <h2 className="text-5xl md:text-7xl font-black text-blue-900 tracking-tight">
        Send Water Report
      </h2>

      <div className="w-full max-w-md p-8 bg-white rounded-3xl border-4 border-blue-100 shadow-inner">
        <p className="text-xl font-medium text-gray-500 mb-1">Customer Email:</p>
        <p className="text-1xl font-bold text-blue-900 break-all">
          {state.prospectInfo?.email || "No Email Provided"}
        </p>
        
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className={`h-4 w-4 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="text-sm font-black uppercase tracking-widest text-gray-600">
            {isOnline ? "Network Ready" : "Offline Mode"}
          </span>
        </div>
      </div>

      <button
        onClick={handleAction}
        disabled={status !== "idle"}
        className={`w-full max-w-lg py-8 rounded-[2rem] text-3xl font-black shadow-2xl transition-all active:scale-95 ${
          status === "idle" 
            ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-200" 
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {status === "idle" ? (isOnline ? "SEND REPORT" : "SAVE OFFLINE") : 
         status === "saving" ? "PROCESSING..." : "✓ COMPLETE"}
      </button>

      <p className="text-gray-400 font-semibold max-w-sm leading-relaxed">
        {isOnline 
          ? "Tapping this will update the CRM and send the homeowner their digital results immediately." 
          : "No cell service detected. The report will be saved to your tablet for later syncing."}
      </p>
    </div>
  );
}