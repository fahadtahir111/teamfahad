"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";

const products = [
    { id: 1, name: "PURE VANILLA", price: "$3.99", image: "/images/vanilla.png", color: "bg-[#FFFDD0]", sizes: "33vw" },
    { id: 2, name: "PEACH SURGE", price: "$4.49", image: "/images/peach.png", color: "bg-[#FFDAB9]", sizes: "33vw" },
    { id: 3, name: "MINTY MOTION", price: "$4.49", image: "/images/mint.png", color: "bg-[#98FFED]", sizes: "33vw" },
    { id: 4, name: "BERRY BLAST", price: "$3.99", image: "/images/berryblast.png", color: "bg-[#D8B4FE]", sizes: "33vw" },
];

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-background pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 text-center">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
                    >
                        THE <span className="text-energy italic">SHOP</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-foreground/60 font-medium max-w-xl mx-auto"
                    >
                        Refuel your soul with our futuristic line-up of energy infusions.
                        Crafted for the dreamers and the doers.
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <GlassCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
