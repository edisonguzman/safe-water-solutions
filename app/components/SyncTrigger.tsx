"use client";

import { useEffect, useState, useCallback } from "react";
import { flushOfflineLeads } from "@/app/lib/syncManager";
import { CloudSync, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SyncTrigger() {
  const [status, setStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [count, setCount] = useState(0);
  const router = useRouter();

  // We use useCallback so we can trigger this manually or automatically
  const checkAndSync = useCallback(async () => {
    const queue = JSON.parse(localStorage.getItem("offline_leads") || "[]");
    if (queue.length > 0) {
      setStatus("syncing");
      const result = await flushOfflineLeads();
      
      if (result.synced > 0) {
        setCount(result.synced);
        setStatus("success");
        router.refresh(); 
        
        // Auto-hide success after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        // We DON'T auto-hide error, so the user can see the Retry button
      }
    } else {
      setStatus("idle");
    }
  }, [router]);

  useEffect(() => {
    checkAndSync();
  }, [checkAndSync]);

  if (status === "idle") return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-bottom-10">
      <div className={`
        flex items-center gap-4 p-5 rounded-[2.5rem] shadow-2xl border-2 backdrop-blur-xl
        ${status === "syncing" ? "bg-blue-600/80 border-blue-400 text-white" : ""}
        ${status === "success" ? "bg-green-600/80 border-green-400 text-white" : ""}
        ${status === "error" ? "bg-red-600/80 border-red-400 text-white" : ""}
      `}>
        {/* Icon Container */}
        <div className="bg-white/10 p-3 rounded-2xl shadow-inner">
          {status === "syncing" && <Loader2 className="animate-spin" size={28} />}
          {status === "success" && <CheckCircle2 size={28} className="animate-bounce" />}
          {status === "error" && <AlertCircle size={28} />}
        </div>
        
        {/* Text Content */}
        <div className="flex-1 text-left">
          <p className="font-black uppercase tracking-tighter text-sm leading-none mb-1">
            {status === "syncing" && "Syncing Data..."}
            {status === "success" && "Upload Complete"}
            {status === "error" && "Sync Failed"}
          </p>
          <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest leading-none">
            {status === "syncing" && "Pushing reports to server"}
            {status === "success" && `${count} lead(s) uploaded`}
            {status === "error" && "No internet connection"}
          </p>
        </div>

        {/* Manual Retry Action */}
        {status === "error" && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              checkAndSync();
            }}
            className="bg-white text-red-600 px-4 py-2 rounded-2xl font-black text-xs uppercase hover:bg-red-50 active:scale-90 transition-all flex items-center gap-2 shadow-lg"
          >
            <RefreshCw size={14} /> Retry
          </button>
        )}

        {/* Close button for Error state */}
        {status === "error" && (
          <button 
            onClick={() => setStatus("idle")}
            className="text-white/60 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}