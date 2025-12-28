"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Droplets, Info } from "lucide-react";
import Link from "next/link";
import { ParticleBackground } from "./ParticleBackground";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

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

    return (
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-background transition-colors duration-1000">
            {/* Background Particles */}
            <ParticleBackground color={activeFlavor.accent} />

            {/* Dynamic Background Glows */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeFlavor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    exit={{ opacity: 0 }}
                    className={cn("absolute inset-0 z-0", activeFlavor.color)}
                    style={{ filter: "blur(150px)" }}
                />
            </AnimatePresence>

            <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-12 mt-32 md:mt-20">
                {/* Left: Content */}
                <div className="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
                    <motion.div
                        key={activeFlavor.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white shadow-xl")}
                        >
                            <Zap className="w-4 h-4 text-energy" />
                            Bubbloe Energy
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-none uppercase italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            UNLEASH THE <br />
                            <span className={cn("transition-colors duration-1000", activeFlavor.id === "vanilla" ? "text-[#F3E5AB] drop-shadow-[0_0_20px_rgba(243,229,171,0.3)]" : activeFlavor.id === "peach" ? "text-orange-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]" : "text-mint drop-shadow-[0_0_20px_rgba(152,255,237,0.3)]")}>
                                {activeFlavor.id === "vanilla" ? "VELVET" : activeFlavor.id === "peach" ? "SURGE" : "MOTION"}
                            </span>
                        </h1>

                        <p className="text-base md:text-xl text-white/50 mb-10 max-w-md font-medium mx-auto md:mx-0 leading-relaxed">
                            {activeFlavor.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                            <Magnetic>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={cn("w-full sm:w-auto px-10 py-5 text-black rounded-full font-black text-lg md:text-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-1xl transition-all duration-500 will-change-transform", activeFlavor.color, activeFlavor.shadow)}
                                >
                                    SHOP {activeFlavor.id}
                                    <ArrowRight />
                                </motion.button>
                            </Magnetic>

                            <Magnetic>
                                <Link href="/flavours" className="text-xs md:text-sm font-black uppercase tracking-widest text-white/50 hover:text-energy transition-colors flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Flavour Specs
                                </Link>
                            </Magnetic>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Interactive Product Showcase */}
                <div className="w-full md:w-1/2 relative flex flex-col items-center justify-center md:min-h-[600px] order-1 md:order-2 pb-12 md:pb-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFlavor.id}
                            initial={{ x: 30, opacity: 0, scale: 0.95 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: -30, opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-[240px] h-[350px] md:w-[400px] md:h-[550px] z-20 group"
                        >
                            {/* main card */}
                            <motion.div
                                whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
                                className="w-full h-full glass rounded-[50px] md:rounded-[60px] border-white/20 shadow-2xl relative flex flex-col items-center justify-center p-6 md:p-8 overflow-visible"
                            >
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
                                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-16 h-16 md:w-24 md:h-24 bg-energy rounded-full shadow-2xl flex flex-col items-center justify-center z-30 border-4 border-white/20"
                            >
                                <Droplets className="text-white w-6 h-6 md:w-8 md:h-8 mb-1" />
                                <span className="text-[7px] md:text-[9px] font-black uppercase text-white tracking-widest">Molecular</span>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Selector Grid Overlay */}
                    <div className="relative md:absolute mt-8 md:mt-0 md:-bottom-12 md:bottom-0 left-auto md:left-1/2 transform-none md:-translate-x-1/2 flex gap-3 md:gap-4 p-3 md:p-4 glass rounded-[24px] md:rounded-[32px] shadow-2xl z-30">
                        {flavors.map((flavor) => (
                            <button
                                key={flavor.id}
                                onClick={() => setActiveFlavor(flavor)}
                                className={cn(
                                    "relative w-12 h-12 md:w-16 md:h-16 rounded-[14px] md:rounded-[24px] overflow-hidden transition-all duration-300 border-2",
                                    activeFlavor.id === flavor.id ? "scale-110 border-white" : "scale-100 border-transparent opacity-50 hover:opacity-100"
                                )}
                            >
                                <Image src={flavor.image} alt={flavor.name} fill className="object-cover" sizes="64px" />
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
