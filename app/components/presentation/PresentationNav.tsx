"use client";

import Link from "next/link";
import { X, BookmarkPlus } from "lucide-react"; // Install lucide-react if you haven't

export default function PresentationNav() {
  return (
    <nav className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center text-xs font-medium">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X size={14} /> Close Presentation
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-slate-400 hidden sm:inline italic">
          Tip: Tap "Add to Home Screen" in your browser menu for one-tap access.
        </span>
        <button 
          onClick={() => window.alert("To bookmark: \nSafari: Tap Share -> Add to Home Screen \nChrome: Tap Menu -> Add to Home Screen")}
          className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded hover:bg-blue-500 transition-colors"
        >
          <BookmarkPlus size={14} /> Bookmark App
        </button>
      </div>
    </nav>
  );
}