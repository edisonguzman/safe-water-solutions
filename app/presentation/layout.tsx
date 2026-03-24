import React from "react";
import { PresentationProvider } from "@/app/context/PresentationContext";
import PresentationNav from "@/app/components/presentation/PresentationNav";

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gray-50 flex flex-col">
      {/* This is the lightweight replacement for your main headers */}
      <PresentationNav /> 
      
      <PresentationProvider>
        <div className="flex-1">
           {children}
        </div>
      </PresentationProvider>
    </section>
  );
}