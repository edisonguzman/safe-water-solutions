"use client";

import { usePathname } from "next/navigation";

export default function HeaderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Hide header if on the presentation page or any sub-slide
  const isPresentationMode = pathname?.startsWith("/presentation");

  if (isPresentationMode) return null;

  return <>{children}</>;
}