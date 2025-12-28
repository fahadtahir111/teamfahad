import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BUBBLOE | Unleash Your Inner Flavour-Verse",
  description: "Experience the futuristic energy of Bubbloe. Premium energy drinks with explosive flavours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        suppressHydrationWarning
      >
        <CustomCursor />
        <Navbar />
        <SmoothScroll>
          <PageTransition>{children}</PageTransition>
        </SmoothScroll>
        <Footer />
      </body>
    </html>
  );
}



