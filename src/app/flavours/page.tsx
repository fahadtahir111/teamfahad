"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ParticleBackground } from "@/components/ParticleBackground";
import { cn } from "@/lib/utils";

const flavors = [
    {
        id: "vanilla",
        name: "Pure Vanilla",
        color: "bg-[#FFFDD0]",
        textColor: "text-[#2d2a26]",
        desc: "A silky smooth energy experience that feels like liquid velvet.",
        image: "/images/vanilla.png"
    },
    {
        id: "peach",
        name: "Peach Surge",
        color: "bg-[#FFDAB9]",
        textColor: "text-[#2d2a26]",
        desc: "Explosive stone-fruit energy with a creamy finish.",
        image: "/images/peach.png"
    },
    {
        id: "mint",
        name: "Minty Fresh",
        color: "bg-[#98FFED]",
        textColor: "text-[#2d2a26]",
        desc: "Arctic energy to cool your core and charge your soul.",
        image: "/images/mint.png"
    },
    {
        id: "berry",
        name: "Berry Blast",
        color: "bg-[#D8B4FE]",
        textColor: "text-[#2d2a26]",
        desc: "A nebula of mixed berries compressed into pure kinetic power.",
        image: "/images/berryblast.png"
    },
];

export default function FlavoursPage() {
    const [activeFlavor, setActiveFlavor] = useState(flavors[0]);

    return (
        <div className="relative min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000">
            {/* Background Particles can be themed too, but for now we keep the same ones */}
            <ParticleBackground />

            <div className="relative z-10 w-full max-w-6xl px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
                {/* Left Side: Product Image */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFlavor.id}
                            initial={{ rotate: -20, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 20, opacity: 0, scale: 0.5 }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                            className="relative w-64 h-64 md:w-[450px] md:h-[450px]"
                        >
                            <Image
                                src={activeFlavor.image}
                                alt={activeFlavor.name}
                                fill
                                className="object-contain drop-shadow-[0_0_80px_rgba(255,255,255,0.8)]"
                                sizes="(max-width: 768px) 100vw, 450px"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right Side: Info & Selector */}
                <div className="w-full md:w-1/2">
                    <motion.div
                        key={activeFlavor.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-12"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black italic tracking-tighter mb-4 uppercase">
                            {activeFlavor.name}
                        </h1>
                        <p className="text-xl md:text-2xl font-medium text-foreground/70 max-w-md">
                            {activeFlavor.desc}
                        </p>
                    </motion.div>

                    {/* Selector Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {flavors.map((flavor) => (
                            <button
                                key={flavor.id}
                                onClick={() => setActiveFlavor(flavor)}
                                className={cn(
                                    "relative h-16 rounded-2xl p-4 flex items-center gap-4 transition-all duration-500 overflow-hidden group",
                                    activeFlavor.id === flavor.id ? flavor.color + " shadow-lg" : "glass"
                                )}
                            >
                                <div className={cn("w-4 h-4 rounded-full", activeFlavor.id === flavor.id ? "bg-black/20" : flavor.color)} />
                                <span className={cn(
                                    "font-black uppercase tracking-widest text-sm",
                                    activeFlavor.id === flavor.id ? flavor.textColor : "text-foreground/50"
                                )}>
                                    {flavor.name}
                                </span>
                                {activeFlavor.id === flavor.id && (
                                    <motion.div
                                        layoutId="flavor-indicator"
                                        className="absolute inset-0 bg-white/10"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vertical Dive</span>
                <div className="w-0.5 h-10 bg-foreground/50" />
            </motion.div>
        </div>
    );
}
