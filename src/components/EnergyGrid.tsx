"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Wind, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
    {
        title: "Maximum Energy",
        desc: "200mg of natural caffeine for instant energy boost and enhanced focus.",
        icon: <Zap size={32} className="text-energy" />,
        color: "bg-energy/10",
    },
    {
        title: "Zero Sugar",
        desc: "Zero sugar formula with natural flavors for clean energy without the crash.",
        icon: <Wind size={32} className="text-blue-400" />,
        color: "bg-blue-400/10",
    },
    {
        title: "B-Vitamins",
        desc: "Essential B-vitamins to support energy metabolism and mental clarity.",
        icon: <Cpu size={32} className="text-purple-400" />,
        color: "bg-purple-400/10",
    },
    {
        title: "Natural Ingredients",
        desc: "Made with natural ingredients and no artificial preservatives.",
        icon: <Shield size={32} className="text-green-400" />,
        color: "bg-green-400/10",
    },
];

export const EnergyGrid = () => {
    return (
        <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-12 lg:mb-20 px-4 relative">
                    {/* Decorative Elements */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-energy/10 rounded-full blur-2xl"
                    />
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-3 md:mb-4 text-white relative z-10"
                    >
                        PREMIUM <span className="text-energy">ENERGY</span> BENEFITS
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white/60 font-medium max-w-2xl mx-auto text-sm md:text-base lg:text-lg relative z-10"
                    >
                        Engineered for peak performance. Experience maximum energy boost with natural ingredients and zero sugar.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {benefits.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="relative group cursor-pointer h-full"
                            style={{ perspective: "1000px" }}
                        >
                            <div className={cn("absolute inset-0 rounded-[40px] md:rounded-[50px] blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700", benefit.color)} />

                            <motion.div
                                whileHover={{ rotateY: 10, rotateX: -10, translateZ: 20, scale: 1.02 }}
                                className="relative glass p-8 md:p-10 rounded-[40px] md:rounded-[50px] border-white/10 shadow-2xl overflow-hidden transition-all duration-500 h-full flex flex-col"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div className={cn("absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity", benefit.color)} />
                                
                                {/* Animated Background Gradient */}
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        opacity: [0.05, 0.15, 0.05]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className={cn("absolute inset-0 rounded-[50px]", benefit.color)}
                                />

                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.15 }}
                                    transition={{ duration: 0.6 }}
                                    className={`relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${benefit.color} flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                                >
                                    {benefit.icon}
                                </motion.div>

                                <h3 className="relative z-10 text-xl md:text-2xl lg:text-3xl font-black mb-3 md:mb-4 uppercase tracking-tighter leading-none italic text-white">{benefit.title}</h3>
                                <p className="relative z-10 text-white/60 font-medium leading-relaxed text-sm md:text-base lg:text-lg flex-grow">{benefit.desc}</p>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileHover={{ opacity: 1, x: 0 }}
                                    className="mt-8 flex items-center gap-2 text-energy font-black text-[10px] md:text-xs uppercase tracking-widest translate-y-4 md:translate-y-0 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all relative z-10"
                                >
                                    Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
