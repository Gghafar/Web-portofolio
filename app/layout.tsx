import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk, Martian_Mono } from "next/font/google";
import { profile } from "@/data/profile";
import { themeInitScript } from "@/lib/theme-script";
import MotionProvider from "@/components/motion/MotionProvider";
import Spotlight from "@/components/motion/Spotlight";
import CommandMenu from "@/components/CommandMenu";
import BackToTop from "@/components/BackToTop";
import SmoothScroll from "@/components/SmoothScroll";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const martian = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-martian", display: "swap" });

const description = `${profile.name}, AI Engineering student at ITS. ${profile.lede}`;

export const metadata: Metadata = {
  title: profile.name,
  description,
  openGraph: { title: profile.name, description, type: "profile" },
  twitter: { card: "summary", title: profile.name, description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F6F3" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1113" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script may set data-theme before React hydrates.
    <html lang="en" className={`${archivo.variable} ${hanken.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <MotionProvider>
          <SmoothScroll>
            <TooltipProvider delayDuration={250}>
              {children}
              <CommandMenu />
              <BackToTop />
              <Spotlight />
              <Toaster position="bottom-center" />
            </TooltipProvider>
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
