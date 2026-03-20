import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safe Water Solutions",
  description: "Interactive Sales & Water Testing Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check for the logged-in user and their admin status
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* Global Header Navigation */}
          {user && (
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
              <div className="flex items-center gap-8">
                <Link href="/dashboard" className="text-xl font-black text-blue-900 tracking-tighter">
                  SAFE WATER SOLUTIONS
                </Link>
                
                <div className="hidden md:flex gap-6 items-center">
                  <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                    My Leads
                  </Link>
                  <Link href="/presentation" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                    New Presentation
                  </Link>
                  
                  {/* Executive Admin Link - Only visible to you */}
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      className="text-xs font-black text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest"
                    >
                      Executive Admin
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/sign-in" />
              </div>
            </nav>
          )}

          {/* Main Application Content */}
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}