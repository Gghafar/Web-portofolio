import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import { profile } from "@/data/profile";
import MotionProvider from "@/components/motion/MotionProvider";
import CommandMenu from "@/components/CommandMenu";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { LiquidGlassFilter } from "@/components/ui/liquid-glass-button";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const schibsted = Schibsted_Grotesk({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-schibsted", display: "swap" });

const description = `${profile.name}, ${profile.role}. ${profile.lede}`;

export const metadata: Metadata = {
  title: `${profile.name} — Portfolio Desktop`,
  description,
  openGraph: { title: profile.name, description, type: "profile" },
  twitter: { card: "summary", title: profile.name, description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#EFEFEC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${schibsted.variable}`}>
      <body>
        {/* The SVG filter every liquid-glass button distorts its backdrop with (one copy per page). */}
        <LiquidGlassFilter />
        <MotionProvider>
          <TooltipProvider delayDuration={250}>
            {children}
            <CommandMenu />
            <Toaster position="bottom-center" />
          </TooltipProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
