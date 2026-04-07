import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import "./globals.css";
import HeaderWrapper from "@/app/components/layout/HeaderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Safe Water CMS",
  description: "Interactive Sales & Water Testing Platform",
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Safe Water CMS",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          
          <HeaderWrapper>
            {user && (
              <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-8">
                  {/* Logo points to main Prospects page */}
                  <Link href="/dashboard/" className="text-xl font-black text-blue-900 tracking-tighter">
                    Customer Management System
                  </Link>
                  
                  <div className="hidden md:flex gap-6 items-center">
                    {/* Fixed path to /dashboard/prospects */}
                    <Link href="/dashboard/" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                      My Leads
                    </Link>

                    {/* The Live Ledger (Input Page) */}
                    <Link href="/dashboard/sales" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                      Production Ledger
                    </Link>

                    {/* The Analytics/Results Page (Initially showed) */}
                    <Link href="/dashboard/analytics" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                      Sales Analytics
                    </Link>

                    <Link href="/presentation" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                      New Presentation
                    </Link>
                    
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
                  <UserButton />
                </div>
              </nav>
            )}
          </HeaderWrapper>

          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}