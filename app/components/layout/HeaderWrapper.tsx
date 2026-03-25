"use client";

import { usePathname } from "next/navigation";
import ConnectionStatus from "./ConnectionStatus";

export default function HeaderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Hide header if on the presentation page or any sub-slide
  const isPresentationMode = pathname?.startsWith("/presentation");

  if (isPresentationMode) return null;

  return (
    <>
      <div className="fixed top-4 right-4 z-[100] md:top-6 md:right-8">
        <ConnectionStatus />
      </div>
      {children}
    </>
  );
}