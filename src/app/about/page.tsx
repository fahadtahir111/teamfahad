"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ArrowRight, Star, Shield, Zap, Globe, Atom, Droplets, Wind, Cpu, Scan } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "@/components/Magnetic";
import { cn } from "@/lib/utils";

const milestones = [
    { year: "2088", title: "THE SPARK", desc: "First bio-luminescent infusion created in a lab in New Neo-Tokyo.", icon: <Zap /> },
    { year: "2090", title: "COLD FUSION", desc: "Patented the first zero-gravity carbonation process.", icon: <Star /> },
    { year: "2092", title: "GLOBAL SURGE", desc: "Bubbloe becomes the #1 energy source for dream-engineers.", icon: <Shield /> },
];

export default function AboutPage() {
    const containerRef = useRef(null);
    const horizontalRef = useRef(null);

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
            <ParticleBackground />

            {/* Central Kinetic Line */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-energy/5 z-0">
                <motion.div
                    style={{ height: lineHeight }}
                    className="w-full bg-energy shadow-[0_0_30px_#FF4500]"
                />
            </div>

            {/* Hero: Immersive Philosophy */}
            <section className="h-screen flex items-center justify-center relative z-10 px-6">
                <div className="max-w-4xl text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-[10rem] font-black tracking-tighter italic mb-6 leading-none uppercase text-white">
                            FUTURE <br /> <span className="text-energy">LIQUID</span>
                        </h1>
                        <p className="text-lg md:text-3xl font-medium text-white/40 max-w-2xl mx-auto leading-relaxed px-4">
                            We don't just make drinks. We engineer kinetic experiences for the next century of achievers.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Horizontal Milestones */}
            <section ref={horizontalRef} className="min-h-screen py-20 relative z-10 overflow-hidden flex items-center">
                <motion.div
                    style={{ x: typeof window !== 'undefined' && window.innerWidth > 768 ? horizontalX : 0 }}
                    className="flex flex-col md:flex-row gap-8 md:gap-12 px-6 md:px-20 w-full"
                >
                    {milestones.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="min-w-full md:min-w-[450px] glass p-10 md:p-12 rounded-[60px] border-white/10 hover:border-energy/40 transition-all group group-hover:scale-[1.02]"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-energy font-black text-4xl md:text-5xl italic leading-none">{m.year}</span>
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-energy/5 border border-energy/20 rounded-2xl flex items-center justify-center text-energy group-hover:bg-energy group-hover:text-white transition-all duration-500">
                                    {m.icon}
                                </div>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tighter leading-none text-white italic">{m.title}</h3>
                            <p className="text-foreground/40 text-lg md:text-xl leading-relaxed font-medium">{m.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Immersive Vision Section: NEURAL HUD REDESIGN */}
            <section className="relative h-[140vh] z-10">
                <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                    {/* Immersive Background with Scanning Effect */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/hero-female.jpg"
                            alt="Visionary"
                            fill
                            className="object-cover opacity-20 grayscale scale-110"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

                        {/* Biometric Scanning Line */}
                        <motion.div
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[3px] bg-energy/30 blur-sm z-10"
                        />

                        {/* Data Stream Particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                            {[...Array(5)].map((_, i) => (
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
                                        delay: i * 2
                                    }}
                                    className="absolute w-[1px] h-64 bg-gradient-to-b from-transparent via-energy to-transparent"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="relative z-20 w-full max-w-6xl px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            {/* Left: Content HUD */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="glass-dark p-6 sm:p-8 md:p-12 rounded-[40px] md:rounded-[60px] border-energy/20 shadow-[0_0_100px_rgba(255,69,0,0.1)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 md:p-8">
                                    <Scan className="text-energy/30 w-6 h-6 md:w-8 md:h-8 animate-pulse" />
                                </div>

                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-[2px] bg-energy" />
                                    <span className="text-energy font-black text-sm uppercase tracking-[0.4em]">Bubbloe Vision v.88</span>
                                </div>

                                <h2 className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-black italic mb-6 md:mb-8 uppercase tracking-tight sm:tracking-tighter text-white leading-tight md:leading-[0.9]">
                                    A MEMORY FROM <span className="text-3xl sm:text-5xl md:text-7xl lg:text-9xl block mt-2 break-words">THE BUBBLOE ERA.</span>
                                </h2>

                                <p className="text-base md:text-xl font-medium text-white/50 mb-12 leading-relaxed max-w-lg mx-auto md:mx-0">
                                    Every can of Bubbloe is a kinetic artifact. We bridged the gap between biological need and digital demand. Energy isn't just felt—it's witnessed in every pulse. Created for the visionaries of New Neo-Tokyo.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                                    <Magnetic>
                                        <button className="px-10 py-5 bg-energy text-white rounded-2xl font-black flex items-center justify-center gap-2 group shadow-xl hover:shadow-energy/20 transition-all">
                                            JOIN THE ELITE
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Magnetic>
                                </div>
                            </motion.div>

                            {/* Right: Technical Specs Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <SpecCard
                                    icon={<Globe className="w-6 h-6 md:w-8 md:h-8" />}
                                    title="Eco-Fusion"
                                    desc="100% Recyclable Fusion Cans"
                                    delay={0.1}
                                />
                                <SpecCard
                                    icon={<Droplets className="w-6 h-6 md:w-8 md:h-8" />}
                                    title="Neo-Spring"
                                    desc="Neo-Tokyo Pure Source"
                                    delay={0.2}
                                />
                                <SpecCard
                                    icon={<Atom className="w-6 h-6 md:w-8 md:h-8" />}
                                    title="Atomic-B"
                                    desc="Molecularly Bonded Flavours"
                                    delay={0.3}
                                />
                                <SpecCard
                                    icon={<Wind className="w-6 h-6 md:w-8 md:h-8" />}
                                    title="Zero-G"
                                    desc="Gravity-Free Carbonation"
                                    delay={0.4}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Call */}
            <section className="h-screen flex flex-col items-center justify-center relative z-10 text-center border-t border-white/5 px-6">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-energy/10 border border-energy/40 rounded-full flex items-center justify-center text-energy mb-8 md:10 mx-auto shadow-[0_0_80px_rgba(255,69,0,0.2)]">
                        <Zap className="w-12 h-12 md:w-16 md:h-16 fill-energy" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-[10rem] font-black italic mb-10 md:12 tracking-tighter leading-none uppercase text-white">
                        READY FOR <br /> <span className="text-energy">LIFTOFF?</span>
                    </h2>
                    <Magnetic>
                        <Link href="/shop" className="inline-block px-8 py-4 md:px-14 md:py-7 bg-white text-[#0a0a0a] text-lg md:text-2xl font-black rounded-2xl md:rounded-3xl hover:bg-energy hover:text-white transition-all duration-500 shadow-2xl">
                            GET BUBBLOE NOW
                        </Link>
                    </Magnetic>
                </motion.div>
            </section>
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
            whileHover={{ y: -10 }}
            className="glass p-8 rounded-[40px] border-white/5 hover:border-energy/40 transition-all flex flex-col items-center text-center group cursor-pointer"
        >
            <div className="w-16 h-16 bg-energy/5 border border-energy/10 rounded-2xl flex items-center justify-center text-energy mb-6 group-hover:bg-energy group-hover:text-white transition-all duration-500">
                {icon}
            </div>
            <h4 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">{title}</h4>
            <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{desc}</p>
        </motion.div>
    );
};
