"use client";

import React, { useState, useEffect, memo } from "react";
import dynamic from "next/dynamic";

const ParticleScene = dynamic(() => import("./ParticleScene"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-energy/5" />
    )
});

export const ParticleBackground = memo(({ color }: { color?: string }) => {
    const [shouldRender, setShouldRender] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { isLowEndDevice } = require('@/lib/performance');
            // Disable particles on very low-end devices
            if (isLowEndDevice()) {
                const memory = (navigator as any).deviceMemory || 4;
                if (memory <= 2) {
                    setShouldRender(false);
                }
            }
        }
    }, []);

    if (!shouldRender) {
        return (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-background to-energy/5" />
        );
    }

    return (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <ParticleScene color={color} />
        </div>
    );
});

ParticleBackground.displayName = 'ParticleBackground';
