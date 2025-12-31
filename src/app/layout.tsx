import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BUBBLOE | Premium Energy Drinks | Maximum Energy Boost",
  description: "Premium energy drinks with maximum energy boost. Zero sugar, natural ingredients, explosive flavors. Shop now!",
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
        <CartProvider>
          <CustomCursor />
          <Navbar />
          <SmoothScroll>
            <PageTransition>{children}</PageTransition>
          </SmoothScroll>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}



