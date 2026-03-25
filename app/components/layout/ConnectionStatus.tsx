"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 border ${
      isOnline 
        ? "bg-green-50 border-green-200 text-green-700" 
        : "bg-red-50 border-red-200 text-red-700 animate-pulse"
    }`}>
      <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`} />
      {isOnline ? (
        <Wifi size={14} className="opacity-80" />
      ) : (
        <WifiOff size={14} />
      )}
      <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">
        {isOnline ? "System Online" : "Offline Mode"}
      </span>
    </div>
  );
}