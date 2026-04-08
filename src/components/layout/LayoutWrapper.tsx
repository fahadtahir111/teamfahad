"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MaintenanceOverlay } from "@/components/layout/MaintenanceOverlay";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");
    const [settings, setSettings] = useState<any[]>([]);
    const [isMaintenance, setIsMaintenance] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setSettings(data);

                    const status = data.find(s => s.key === "STORE_STATUS")?.value;
                    const title = data.find(s => s.key === "SITE_TITLE")?.value;

                    if (status === "MAINTENANCE") setIsMaintenance(true);
                    if (title) document.title = title;
                }
            } catch (err) {
                console.error("Layout settings fetch error:", err);
            }
        };
        fetchSettings();
    }, []);

    const getSetting = (key: string) => settings.find(s => s.key === key)?.value;

    return (
        <>
            {isMaintenance && !isAdminPage && (
                <MaintenanceOverlay
                    message={getSetting("MAINTENANCE_MESSAGE")}
                    socialLinks={{
                        instagram: getSetting("SOCIAL_INSTAGRAM"),
                        twitter: getSetting("SOCIAL_X"),
                        discord: getSetting("SOCIAL_DISCORD")
                    }}
                />
            )}
            {!isAdminPage && <Navbar settings={settings} />}
            {children}
            {!isAdminPage && <Footer settings={settings} />}
        </>
    );
}
