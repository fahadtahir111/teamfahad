import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";
import { SocialProof } from "@/components/SocialProof";

// Premium System Font Stacks
const systemSans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const systemMono = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

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
        className="antialiased relative"
        style={{ fontFamily: systemSans }}
        suppressHydrationWarning
      >
        <ClientProviders>
          <CustomCursor />
          <LayoutWrapper>
            <SmoothScroll>
              <PageTransition>{children}</PageTransition>
            </SmoothScroll>
          </LayoutWrapper>
          <SocialProof />
        </ClientProviders>
      </body>
    </html>
  );
}



