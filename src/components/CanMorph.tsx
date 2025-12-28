"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Shield, Zap, Cpu, Atom } from "lucide-react";
import { cn } from "@/lib/utils";

const specs = [
    { icon: <Cpu className="w-4 h-4" />, label: "Neural Link", value: "v2.0" },
    { icon: <Zap className="w-4 h-4" />, label: "Kinetic", value: "880nm" },
    { icon: <Shield className="w-4 h-4" />, label: "Armor", value: "B-208" },
    { icon: <Atom className="w-4 h-4" />, label: "Fusion", value: "Zero-G" },
];

export const CanMorph = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const x1 = useTransform(scrollYProgress, [0.45, 0.55], ["0%", "-120%"]);
    const x2 = useTransform(scrollYProgress, [0.45, 0.55], ["120%", "0%"]);
    const opacity1 = useTransform(scrollYProgress, [0.5, 0.55], [1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.45, 0.5], [0, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

    return (
        <section ref={containerRef} className="h-[120vh] relative bg-[#0a0a0a] py-20 overflow-hidden border-t border-white/5">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center">
                {/* Background Blueprint Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FF4500 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                <motion.h2
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.05, 0.1, 0.05]) }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black italic text-white select-none uppercase tracking-tighter"
                >
                    EVOLVE
                </motion.h2>

                <div className="relative w-full max-w-6xl px-6 flex items-center justify-center perspective-[2000px]">
                    {/* Phase 01: THE ORIGIN */}
                    <motion.div
                        style={{ x: x1, opacity: opacity1, scale }}
                        className="absolute w-full max-w-[280px] md:max-w-[450px] aspect-[3/4] glass rounded-[40px] md:rounded-[60px] border-white/20 p-6 md:p-8 flex flex-col items-center justify-center group will-change-transform"
                    >
                        <div className="absolute top-8 left-8 md:top-10 md:left-10 flex flex-col gap-1 items-start">
                            <span className="text-energy font-black text-[9px] md:text-[10px] tracking-[0.4em] uppercase drop-shadow-[0_0_8px_rgba(255,69,0,0.4)]">Phase 01</span>
                            <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter">THE SPARK</h3>
                        </div>

                        <div className="relative w-full h-[250px] md:h-[450px]">
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src="/images/vanilla.png"
                                    alt="Phase 01"
                                    fill
                                    className="object-contain drop-shadow-[0_40px_80px_rgba(255,253,208,0.2)]"
                                    sizes="(max-width: 768px) 300px, 450px"
                                />
                            </motion.div>
                        </div>

                        {/* Blueprint Stats Overlay */}
                        <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10 md:right-10 grid grid-cols-2 gap-4">
                            {specs.slice(0, 2).map((s, i) => (
                                <div key={i} className="flex flex-col gap-1 border-l border-white/10 pl-3">
                                    <div className="flex items-center gap-1.5 md:gap-2 text-energy">
                                        {s.icon}
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-medium text-white/60">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Phase 02: THE ASCENSION */}
                    <motion.div
                        style={{ x: x2, opacity: opacity2, scale }}
                        className="absolute w-full max-w-[280px] md:max-w-[450px] aspect-[3/4] glass-dark rounded-[40px] md:rounded-[60px] border-energy/30 p-6 md:p-8 flex flex-col items-center justify-center group shadow-[0_0_100px_rgba(255,69,0,0.1)] will-change-transform"
                    >
                        {/* Scanning Line Animation */}
                        <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[2px] bg-energy/50 blur-sm z-30 pointer-events-none"
                        />

                        <div className="absolute top-8 left-8 md:top-10 md:left-10 flex flex-col gap-1 items-start">
                            <span className="text-energy font-black text-[9px] md:text-[10px] tracking-[0.4em] uppercase drop-shadow-[0_0_8px_rgba(255,69,0,0.4)]">Phase 02</span>
                            <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter">THE SURGE</h3>
                        </div>

                        <div className="relative w-full h-[250px] md:h-[450px]">
                            <motion.div
                                animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src="/images/berryblast.png"
                                    alt="Phase 02"
                                    fill
                                    className="object-contain drop-shadow-[0_40px_80px_rgba(216,180,254,0.4)]"
                                    sizes="(max-width: 768px) 300px, 450px"
                                />
                            </motion.div>
                        </div>

                        {/* Blueprint Stats Overlay */}
                        <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10 md:right-10 grid grid-cols-2 gap-4">
                            {specs.slice(2, 4).map((s, i) => (
                                <div key={i} className="flex flex-col gap-1 border-l border-energy/40 pl-3">
                                    <div className="flex items-center gap-1.5 md:gap-2 text-energy">
                                        {s.icon}
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                                    </div>
                                    <span className="text-[10px] md:text-xs font-black text-white">{s.value} MAX</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-20 flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black uppercase text-energy tracking-[0.5em] animate-pulse">Evolution Link Active</span>
                    <div className="flex gap-2">
                        <div className={cn("w-12 h-1 rounded-full transition-colors", scrollYProgress.get() < 0.5 ? "bg-energy" : "bg-white/10")} />
                        <div className={cn("w-12 h-1 rounded-full transition-colors", scrollYProgress.get() >= 0.5 ? "bg-energy" : "bg-white/10")} />
                    </div>
                </div>
            </div>
        </section>
    );
};
