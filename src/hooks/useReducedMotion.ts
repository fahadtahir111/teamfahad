"use client";

import { useEffect, useState } from "react";
import { shouldReduceAnimations } from "@/lib/performance";

/**
 * Hook to detect if animations should be reduced
 */
export const useReducedMotion = () => {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            setReducedMotion(mediaQuery.matches || shouldReduceAnimations());

            const handleChange = (e: MediaQueryListEvent) => {
                setReducedMotion(e.matches || shouldReduceAnimations());
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    return reducedMotion;
};

/**
 * Get optimized animation props based on device performance
 */
export const getOptimizedAnimation = (reducedMotion: boolean) => {
    if (reducedMotion) {
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.2 },
        };
    }
    return {};
};

