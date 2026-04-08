"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export const FlavourUniverse = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

    // Instead of 3D rotation, we'll translate elements
    const y1 = useTransform(smoothProgress, [0, 1], [100, -100]);
    const y2 = useTransform(smoothProgress, [0, 1], [-50, 50]);
    const rotate = useTransform(smoothProgress, [0, 1], [0, 360]);

    const flavours = [
        { name: "Wild Berry", color: "#A78BFA", position: "top-1/4 left-1/4" },
        { name: "Peach Punch", color: "#FDBA74", position: "bottom-1/4 right-1/4" },
        { name: "Minty Fresh", color: "#98FFED", position: "top-1/3 right-1/4" },
        { name: "Citrus Blast", color: "#FACC15", position: "bottom-1/3 left-1/3" },
    ];

    return (
        <section ref={containerRef} className="relative h-[150vh] w-full bg-background overflow-hidden border-y border-white/5">
            <motion.div
                style={{ opacity, scale }}
                className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
            >
                {/* Background Gradient Core */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-energy/10 blur-[120px]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Floating Flavor Orbs (Replacing 3D Spheres) */}
                <div className="absolute inset-0 w-full h-full max-w-7xl mx-auto">
                    {flavours.map((f, i) => (
                        <motion.div
                            key={i}
                            className={`absolute ${f.position} w-32 h-32 md:w-48 md:h-48 rounded-full blur-2xl opacity-60`}
                            style={{
                                backgroundColor: f.color,
                                y: i % 2 === 0 ? y1 : y2,
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                    {/* Crisp Circles on top of blur */}
                    {flavours.map((f, i) => (
                        <motion.div
                            key={`crisp-${i}`}
                            className={`absolute ${f.position} w-4 h-4 md:w-8 md:h-8 rounded-full border border-white/20`}
                            style={{
                                borderColor: f.color,
                                y: i % 2 === 0 ? y2 : y1,
                                rotate
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 w-full max-w-7xl px-6 pointer-events-none text-center">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-white font-black text-[10px] md:text-sm uppercase tracking-[0.5em] mb-4 block animate-pulse drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">Molecular Essence</span>
                        <h2 className="text-3xl sm:text-4xl md:text-[8rem] font-black italic text-white uppercase leading-[0.8] tracking-tighter mb-8 md:mb-12 drop-shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
                            BUBBLOE <br /> <span className="text-white">CORE</span>
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mt-12 md:mt-20">
                            {flavours.map((f, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: f.color }} />
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{f.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden lg:block">
                    <div className="flex flex-col gap-20 items-center">
                        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-energy to-transparent" />
                        <span className="vertical-text text-[10px] font-black uppercase text-energy tracking-[1em] opacity-80">SCROLL TO ORBIT</span>
                        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-energy to-transparent" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
