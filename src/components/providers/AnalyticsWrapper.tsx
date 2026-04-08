"use client";

import { useAnalytics } from "@/hooks/useAnalytics";

export function AnalyticsWrapper() {
    useAnalytics(); // Auto-tracks page views on route changes
    return null;
}
