import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STATS",
  description: "Elite Esports Tournament Platform",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Ensures content fills the screen including notch area [cite: 198]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-white overflow-hidden`}>
        
        {/* TOP BAR - Stays fixed at the top */}
        <TopBar />

        {/* MAIN SCROLL CONTAINER 
            - h-[100dvh]: Fits screen perfectly on mobile [cite: 194]
            - pt-28: Pushes content down so it starts below the Top Bar [cite: 108, 200]
            - pb-28: Ensures content isn't hidden behind the Bottom Nav [cite: 200]
        */}
        <div className="h-dvh w-full overflow-y-auto overflow-x-hidden pt-28 pb-28 px-4 no-scrollbar">
          {children}
        </div>
        
        {/* BOTTOM NAV - Stays fixed at the bottom */}
        <BottomNav />
        
      </body>
    </html>
  );
}