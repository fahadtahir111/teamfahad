"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Zap, Droplets, Wind, ShoppingCart, Sparkles } from "lucide-react";
import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/Magnetic";
import { useCart } from "@/context/CartContext";
import { usdToPkr } from "@/lib/currency";

interface Flavor {
    id: string;
    name: string;
    fullName: string;
    color: string;
    bgColor: string;
    shadow: string;
    image: string;
    accent: string;
    description: string;
    caffeine: number;
    calories: number;
    sugar: number;
    intensity: number;
    tags: string[];
    ingredients: string[];
}

const flavors: Flavor[] = [
    {
        id: "vanilla",
        name: "PURE VANILLA",
        fullName: "Pure Vanilla",
        color: "#FFFDD0",
        bgColor: "bg-[#FFFDD0]",
        shadow: "shadow-[#FFFDD0]/50",
        image: "/images/vanilla.png",
        accent: "#F3E5AB",
        description: "A silky smooth energy experience that feels like liquid velvet. Indulge in the creamy richness that elevates your consciousness.",
        caffeine: 200,
        calories: 10,
        sugar: 0,
        intensity: 7,
        tags: ["Smooth", "Creamy", "Luxury"],
        ingredients: ["Vanilla Extract", "Natural Caffeine", "B-Vitamins", "Taurine"]
    },
    {
        id: "peach",
        name: "PEACH SURGE",
        fullName: "Peach Surge",
        color: "#FFDAB9",
        bgColor: "bg-[#FFDAB9]",
        shadow: "shadow-[#FFDAB9]/50",
        image: "/images/peach.png",
        accent: "#FDBA74",
        description: "Floral notes meet explosive kinetic potential. A tropical storm of energy that electrifies your senses.",
        caffeine: 220,
        calories: 15,
        sugar: 2,
        intensity: 9,
        tags: ["Tropical", "Explosive", "Vibrant"],
        ingredients: ["Peach Essence", "Citrus Blend", "Natural Caffeine", "Guarana"]
    },
    {
        id: "mint",
        name: "MINTY MOTION",
        fullName: "Minty Motion",
        color: "#98FFED",
        bgColor: "bg-[#98FFED]",
        shadow: "shadow-[#98FFED]/50",
        image: "/images/mint.png",
        accent: "#98FFED",
        description: "Arctic energy to cool your core and charge your soul. Refreshing mint that awakens every molecule.",
        caffeine: 180,
        calories: 8,
        sugar: 0,
        intensity: 6,
        tags: ["Refreshing", "Cooling", "Clean"],
        ingredients: ["Peppermint Oil", "Natural Caffeine", "L-Carnitine", "Green Tea Extract"]
    },
    {
        id: "berry",
        name: "BERRY BLAST",
        fullName: "Berry Blast",
        color: "#D8B4FE",
        bgColor: "bg-[#D8B4FE]",
        shadow: "shadow-[#D8B4FE]/50",
        image: "/images/berryblast.png",
        accent: "#A78BFA",
        description: "A burst of wild berry energy that ignites your primal power. Nature's most potent flavors in one explosive can.",
        caffeine: 210,
        calories: 12,
        sugar: 1,
        intensity: 8,
        tags: ["Bold", "Fruity", "Powerful"],
        ingredients: ["Mixed Berries", "Natural Caffeine", "Ginseng", "B-Vitamins"]
    }
];

