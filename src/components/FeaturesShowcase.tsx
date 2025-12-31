"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Droplets, Wind, Shield, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "./Magnetic";
import Image from "next/image";

const features = [
    {
        icon: <Zap className="w-8 h-8" />,
        title: "200mg Caffeine",
        desc: "Maximum energy boost for peak performance",
        color: "text-energy",
        bgColor: "bg-energy/10",
        borderColor: "border-energy/30"
    },
    {
        icon: <Droplets className="w-8 h-8" />,
        title: "Zero Sugar",
        desc: "Clean energy without the crash",
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/30"
    },
    {
        icon: <Wind className="w-8 h-8" />,
        title: "Natural Flavors",
        desc: "Premium ingredients, no artificial preservatives",
        color: "text-green-400",
        bgColor: "bg-green-400/10",
        borderColor: "border-green-400/30"
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "B-Vitamins",
        desc: "Essential nutrients for sustained energy",
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/30"
    }
];

const stats = [
    { value: "200mg", label: "Caffeine", icon: <Zap className="w-6 h-6" /> },
    { value: "0g", label: "Sugar", icon: <Droplets className="w-6 h-6" /> },
    { value: "10", label: "Calories", icon: <Wind className="w-6 h-6" /> },
    { value: "100%", label: "Natural", icon: <Shield className="w-6 h-6" /> }
];

export const FeaturesShowcase = () => {
    return (
        <section className="relative py-16 md:py-24 lg:py-32 bg-background overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-energy/5 to-transparent" />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-energy/10 rounded-full blur-3xl"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 text-xs font-bold uppercase tracking-widest text-white"
                    >
                        <TrendingUp className="w-4 h-4 text-energy" />
                        Why Choose Bubbloe
                    </motion.div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter mb-4 md:mb-6 uppercase text-white">
                        PREMIUM <span className="text-energy">PERFORMANCE</span>
                    </h2>
                    <p className="text-white/60 font-medium max-w-2xl mx-auto text-sm md:text-base lg:text-lg">
                        Engineered for maximum energy boost with natural ingredients. Experience the difference.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="glass-dark p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/10 hover:border-energy/40 transition-all group cursor-pointer relative overflow-hidden"
                        >
                            {/* Hover Glow */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className={`absolute inset-0 ${feature.bgColor} blur-xl`}
                            />

                            <div className={`relative z-10 w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center ${feature.color} mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-black italic text-white mb-2 md:mb-3 uppercase tracking-tighter relative z-10">
                                {feature.title}
                            </h3>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed relative z-10">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-dark p-8 md:p-12 rounded-[40px] md:rounded-[60px] border border-white/10 mb-12 md:mb-16"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-energy/10 rounded-full mb-4 text-energy">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/50">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <Magnetic>
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-3 px-8 py-4 md:px-12 md:py-6 bg-energy text-white rounded-full font-black text-base md:text-lg lg:text-xl hover:scale-105 transition-transform shadow-xl shadow-energy/20"
                        >
                            EXPLORE PRODUCTS
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        </Link>
                    </Magnetic>
                </motion.div>
            </div>
        </section>
    );
};


