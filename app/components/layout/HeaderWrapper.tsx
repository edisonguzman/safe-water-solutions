"use client";

import { usePathname } from "next/navigation";

export default function HeaderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const pathname = usePathname();
  
  // Hide header/wrapper logic if on the presentation page
  const isPresentationMode = pathname?.startsWith("/presentation");

  if (isPresentationMode) return null;

  return (
    <>
      {/* Removed ConnectionStatus div from here */}
      {children}
    </>
  );
}