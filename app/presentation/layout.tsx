import React from "react";
import { PresentationProvider } from "@/app/context/PresentationContext";

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // We wrap all presentation slides inside the provider.
    // The min-h-screen and bg-gray-50 classes ensure the tablet view 
    // has a consistent, clean background color across all slides.
    <section className="min-h-screen bg-gray-50 flex flex-col">
      <PresentationProvider>
        {children}
      </PresentationProvider>
    </section>
  );
}