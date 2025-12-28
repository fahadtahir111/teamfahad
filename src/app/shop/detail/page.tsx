"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ShoppingCart, Zap, Droplets, Wind } from "lucide-react";
import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";

export default function ProductDetailPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const rotate = useTransform(scrollYProgress, [0, 1], [0, 720]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1.2, 1.2, 0.8]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 500]);

    return (
        <div ref={containerRef} className="relative min-h-[200vh] bg-background">
            <ParticleBackground />

            {/* Back Button */}
            <div className="fixed top-24 left-10 z-50">
                <Link
                    href="/shop"
                    className="glass p-4 rounded-full flex items-center gap-2 font-bold hover:bg-energy hover:text-white transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    BACK TO SHOP
                </Link>
            </div>

            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center px-6 gap-12 overflow-hidden">
                {/* Left Side: Cinematic Can Reveal */}
                <div className="relative w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center">
                    <motion.div
                        style={{ rotate, scale, y }}
                        className="relative w-64 h-64 md:w-[600px] md:h-[600px] z-20"
                    >
                        <Image
                            src="/images/product-splash.jpg"
                            alt="Bubbloe Original"
                            fill
                            className="object-contain drop-shadow-[0_0_100px_rgba(255,69,0,0.3)]"
                        />
                    </motion.div>

                    {/* Energy Rings Background */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute w-[600px] h-[600px] border border-energy/30 rounded-full"
                    />
                </div>

                {/* Right Side: Product Details */}
                <div className="w-full md:w-1/2 max-w-lg relative z-30">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-energy font-black tracking-widest uppercase mb-4 block">
                            Futuristic Energy
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 uppercase">
                            ORIGINAL <br /> <span className="text-energy">BOOST</span>
                        </h1>
                        <p className="text-xl text-foreground/70 mb-10 font-medium">
                            The flagship infusion that started it all. A perfect balance of
                            creamy vanilla notes and a high-voltage citrus spark.
                        </p>

                        {/* Nutrition Indicators */}
                        <div className="grid grid-cols-3 gap-6 mb-12">
                            <div className="flex flex-col items-center gap-2 glass p-4 rounded-2xl">
                                <Zap className="text-energy" />
                                <span className="font-black text-xl">200MG</span>
                                <span className="text-[10px] uppercase font-bold text-foreground/50">Caffeine</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 glass p-4 rounded-2xl">
                                <Droplets className="text-blue-400" />
                                <span className="font-black text-xl">0G</span>
                                <span className="text-[10px] uppercase font-bold text-foreground/50">Sugar</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 glass p-4 rounded-2xl">
                                <Wind className="text-green-400" />
                                <span className="font-black text-xl">100%</span>
                                <span className="text-[10px] uppercase font-bold text-foreground/50">Natural</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-6 bg-energy text-white rounded-full font-black text-2xl flex items-center justify-center gap-4 shadow-2xl shadow-energy/30"
                        >
                            <ShoppingCart className="w-8 h-8" />
                            ADD TO RECEPTOR
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
