"use client";

import React from "react";
import dynamic from "next/dynamic";

const ParticleScene = dynamic(() => import("./ParticleScene"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-energy/5 animate-pulse" />
    )
});

export const ParticleBackground = ({ color }: { color?: string }) => {
    return (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none will-change-transform">
            <ParticleScene color={color} />
        </div>
    );
};