export default function FlavoursPage() {
    const [selectedFlavor, setSelectedFlavor] = useState<Flavor>(flavors[0]);
    const [addedToCart, setAddedToCart] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);
    const { addToCart } = useCart();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

    // Handle image loading
    const handleImageLoad = (imagePath: string) => {
        setImagesLoaded((prev) => {
            const newSet = new Set(prev);
            newSet.add(imagePath);
            return newSet;
        });
    };

    // Check if all initial images are loaded
    useEffect(() => {
        if (imagesLoaded.size >= flavors.length) {
            setTimeout(() => setIsLoading(false), 300);
        }
    }, [imagesLoaded]);

    // Fallback timeout to ensure page loads even if images fail
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 3000); // Max 3 seconds loading time
        return () => clearTimeout(timeout);
    }, []);

    // Preload all flavor images
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // Use HTMLImageElement to avoid conflict with Next.js Image component
        const ImageConstructor = window.HTMLImageElement || (window as any).Image;
        
        flavors.forEach((flavor) => {
            const img = document.createElement('img');
            img.src = flavor.image;
            img.onload = () => handleImageLoad(flavor.image);
            img.onerror = () => handleImageLoad(flavor.image); // Still mark as loaded to prevent infinite loading
        });
    }, []);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden">
            {/* Loading Overlay */}
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
                                Loading Flavors...
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ParticleBackground color={selectedFlavor.accent} />

            {/* Hero Section */}
            <motion.section
                style={{ opacity: heroOpacity, y: heroY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative min-h-screen flex items-center justify-center px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20"
            >
                <div className="max-w-7xl w-full mx-auto">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: isLoading ? 0 : 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-center mb-8 md:mb-12 lg:mb-16"
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full glass mb-4 md:mb-6 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white shadow-xl"
                        >
                            <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-energy" />
                            Energy Flavours
                        </motion.div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-[10rem] font-black italic tracking-tighter mb-4 md:mb-6 uppercase leading-[0.85] text-white">
                            EXPLORE <br className="sm:hidden" />
                            <span className="text-energy">ENERGY FLAVORS</span>
                        </h1>
                        <p className="text-sm md:text-base lg:text-lg xl:text-xl text-white/50 max-w-2xl mx-auto font-medium px-4">
                            Each flavor delivers maximum energy boost. Discover premium energy drinks with explosive flavors.
                        </p>
                    </motion.div>

                    {/* Flavor Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-5xl mx-auto px-4">
                        {flavors.map((flavor, idx) => (
                            <motion.button
                                key={flavor.id}
                                onClick={() => setSelectedFlavor(flavor)}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: isLoading ? 0 : 1, y: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "relative glass rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 aspect-square flex flex-col items-center justify-center transition-all duration-300 border-2",
                                    selectedFlavor.id === flavor.id
                                        ? "border-white scale-105 shadow-2xl"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                )}
                            >
                                <div className="relative w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 lg:w-32 lg:h-40 mb-2 md:mb-4">
                                    <Image
                                        src={flavor.image}
                                        alt={flavor.name}
                                        fill
                                        className="object-contain drop-shadow-2xl transition-opacity duration-500"
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        loading="lazy"
                                        quality={85}
                                        onLoad={() => handleImageLoad(flavor.image)}
                                    />
                                </div>
                                <span className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-widest text-white text-center px-1">
                                    {flavor.name}
                                </span>
                                {selectedFlavor.id === flavor.id && (
                                    <motion.div
                                        layoutId="selectedIndicator"
                                        className="absolute -bottom-2 w-12 h-1 bg-energy rounded-full"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Detailed Flavor Showcase */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative min-h-screen flex items-center justify-center px-4 md:px-6 py-16 md:py-24 lg:py-32"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedFlavor.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                        className="max-w-7xl w-full mx-auto"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
                            {/* Left: Product Image */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative flex items-center justify-center"
                            >
                                <div className="relative w-full max-w-md aspect-[3/4]">
                                    {/* Glow Background */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.2, 0.4, 0.2]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className={cn("absolute inset-0 rounded-[60px] blur-[100px]", selectedFlavor.bgColor)}
                                    />

                                    {/* Main Image Card */}
                                    <motion.div
                                        whileHover={{ rotateY: 5, rotateX: -5 }}
                                        className="relative w-full h-full glass rounded-[60px] border-white/20 shadow-2xl flex items-center justify-center p-8 md:p-12"
                                    >
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={selectedFlavor.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.4 }}
                                                className="relative w-full h-full"
                                            >
                                                <Image
                                                    src={selectedFlavor.image}
                                                    alt={selectedFlavor.name}
                                                    fill
                                                    className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    priority
                                                    quality={90}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Floating Badge */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute -top-6 -right-6 w-20 h-20 bg-energy rounded-full shadow-2xl flex flex-col items-center justify-center z-30 border-4 border-white/20"
                                    >
                                        <Zap className="text-white w-8 h-8 mb-1" />
                                        <span className="text-[8px] font-black uppercase text-white tracking-widest">Energy</span>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Right: Product Details */}
                            <div className="space-y-8">
                                <div>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-energy font-black tracking-widest uppercase mb-4 block text-sm"
                                    >
                                        {selectedFlavor.tags.join(" • ")}
                                    </motion.span>
                                    <motion.h2
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black italic tracking-tighter mb-4 md:mb-6 uppercase text-white"
                                    >
                                        {selectedFlavor.fullName}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-base md:text-lg lg:text-xl text-white/70 font-medium leading-relaxed"
                                    >
                                        {selectedFlavor.description}
                                    </motion.p>
                                </div>

                                {/* Nutrition Stats */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="grid grid-cols-3 gap-3 md:gap-4"
                                >
                                    <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl text-center border border-white/10">
                                        <Zap className="text-energy w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                                        <span className="font-black text-xl md:text-2xl lg:text-3xl block mb-1">{selectedFlavor.caffeine}MG</span>
                                        <span className="text-[10px] md:text-xs uppercase font-bold text-white/50 tracking-wider">Caffeine</span>
                                    </div>
                                    <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl text-center border border-white/10">
                                        <Droplets className="text-blue-400 w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                                        <span className="font-black text-xl md:text-2xl lg:text-3xl block mb-1">{selectedFlavor.calories}</span>
                                        <span className="text-[10px] md:text-xs uppercase font-bold text-white/50 tracking-wider">Calories</span>
                                    </div>
                                    <div className="glass p-4 md:p-6 rounded-xl md:rounded-2xl text-center border border-white/10">
                                        <Wind className="text-green-400 w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2" />
                                        <span className="font-black text-xl md:text-2xl lg:text-3xl block mb-1">{selectedFlavor.sugar}G</span>
                                        <span className="text-[10px] md:text-xs uppercase font-bold text-white/50 tracking-wider">Sugar</span>
                                    </div>
                                </motion.div>

                                {/* Intensity Meter */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="glass p-6 rounded-2xl border border-white/10"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold uppercase tracking-wider text-white/70">Intensity</span>
                                        <span className="font-black text-xl">{selectedFlavor.intensity}/10</span>
                                    </div>
                                    <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${selectedFlavor.intensity * 10}%` }}
                                            transition={{ duration: 1, delay: 0.8 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: selectedFlavor.color }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Ingredients */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="glass p-6 rounded-2xl border border-white/10"
                                >
                                    <h3 className="text-sm font-black uppercase tracking-wider mb-4 text-white/70">Key Ingredients</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {selectedFlavor.ingredients.map((ingredient, idx) => (
                                            <motion.div
                                                key={ingredient}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.9 + idx * 0.1 }}
                                                className="flex items-center gap-2"
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: selectedFlavor.color }}
                                                />
                                                <span className="text-sm font-medium text-white/60">{ingredient}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* CTA Button */}
                                <Magnetic>
                                    <motion.button
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            // Map flavor IDs to product IDs and prices (in PKR)
                                            const flavorToProduct: Record<string, { id: number; price: number }> = {
                                                vanilla: { id: 1, price: usdToPkr(3.99) },
                                                peach: { id: 2, price: usdToPkr(4.49) },
                                                mint: { id: 3, price: usdToPkr(4.49) },
                                                berry: { id: 4, price: usdToPkr(3.99) }
                                            };
                                            const product = flavorToProduct[selectedFlavor.id];
                                            if (product) {
                                                addToCart({
                                                    id: product.id,
                                                    name: selectedFlavor.name,
                                                    price: product.price,
                                                    image: selectedFlavor.image,
                                                    color: selectedFlavor.bgColor
                                                });
                                                setAddedToCart(true);
                                                setTimeout(() => setAddedToCart(false), 2000);
                                            }
                                        }}
                                        className={cn(
                                            "w-full py-6 md:py-7 text-black rounded-full font-black text-xl md:text-2xl flex items-center justify-center gap-4 shadow-2xl transition-all",
                                            selectedFlavor.bgColor,
                                            selectedFlavor.shadow,
                                            addedToCart && "bg-green-500"
                                        )}
                                    >
                                        <ShoppingCart className="w-6 h-6" />
                                        {addedToCart ? "ADDED TO CART!" : "ADD TO CART"}
                                    </motion.button>
                                </Magnetic>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.section>

            {/* Comparison Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative py-16 md:py-24 lg:py-32 px-4 md:px-6 border-t border-white/5"
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black italic tracking-tighter mb-3 md:mb-4 uppercase text-white">
                            COMPARE <span className="text-energy">FLAVORS</span>
                        </h2>
                        <p className="text-sm md:text-base lg:text-lg text-white/50 max-w-xl mx-auto px-4">
                            Find your perfect energy match with our comprehensive comparison
                        </p>
                    </motion.div>

                    {/* Comparison Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="glass-dark rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-10 overflow-x-auto"
                    >
                        <div className="min-w-[600px]">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-4 px-4 text-xs font-black uppercase tracking-widest text-white/50">Flavor</th>
                                        <th className="text-center py-4 px-4 text-xs font-black uppercase tracking-widest text-white/50">Caffeine</th>
                                        <th className="text-center py-4 px-4 text-xs font-black uppercase tracking-widest text-white/50">Calories</th>
                                        <th className="text-center py-4 px-4 text-xs font-black uppercase tracking-widest text-white/50">Sugar</th>
                                        <th className="text-center py-4 px-4 text-xs font-black uppercase tracking-widest text-white/50">Intensity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {flavors.map((flavor, idx) => (
                                        <motion.tr
                                            key={flavor.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                                            onClick={() => {
                                                setSelectedFlavor(flavor);
                                                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                                            }}
                                        >
                                            <td className="py-6 px-4">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-12 h-12 rounded-xl flex-shrink-0"
                                                        style={{ backgroundColor: flavor.color }}
                                                    />
                                                    <span className="font-black text-white">{flavor.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-center py-6 px-4 font-black text-white">{flavor.caffeine}MG</td>
                                            <td className="text-center py-6 px-4 font-black text-white">{flavor.calories}</td>
                                            <td className="text-center py-6 px-4 font-black text-white">{flavor.sugar}G</td>
                                            <td className="text-center py-6 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-20 h-2 bg-black/20 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${flavor.intensity * 10}%`,
                                                                backgroundColor: flavor.color
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="font-black text-white text-sm">{flavor.intensity}/10</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}

