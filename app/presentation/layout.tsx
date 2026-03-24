import React from "react";
import PresentationNav from "@/app/components/presentation/PresentationNav";
import { PresentationProvider } from "@/app/context/PresentationContext";

export default function PresentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<section className="min-h-screen bg-gray-50 flex flex-col">
  <PresentationNav /> 
  <PresentationProvider>
    <main className="w-full">
       {children}
    </main>
  </PresentationProvider>
</section>
  );
}