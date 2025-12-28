"use client";

import React from "react";
import dynamic from "next/dynamic";

const ParticleScene = dynamic(() => import("./ParticleScene"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-transparent" />
});

export const ParticleBackground = ({ color }: { color?: string }) => {
    return (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none will-change-transform">
            <ParticleScene color={color} />
        </div>
    );
};
