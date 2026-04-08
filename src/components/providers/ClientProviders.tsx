"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { AnalyticsWrapper } from "./AnalyticsWrapper";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <CartProvider>
                <AnalyticsWrapper />
                {children}
            </CartProvider>
        </SessionProvider>
    );
}
