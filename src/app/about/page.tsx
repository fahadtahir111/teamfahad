"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ArrowRight, Star, Shield, Zap, Globe, Atom, Droplets, Wind, Scan } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/Magnetic";
import { cn } from "@/lib/utils";

const milestones = [
    { year: "2020", title: "THE BEGINNING", desc: "Founded with a mission to create premium energy drinks with natural ingredients.", icon: <Zap /> },
    { year: "2022", title: "ZERO SUGAR", desc: "Launched our zero sugar formula for clean energy without the crash.", icon: <Star /> },
    { year: "2024", title: "GLOBAL REACH", desc: "Bubbloe becomes a trusted energy drink brand worldwide.", icon: <Shield /> },
];

export default function AboutPage() {
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);
    const horizontalRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const { scrollYProgress: horizontalScroll } = useScroll({
        target: horizontalRef,
        offset: ["start end", "end start"],
    });

    const horizontalX = useTransform(horizontalScroll, [0, 1], ["20%", "-20%"]);
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] text-foreground w-full overflow-x-hidden relative">
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 border-4 border-energy/30 border-t-energy rounded-full"
                            />
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white/60 font-bold text-lg"
                            >
                                Loading About...
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.8 }}
            >
                <ParticleBackground />

            {/* Central Kinetic Line */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-energy/5 z-0">
                <motion.div
                    style={{ height: lineHeight }}
                    className="w-full bg-energy shadow-[0_0_30px_#FF4500]"
                />
            </div>

            {/* Hero: Immersive Philosophy */}
            <section className="min-h-screen flex items-center justify-center relative z-10 px-4 md:px-6 py-20 md:py-32">
                <div className="max-w-5xl text-center relative">
                    {/* Floating Energy Orbs */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-20 -left-20 w-40 h-40 bg-energy/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 20, 0],
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-20 -right-20 w-60 h-60 bg-energy/15 rounded-full blur-3xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="relative z-10"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 md:mb-8 text-xs font-bold uppercase tracking-widest text-white shadow-xl"
                        >
                            <Zap className="w-4 h-4 text-energy" />
                            Our Story
                        </motion.div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black tracking-tighter italic mb-4 md:mb-6 leading-none uppercase text-white">
                            PREMIUM <br /> <span className="text-energy">ENERGY</span>
                        </h1>
                        <p className="text-base md:text-xl lg:text-2xl xl:text-3xl font-medium text-white/50 max-w-3xl mx-auto leading-relaxed px-4">
                            We don't just make energy drinks. We craft premium beverages engineered for maximum performance, explosive flavors, and sustained energy.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Horizontal Milestones */}
            <section ref={horizontalRef} className="min-h-screen py-12 md:py-20 lg:py-32 relative z-10 overflow-hidden flex items-center px-4 md:px-6">
                <div className="w-full max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12 md:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter mb-3 md:mb-4 uppercase text-white">
                            OUR <span className="text-energy">JOURNEY</span>
                        </h2>
                        <p className="text-sm md:text-base lg:text-lg text-white/50 max-w-2xl mx-auto">
                            From humble beginnings to global recognition
                        </p>
                    </motion.div>

                    <motion.div
                        style={{ x: typeof window !== 'undefined' && window.innerWidth > 768 ? horizontalX : 0 }}
                        className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 w-full"
                    >
                        {milestones.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="min-w-full md:min-w-[400px] lg:min-w-[450px] glass-dark p-8 md:p-10 lg:p-12 rounded-[40px] md:rounded-[50px] lg:rounded-[60px] border-white/10 hover:border-energy/40 transition-all group relative overflow-hidden"
                            >
                                {/* Animated Background Glow */}
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.1, 0.2, 0.1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                                    className="absolute inset-0 bg-energy/10 rounded-[60px] blur-2xl"
                                />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <span className="text-energy font-black text-3xl md:text-4xl lg:text-5xl italic leading-none">{m.year}</span>
                                        <motion.div
                                            whileHover={{ rotate: 360, scale: 1.1 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-energy/10 border border-energy/30 rounded-xl md:rounded-2xl flex items-center justify-center text-energy group-hover:bg-energy group-hover:text-white transition-all duration-500 shadow-lg"
                                        >
                                            {m.icon}
                                        </motion.div>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 md:mb-4 uppercase tracking-tighter leading-none text-white italic">{m.title}</h3>
                                    <p className="text-white/60 text-base md:text-lg lg:text-xl leading-relaxed font-medium">{m.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Immersive Vision Section */}
            <section className="relative min-h-[140vh] z-10 py-12 md:py-20">
                <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-6">
                    {/* Immersive Background with Scanning Effect */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/hero-female.jpg"
                            alt="Visionary"
                            fill
                            className="object-cover opacity-15 grayscale scale-110"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

                        {/* Biometric Scanning Line */}
                        <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[3px] bg-energy/40 blur-sm z-10"
                        />

                        {/* Data Stream Particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: ["-100%", "200%"],
                                        x: [Math.random() * 100 + "%", Math.random() * 100 + "%"]
                                    }}
                                    transition={{
                                        duration: 10 + Math.random() * 10,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * 1.5
                                    }}
                                    className="absolute w-[1px] h-64 bg-gradient-to-b from-transparent via-energy to-transparent"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="relative z-20 w-full max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
                            {/* Left: Content HUD */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="glass-dark p-6 sm:p-8 md:p-10 lg:p-12 rounded-[32px] md:rounded-[40px] lg:rounded-[60px] border-energy/20 shadow-[0_0_100px_rgba(255,69,0,0.15)] relative overflow-hidden"
                            >
                                {/* Animated Corner Accent */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-20 -right-20 w-40 h-40 bg-energy/10 rounded-full blur-3xl"
                                />

                                <div className="absolute top-4 right-4 md:top-6 md:right-6">
                                    <Scan className="text-energy/40 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 animate-pulse" />
                                </div>

                                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                                    <div className="w-8 md:w-12 h-[2px] bg-energy" />
                                    <span className="text-energy font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em]">Our Mission</span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black italic mb-4 md:mb-6 lg:mb-8 uppercase tracking-tight sm:tracking-tighter text-white leading-tight md:leading-[0.9]">
                                    PREMIUM ENERGY <span className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl block mt-2 break-words">FOR EVERYONE.</span>
                                </h2>

                                <p className="text-sm md:text-base lg:text-lg xl:text-xl font-medium text-white/50 mb-6 md:mb-8 lg:mb-12 leading-relaxed">
                                    Every can of Bubbloe is crafted with premium ingredients. We bridge the gap between natural energy and maximum performance. Experience clean, sustained energy that powers your day. Created for achievers who demand the best.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                                    <Magnetic>
                                        <Link href="/shop" className="px-8 md:px-10 py-4 md:py-5 bg-energy text-white rounded-xl md:rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 group shadow-xl hover:shadow-energy/20 transition-all">
                                            SHOP NOW
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4 md:w-5 md:h-5" />
                                        </Link>
                                    </Magnetic>
                                </div>
                            </motion.div>

                            {/* Right: Technical Specs Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <SpecCard
                                    icon={<Globe className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />}
                                    title="Natural Energy"
                                    desc="100% Natural Caffeine"
                                    delay={0.1}
                                />
                                <SpecCard
                                    icon={<Droplets className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />}
                                    title="Zero Sugar"
                                    desc="Clean Energy Formula"
                                    delay={0.2}
                                />
                                <SpecCard
                                    icon={<Atom className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />}
                                    title="B-Vitamins"
                                    desc="Energy Support"
                                    delay={0.3}
                                />
                                <SpecCard
                                    icon={<Wind className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />}
                                    title="No Crash"
                                    desc="Sustained Release"
                                    delay={0.4}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Call */}
            <section className="min-h-screen flex flex-col items-center justify-center relative z-10 text-center border-t border-white/5 px-4 md:px-6 py-12 md:py-20">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-energy/10 border-2 border-energy/40 rounded-full flex items-center justify-center text-energy mb-6 md:mb-8 lg:mb-10 mx-auto shadow-[0_0_80px_rgba(255,69,0,0.3)] relative"
                    >
                        <Zap className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 fill-energy" />
                        {/* Pulsing Ring */}
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 border-2 border-energy/30 rounded-full"
                        />
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-[10rem] font-black italic mb-4 md:mb-6 lg:mb-8 xl:mb-12 tracking-tighter leading-none uppercase text-white">
                        READY TO <br /> <span className="text-energy">POWER UP?</span>
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg text-white/50 mb-6 md:mb-8 max-w-xl mx-auto">
                        Join thousands of customers experiencing maximum energy boost
                    </p>
                    <Magnetic>
                        <Link href="/shop" className="inline-block px-8 py-4 md:px-12 md:py-6 lg:px-14 lg:py-7 bg-white text-[#0a0a0a] text-base md:text-xl lg:text-2xl font-black rounded-xl md:rounded-2xl lg:rounded-3xl hover:bg-energy hover:text-white transition-all duration-500 shadow-2xl hover:shadow-energy/30">
                            GET BUBBLOE NOW
                        </Link>
                    </Magnetic>
                </motion.div>
            </section>
            </motion.div>
        </div>
    );
}

const SpecCard = ({ icon, title, desc, delay }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -10, scale: 1.05 }}
            className="glass-dark p-6 md:p-8 rounded-[32px] md:rounded-[40px] border-white/5 hover:border-energy/40 transition-all flex flex-col items-center text-center group cursor-pointer relative overflow-hidden"
        >
            {/* Hover Glow Effect */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-energy/5 blur-xl"
            />

            <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-14 h-14 md:w-16 md:h-16 bg-energy/10 border border-energy/20 rounded-xl md:rounded-2xl flex items-center justify-center text-energy mb-4 md:mb-6 group-hover:bg-energy group-hover:text-white transition-all duration-500 shadow-lg"
            >
                {icon}
            </motion.div>
            <h4 className="relative z-10 text-lg md:text-xl font-black text-white italic uppercase tracking-tighter mb-2">{title}</h4>
            <p className="relative z-10 text-[10px] md:text-xs font-black text-white/50 uppercase tracking-widest">{desc}</p>
        </motion.div>
    );
};
