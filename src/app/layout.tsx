import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CustomScrollbar } from "@/components/CustomScrollbar";
import { HeroInViewProvider } from "@/components/HeroInViewProvider";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  title: "Portfolio | HafizJBI",
  description: "Personal portfolio — about, experience, education, skills, and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to content
          </a>
          <TooltipProvider>
            <HeroInViewProvider>
              <Navbar />
              {children}
            </HeroInViewProvider>
          </TooltipProvider>
          <CustomScrollbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
