"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Flavor {
    id: string;
    name: string;
    color: string;
    textColor: string;
    desc: string;
    image: string;
    caffeine: number;
    calories: number;
    sugar: number;
    intensity: number;
    tags: string[];
    ingredients: string[];
}

interface FlavorComparisonProps {
    flavor1: Flavor | null;
    flavor2: Flavor | null;
    onSelectFlavor1: (flavor: Flavor) => void;
    onSelectFlavor2: (flavor: Flavor) => void;
    availableFlavors: Flavor[];
}

export const FlavorComparison: React.FC<FlavorComparisonProps> = ({
    flavor1,
    flavor2,
    onSelectFlavor1,
    onSelectFlavor2,
    availableFlavors
}) => {
    const stats = [
        { key: "caffeine", label: "Caffeine", unit: "mg" },
        { key: "calories", label: "Calories", unit: "" },
        { key: "sugar", label: "Sugar", unit: "g" },
        { key: "intensity", label: "Intensity", unit: "/10" }
    ];

    const renderFlavorCard = (
        flavor: Flavor | null,
        onSelect: (flavor: Flavor) => void,
        position: "left" | "right"
    ) => (
        <div className="flex-1">
            <AnimatePresence mode="wait">
                {flavor ? (
                    <motion.div
                        key={flavor.id}
                        initial={{ opacity: 0, x: position === "left" ? -50 : 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: position === "left" ? -50 : 50 }}
                        className={cn(
                            "glass rounded-3xl p-8 h-full",
                            "border-2 transition-all duration-300"
                        )}
                        style={{ borderColor: flavor.color }}
                    >
                        <div className="relative w-full aspect-square mb-6">
                            <Image
                                src={flavor.image}
                                alt={flavor.name}
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                        <h3 className="text-3xl font-black uppercase mb-2">{flavor.name}</h3>
                        <p className="text-sm text-foreground/60 mb-6">{flavor.desc}</p>

                        <div className="space-y-4">
                            {stats.map((stat) => (
                                <div key={stat.key} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold uppercase tracking-wider">{stat.label}</span>
                                        <span className="font-black">
                                            {flavor[stat.key as keyof Flavor]}{stat.unit}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(Number(flavor[stat.key as keyof Flavor]) /
                                                    (stat.key === "intensity" ? 10 : 200)) * 100}%`
                                            }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: flavor.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => onSelect(flavor)}
                            className="mt-6 w-full py-3 rounded-xl glass hover:bg-white/10 transition-all font-bold uppercase tracking-wider text-sm"
                        >
                            Change Flavor
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass rounded-3xl p-8 h-full flex flex-col items-center justify-center min-h-[500px]"
                    >
                        <div className="text-6xl mb-4 opacity-20">+</div>
                        <p className="text-lg font-bold uppercase tracking-wider mb-6">Select a Flavor</p>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {availableFlavors.map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => onSelect(f)}
                                    className={cn(
                                        "p-4 rounded-xl transition-all duration-300",
                                        "hover:scale-105 font-bold uppercase text-xs tracking-wider"
                                    )}
                                    style={{ backgroundColor: f.color, color: f.textColor }}
                                >
                                    {f.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-6">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
            >
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
                    Flavor Face-Off
                </h2>
                <p className="text-xl text-foreground/60">Compare your favorites side by side</p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
                {renderFlavorCard(flavor1, onSelectFlavor1, "left")}

                <div className="flex items-center justify-center lg:w-20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 rounded-full border-4 border-dashed border-energy flex items-center justify-center"
                    >
                        <span className="text-2xl font-black">VS</span>
                    </motion.div>
                </div>

                {renderFlavorCard(flavor2, onSelectFlavor2, "right")}
            </div>
        </div>
    );
};
