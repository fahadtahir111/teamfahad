"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";

const FlavourScene = dynamic(() => import("./FlavourScene"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-transparent" />
});

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
    const rotateY = useTransform(smoothProgress, [0, 1], [0, Math.PI * 2]);

    const flavours = [
        { name: "Wild Berry", color: "#A78BFA" },
        { name: "Peach Punch", color: "#FDBA74" },
        { name: "Minty Fresh", color: "#98FFED" },
        { name: "Citrus Blast", color: "#FACC15" },
    ];

    return (
        <section ref={containerRef} className="relative h-[150vh] w-full bg-background overflow-hidden border-y border-white/5">
            <motion.div
                style={{ opacity, scale }}
                className="sticky top-0 h-screen w-full flex items-center justify-center pt-32"
            >
                <div className="absolute inset-0 z-0">
                    <FlavourScene rotateY={rotateY} />
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
