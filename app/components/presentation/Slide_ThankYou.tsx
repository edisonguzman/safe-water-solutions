"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePresentation } from "@/app/context/PresentationContext";

export default function Slide_ThankYou() {
  const { state } = usePresentation();
  const hasSaved = useRef(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "saving" | "offline_saved" | "synced" | "error">("idle");

  useEffect(() => {
    async function handleSaveProcess() {
      if (hasSaved.current) return;
      setSyncStatus("saving");

      const payload = {
        waterSource: state.waterSource,
        prospectInfo: state.prospectInfo,
        waterTestResults: state.waterTestResults,
        financialInputs: state.financialInputs,
        timestamp: new Date().toISOString()
      };

      try {
        // 1. Attempt the Live Save
        const response = await fetch("/api/prospects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setSyncStatus("synced");
          hasSaved.current = true;
          // Optionally: Trigger the Email API here as well
          await fetch("/api/send-email", { 
            method: "POST", 
            body: JSON.stringify({ prospectId: (await response.json()).prospectId }) 
          });
        } else {
          throw new Error("Server reached but failed to save");
        }
      } catch (error) {
        // 2. Offline Fallback: Save to Local Storage
        console.warn("Offline or Connection Error. Saving locally...");
        
        const existingQueue = JSON.parse(localStorage.getItem("offline_leads") || "[]");
        existingQueue.push(payload);
        localStorage.setItem("offline_leads", JSON.stringify(existingQueue));
        
        setSyncStatus("offline_saved");
        hasSaved.current = true;
      }
    }

    handleSaveProcess();
  }, [state]);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-blue-900">
          {state.prospectInfo.firstName1} {state.prospectInfo.firstName2 ? `& ${state.prospectInfo.firstName2}` : ''}
        </h2>
        
        {/* Sync Status Badge for the Salesperson */}
        <div className="mt-4 flex justify-center">
          {syncStatus === "synced" && (
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold uppercase border border-green-200">
              ✓ Data Synced & Email Sent
            </span>
          )}
          {syncStatus === "offline_saved" && (
            <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-xs font-bold uppercase border border-amber-200">
              ⚠ Saved Locally (Offline)
            </span>
          )}
          {syncStatus === "saving" && (
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
              Saving Report...
            </span>
          )}
        </div>
      </div>

      <div className="bg-blue-600 p-12 rounded-[3rem] shadow-2xl">
        <h1 className="text-7xl font-black text-white mb-4 uppercase tracking-tighter">Thank You</h1>
        <p className="text-blue-100 text-2xl font-medium tracking-wide">
          For your time and attention today.
        </p>
      </div>

      <h3 className="text-3xl font-bold text-gray-800 pt-8 border-t-2 border-gray-100 w-full max-w-md">
        Do you have any questions?
      </h3>
    </div>
  );
}