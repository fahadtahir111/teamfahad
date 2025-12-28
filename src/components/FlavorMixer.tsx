"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Flavor {
    id: string;
    name: string;
    color: string;
    textColor: string;
    desc: string;
    tags: string[];
}

interface FlavorMixerProps {
    flavors: Flavor[];
}

export const FlavorMixer: React.FC<FlavorMixerProps> = ({ flavors }) => {
    const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([]);
    const [mixedColor, setMixedColor] = useState<string>("#FFFFFF");
    const [isMixing, setIsMixing] = useState(false);

    const toggleFlavor = (flavor: Flavor) => {
        if (selectedFlavors.find(f => f.id === flavor.id)) {
            setSelectedFlavors(selectedFlavors.filter(f => f.id !== flavor.id));
        } else if (selectedFlavors.length < 3) {
            setSelectedFlavors([...selectedFlavors, flavor]);
        }
    };

    const blendColors = (colors: string[]): string => {
        if (colors.length === 0) return "#FFFFFF";

        let r = 0, g = 0, b = 0;
        colors.forEach(color => {
            const hex = color.replace('#', '');
            r += parseInt(hex.substr(0, 2), 16);
            g += parseInt(hex.substr(2, 2), 16);
            b += parseInt(hex.substr(4, 2), 16);
        });

        r = Math.floor(r / colors.length);
        g = Math.floor(g / colors.length);
        b = Math.floor(b / colors.length);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const mixFlavors = () => {
        if (selectedFlavors.length < 2) return;

        setIsMixing(true);
        const colors = selectedFlavors.map(f => f.color);
        const blended = blendColors(colors);

        setTimeout(() => {
            setMixedColor(blended);
            setIsMixing(false);
        }, 1500);
    };

    const getMixedName = () => {
        if (selectedFlavors.length === 0) return "Your Custom Mix";
        return selectedFlavors.map(f => f.name.split(' ')[0]).join('-');
    };

    const getMixedTags = () => {
        const allTags = selectedFlavors.flatMap(f => f.tags);
        return [...new Set(allTags)];
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-12"
            >
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
                    Flavor Laboratory
                </h2>
                <p className="text-xl text-foreground/60">Mix up to 3 flavors to create your perfect blend</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Flavor Selection */}
                <div>
                    <h3 className="text-2xl font-black uppercase mb-6 tracking-wider">Select Flavors</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {flavors.map((flavor) => {
                            const isSelected = selectedFlavors.find(f => f.id === flavor.id);
                            const isDisabled = !isSelected && selectedFlavors.length >= 3;

                            return (
                                <motion.button
                                    key={flavor.id}
                                    onClick={() => !isDisabled && toggleFlavor(flavor)}
                                    disabled={isDisabled}
                                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                    className={cn(
                                        "p-6 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                        isSelected ? "ring-4 ring-white shadow-2xl" : "glass",
                                        isDisabled && "opacity-30 cursor-not-allowed"
                                    )}
                                    style={{
                                        backgroundColor: isSelected ? flavor.color : undefined,
                                        color: isSelected ? flavor.textColor : undefined
                                    }}
                                >
                                    <div className="relative z-10">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full mb-3 mx-auto",
                                            isSelected ? "bg-white/30" : ""
                                        )} style={{ backgroundColor: !isSelected ? flavor.color : undefined }} />
                                        <p className="font-black uppercase text-sm tracking-wider">
                                            {flavor.name}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            layoutId={`selected-${flavor.id}`}
                                            className="absolute inset-0 bg-white/10"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    <motion.button
                        onClick={mixFlavors}
                        disabled={selectedFlavors.length < 2 || isMixing}
                        whileHover={selectedFlavors.length >= 2 ? { scale: 1.05 } : {}}
                        whileTap={selectedFlavors.length >= 2 ? { scale: 0.95 } : {}}
                        className={cn(
                            "w-full mt-8 py-4 rounded-2xl font-black uppercase tracking-wider text-lg transition-all",
                            selectedFlavors.length >= 2
                                ? "bg-gradient-to-r from-energy to-purple-500 text-white shadow-lg shadow-energy/50"
                                : "glass opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isMixing ? "Mixing..." : "Mix Flavors"}
                    </motion.button>
                </div>

                {/* Mixed Result */}
                <div>
                    <h3 className="text-2xl font-black uppercase mb-6 tracking-wider">Your Creation</h3>
                    <div className="glass rounded-3xl p-8 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {isMixing ? (
                                <motion.div
                                    key="mixing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-[400px]"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-32 h-32 rounded-full border-8 border-dashed border-energy mb-6"
                                    />
                                    <p className="text-2xl font-black uppercase tracking-wider animate-pulse">
                                        Mixing Flavors...
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="space-y-6"
                                >
                                    <div
                                        className="w-full h-48 rounded-2xl flex items-center justify-center relative overflow-hidden"
                                        style={{ backgroundColor: mixedColor }}
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 bg-white/20 blur-3xl"
                                        />
                                        <p className="text-4xl font-black uppercase relative z-10 mix-blend-difference text-white">
                                            {getMixedName()}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-black uppercase mb-3 tracking-wider">
                                            Selected Flavors
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedFlavors.map((flavor) => (
                                                <span
                                                    key={flavor.id}
                                                    className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider"
                                                    style={{
                                                        backgroundColor: flavor.color,
                                                        color: flavor.textColor
                                                    }}
                                                >
                                                    {flavor.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {getMixedTags().length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-black uppercase mb-3 tracking-wider">
                                                Flavor Profile
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {getMixedTags().map((tag, i) => (
                                                    <motion.span
                                                        key={tag}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="px-3 py-1 rounded-full glass text-xs font-bold uppercase tracking-wider"
                                                    >
                                                        {tag}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
