"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Droplets, Info } from "lucide-react";
import Link from "next/link";
import { ParticleBackground } from "./ParticleBackground";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const flavors = [
    {
        id: "vanilla",
        name: "Pure Vanilla",
        color: "bg-[#FFFDD0]",
        shadow: "shadow-[#FFFDD0]/50",
        image: "/images/vanilla.png",
        accent: "#F3E5AB",
        description: "A silky smooth energy experience that feels like liquid velvet."
    },
    {
        id: "peach",
        name: "Peach Surge",
        color: "bg-[#FFDAB9]",
        shadow: "shadow-[#FFDAB9]/50",
        image: "/images/peach.png",
        accent: "#FDBA74",
        description: "Floral notes meet explosive kinetic potential."
    },
    {
        id: "mint",
        name: "Minty Motion",
        color: "bg-[#98FFED]",
        shadow: "shadow-[#98FFED]/50",
        image: "/images/mint.png",
        accent: "#98FFED",
        description: "Arctic energy to cool your core and charge your soul."
    }
];

export const Hero = () => {
    const [activeFlavor, setActiveFlavor] = useState(flavors[0]);
    const reducedMotion = useReducedMotion();
    
    // Optimize animation props for low-end devices
    const floatAnimation = useMemo(() => {
        if (reducedMotion) return {};
        return {
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
        };
    }, [reducedMotion]);
    
    const floatTransition = useMemo(() => {
        if (reducedMotion) return { duration: 0 };
        return { duration: 6, repeat: Infinity, ease: "easeInOut" };
    }, [reducedMotion]);

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-background transition-colors duration-1000">
            {/* Background Particles */}
            <ParticleBackground color={activeFlavor.accent} />

            {/* Dynamic Background Glows */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeFlavor.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 1 }}
                    className={cn("absolute inset-0 z-0", activeFlavor.color)}
                    style={{ filter: "blur(150px)" }}
                />
            </AnimatePresence>

            {/* Floating Energy Orbs - Disabled on low-end devices */}
            {!reducedMotion && (
                <>
                    <motion.div
                        animate={floatAnimation}
                        transition={floatTransition}
                        className="absolute top-20 left-10 w-32 h-32 bg-energy/20 rounded-full blur-3xl z-0 hidden md:block"
                    />
                    <motion.div
                        animate={reducedMotion ? {} : {
                            y: [0, 30, 0],
                            x: [0, -20, 0],
                            scale: [1, 1.3, 1],
                            opacity: [0.15, 0.35, 0.15]
                        }}
                        transition={reducedMotion ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-20 right-10 w-40 h-40 bg-energy/15 rounded-full blur-3xl z-0 hidden md:block"
                    />
                </>
            )}

            <div className="relative z-10 w-full max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mt-24 md:mt-32 lg:mt-20">
                {/* Left: Content */}
                <div className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
                    <motion.div
                        key={activeFlavor.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: reducedMotion ? 0 : -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: reducedMotion ? 0 : 0.2 }}
                            className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white shadow-xl relative overflow-hidden")}
                        >
                            {!reducedMotion && (
                                <motion.div
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                />
                            )}
                            <Zap className="w-4 h-4 text-energy relative z-10" />
                            <span className="relative z-10">Bubbloe Energy</span>
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white mb-4 md:mb-6 leading-none uppercase italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            MAXIMUM <br />
                            <span className={cn("transition-colors duration-1000", activeFlavor.id === "vanilla" ? "text-[#F3E5AB] drop-shadow-[0_0_20px_rgba(243,229,171,0.3)]" : activeFlavor.id === "peach" ? "text-orange-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "text-mint drop-shadow-[0_0_20px_rgba(152,255,237,0.3)]")}>
                                {activeFlavor.id === "vanilla" ? "ENERGY" : activeFlavor.id === "peach" ? "BOOST" : "POWER"}
                            </span>
                        </h1>

                        <p className="text-sm md:text-base lg:text-xl text-white/50 mb-6 md:mb-10 max-w-md font-medium mx-auto md:mx-0 leading-relaxed">
                            Premium energy drinks with explosive flavors. Experience maximum energy boost.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 justify-center md:justify-start">
                            <Magnetic>
                                <Link href="/shop">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={cn("w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-black rounded-full font-black text-base md:text-lg lg:text-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-1xl transition-all duration-500 will-change-transform", activeFlavor.color, activeFlavor.shadow)}
                                    >
                                        SHOP NOW
                                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </motion.button>
                                </Link>
                            </Magnetic>

                            <Magnetic>
                                <Link href="/flavours" className="text-xs md:text-sm font-black uppercase tracking-widest text-white/50 hover:text-energy transition-colors flex items-center gap-2">
                                    <Info className="w-3 h-3 md:w-4 md:h-4" />
                                    View Flavors
                                </Link>
                            </Magnetic>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Interactive Product Showcase */}
                <div className="w-full md:w-1/2 relative flex flex-col items-center justify-center md:min-h-[500px] lg:min-h-[600px] order-1 md:order-2 pb-8 md:pb-12 lg:pb-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFlavor.id}
                            initial={{ x: 30, opacity: 0, scale: 0.95 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: -30, opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-[200px] h-[300px] sm:w-[240px] sm:h-[350px] md:w-[350px] md:h-[500px] lg:w-[400px] lg:h-[550px] z-20 group"
                        >
                            {/* Glow Effect Behind Card */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={cn("absolute inset-0 rounded-[60px] blur-3xl -z-10", activeFlavor.color)}
                            />

                            {/* main card */}
                            <motion.div
                                whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
                                className="w-full h-full glass rounded-[50px] md:rounded-[60px] border-white/20 shadow-2xl relative flex flex-col items-center justify-center p-6 md:p-8 overflow-visible"
                            >
                                {/* Animated Border Glow */}
                                <motion.div
                                    animate={{
                                        rotate: [0, 360],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-[60px] border-2 border-energy/30"
                                    style={{ clipPath: "inset(0 0 0 0)" }}
                                />
                                <div className="relative w-full h-full">
                                    <Image
                                        src={activeFlavor.image}
                                        alt={activeFlavor.name}
                                        fill
                                        className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                                        sizes="(max-width: 768px) 80vw, 400px"
                                        priority
                                    />
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                                    <span className="text-energy font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] block mb-1 opacity-70">{activeFlavor.name} edition</span>
                                    <h4 className="text-3xl md:text-5xl font-black italic text-white uppercase leading-[0.85] tracking-tighter">FUTURE <br /> LIQUID</h4>
                                </div>
                            </motion.div>

                            {/* info badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 bg-energy rounded-full shadow-2xl flex flex-col items-center justify-center z-30 border-4 border-white/20 relative overflow-hidden cursor-pointer"
                            >
                                {/* Pulsing Ring */}
                                <motion.div
                                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 border-2 border-white/30 rounded-full"
                                />
                                <Droplets className="text-white w-6 h-6 md:w-8 md:h-8 mb-1 relative z-10" />
                                <span className="text-[7px] md:text-[9px] font-black uppercase text-white tracking-widest relative z-10">Molecular</span>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Selector Grid Overlay */}
                    <div className="relative md:absolute mt-6 md:mt-0 md:-bottom-12 md:bottom-0 left-auto md:left-1/2 transform-none md:-translate-x-1/2 flex gap-2 md:gap-3 lg:gap-4 p-2 md:p-3 lg:p-4 glass rounded-[20px] md:rounded-[24px] lg:rounded-[32px] shadow-2xl z-30">
                        {flavors.map((flavor) => (
                            <button
                                key={flavor.id}
                                onClick={() => setActiveFlavor(flavor)}
                                className={cn(
                                    "relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-[12px] md:rounded-[14px] lg:rounded-[24px] overflow-hidden transition-all duration-300 border-2",
                                    activeFlavor.id === flavor.id ? "scale-110 border-white" : "scale-100 border-transparent opacity-50 hover:opacity-100"
                                )}
                            >
                                <Image src={flavor.image} alt={flavor.name} fill className="object-cover" sizes="(max-width: 640px) 40px, (max-width: 1024px) 56px, 64px" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Hint */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20 flex flex-col items-center hidden md:flex"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-2">Dive In</span>
                <div className="w-[1px] h-12 bg-white/20" />
            </motion.div>
        </section>
    );
};
