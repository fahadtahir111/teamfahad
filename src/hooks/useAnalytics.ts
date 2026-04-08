"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Generate a simple session ID for the browser if one doesn't exist
const getSessionId = () => {
    if (typeof window === "undefined") return "server";
    let sid = sessionStorage.getItem("saas_session_id");
    if (!sid) {
        sid = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("saas_session_id", sid);
    }
    return sid;
};

export function useAnalytics() {
    const pathname = usePathname();

    const trackEvent = (eventType: string, metadata: Record<string, any> = {}) => {
        if (typeof window === "undefined") return;

        // Fire-and-forget telemetry
        fetch("/api/analytics", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventType,
                metadata: { ...metadata, path: window.location.pathname },
                sessionId: getSessionId()
            }),
            // Use keepalive so the request finishes even if the user navigates away
            keepalive: true 
        }).catch(console.error);
    };

    // Automatically track page views
    useEffect(() => {
        trackEvent("PAGE_VIEW");
    }, [pathname]);

    return { trackEvent };
}
