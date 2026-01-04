"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";

import { formatUsdToPkr, usdToPkr } from "@/lib/currency";


const products = [
     { id: 1, name: "PURE VANILLA", price: formatUsdToPkr(1.08), priceNum: usdToPkr(1.08), image: "/images/vanilla.png", color: "bg-[#FFFDD0]" },
    { id: 2, name: "PEACH SURGE", price: formatUsdToPkr(1.08), priceNum: usdToPkr(1.08), image: "/images/peach.png", color: "bg-[#FFDAB9]" },
    { id: 3, name: "MINTY MOTION", price: formatUsdToPkr(1.08), priceNum: usdToPkr(1.08), image: "/images/mint.png", color: "bg-[#98FFED]" },
    { id: 4, name: "BERRY BLAST", price: formatUsdToPkr(1.08), priceNum: usdToPkr(1.08), image: "/images/berryblast.png", color: "bg-[#D8B4FE]" },

];

export default function ShopPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
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
                                Loading Shop...
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
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8 md:mb-16 text-center">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: isLoading ? 0 : 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-3 md:mb-4 text-white"
                        >
                            ENERGY <span className="text-energy italic">SHOP</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: isLoading ? 0 : 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/60 font-medium max-w-xl mx-auto text-sm md:text-base"
                        >
                            Premium energy drinks engineered for peak performance. Experience explosive flavors with maximum energy boost.
                        </motion.p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: isLoading ? 0 : 1, y: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                            >
                                <GlassCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
