"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Wind, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const benefits = [
    {
        title: "Instant Charge",
        desc: "Proprietary bio-luminescent particles provide immediate cognitive surge.",
        icon: <Zap size={32} className="text-energy" />,
        color: "bg-energy/10",
    },
    {
        title: "Zero Gravity",
        desc: "Cold-fusion carbonation means no bloating, just pure kinetic lifting.",
        icon: <Wind size={32} className="text-blue-400" />,
        color: "bg-blue-400/10",
    },
    {
        title: "Neural Link",
        desc: "Enhanced electrolytes for 2x faster synaptic transmission.",
        icon: <Cpu size={32} className="text-purple-400" />,
        color: "bg-purple-400/10",
    },
    {
        title: "Armor Plating",
        desc: "Fortified with Vitamin B-2088 for long-term neural protection.",
        icon: <Shield size={32} className="text-green-400" />,
        color: "bg-green-400/10",
    },
];

export const EnergyGrid = () => {
    return (
        <section className="py-20 md:py-32 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 text-white">
                        BUBBLOE: <span className="text-energy">TECH</span> BEHIND THE SURGE
                    </h2>
                    <p className="text-white/60 font-medium max-w-2xl mx-auto text-base md:text-lg">
                        Engineered in the future to power your present. Experience the next
                        evolution of energy infusion.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
                                whileHover={{ rotateY: 10, rotateX: -10, translateZ: 20 }}
                                className="relative glass p-8 md:p-10 rounded-[40px] md:rounded-[50px] border-white/10 shadow-2xl overflow-hidden transition-all duration-500 h-full flex flex-col"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div className={cn("absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity", benefit.color)} />

                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl ${benefit.color} flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    {benefit.icon}
                                </div>

                                <h3 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tighter leading-none italic text-white">{benefit.title}</h3>
                                <p className="text-white/60 font-medium leading-relaxed text-base md:text-lg flex-grow">{benefit.desc}</p>

                                <div className="mt-8 flex items-center gap-2 text-energy font-black text-[10px] md:text-xs uppercase tracking-widest translate-y-4 md:translate-y-0 opacity-100 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    Analyze Tech <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
