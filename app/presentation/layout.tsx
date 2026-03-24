import React from "react";
import PresentationNav from "@/app/components/presentation/PresentationNav";
import { PresentationProvider } from "@/app/context/PresentationContext";

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-[100dvh] bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Now the app knows what this is */}
      <PresentationNav /> 
      
      <PresentationProvider>
        <main className="flex-1 w-full relative">
           {children}
        </main>
      </PresentationProvider>
    </section>
  );
}