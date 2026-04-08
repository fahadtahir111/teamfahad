"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Zap, Droplets, Wind } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number | string;
    image: string;
    color: string;
    categoryId: string;
    inventory: number;
}

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (!isLoading && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">PRODUCT NOT FOUND</h1>
                    <Link href="/shop" className="text-energy hover:underline">Return to Shop</Link>
                </div>
            </div>
        );
    }

    const displayPrice = product ? (typeof product.price === "number"
        ? `Rs ${product.price.toLocaleString()}`
        : product.price) : "";

    const isOutOfStock = product ? product.inventory === 0 : false;
    const isLowStock = product ? (product.inventory > 0 && product.inventory < 10) : false;

    return (
        <div className="relative min-h-screen bg-background">
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
                                Loading Product...
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {product && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoading ? 0 : 1 }}
                    transition={{ duration: 0.8 }}
                    className="pb-20"
                >
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="fixed top-24 left-10 z-50"
                    >
                        <Link
                            href="/shop"
                            className="glass p-4 rounded-full flex items-center gap-2 font-bold hover:bg-energy hover:text-black transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            BACK TO SHOP
                        </Link>
                    </motion.div>

                    {/* Main Product Section */}
                    <div className="container mx-auto px-6 pt-32 pb-16">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
                            {/* Product Image */}
                            <div className="relative w-full md:w-1/2 max-w-md">
                                <div className="relative aspect-square bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className={cn(
                                            "object-contain p-8",
                                            isOutOfStock && "grayscale opacity-50"
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="w-full md:w-1/2 max-w-lg">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-energy font-black tracking-widest uppercase text-sm">
                                            Premium Energy
                                        </span>
                                        {isOutOfStock ? (
                                            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold uppercase">
                                                Out of Stock
                                            </span>
                                        ) : isLowStock ? (
                                            <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-xs font-bold uppercase">
                                                Low Stock: {product.inventory}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold uppercase">
                                                In Stock: {product.inventory}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 uppercase">
                                        {product.name}
                                    </h1>
                                    <p className="text-3xl font-bold text-energy mb-6">
                                        {displayPrice}
                                    </p>
                                    <p className="text-lg text-foreground/70 mb-10 font-medium">
                                        {product.description || "The ultimate energy boost to power your day."}
                                    </p>

                                    {/* Nutrition Indicators */}
                                    <div className="grid grid-cols-3 gap-4 mb-10">
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
                                        whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                                        whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                                        disabled={isOutOfStock}
                                        onClick={() => {
                                            if (isOutOfStock) return;
                                            const priceNum = typeof product.price === 'number' ? product.price : parseFloat(String(product.price)) || 0;
                                            addToCart({
                                                id: String(product.id),
                                                name: product.name,
                                                price: priceNum,
                                                image: product.image,
                                                color: product.color,
                                            });
                                            setAddedToCart(true);
                                            setTimeout(() => setAddedToCart(false), 2000);
                                        }}
                                        className={cn(
                                            "w-full py-5 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-lg transition-all",
                                            isOutOfStock ? "bg-gray-500 cursor-not-allowed" : addedToCart ? "bg-green-500" : "bg-energy hover:bg-energy/90"
                                        )}
                                    >
                                        <ShoppingCart className="w-6 h-6" />
                                        {isOutOfStock ? "OUT OF STOCK" : addedToCart ? "ADDED TO CART!" : "ADD TO CART"}
                                    </motion.button>
                                </motion.div>
                            </div>
                        </div>

                        {/* Article / Description Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="mt-20 max-w-4xl mx-auto"
                        >
                            <div className="glass rounded-3xl p-8 md:p-12 border border-white/10">
                                <h2 className="text-3xl md:text-4xl font-black uppercase mb-6 text-energy">
                                    About This Product
                                </h2>
                                <div className="space-y-6 text-foreground/80 leading-relaxed">
                                    <p className="text-lg">
                                        {product.name} is crafted with precision to deliver the perfect energy boost when you need it most.
                                        Our unique formula combines premium ingredients to provide sustained energy without the crash.
                                    </p>
                                    <p className="text-lg">
                                        {product.description || "Experience the perfect blend of taste and performance. Each can is packed with essential vitamins, natural caffeine, and zero sugar to keep you energized throughout your day."}
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-black text-xl mb-3 text-energy uppercase">Key Benefits</h3>
                                            <ul className="space-y-2 text-foreground/70">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-energy mt-1">•</span>
                                                    <span>Instant energy boost with 200mg natural caffeine</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-energy mt-1">•</span>
                                                    <span>Zero sugar for guilt-free energy</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-energy mt-1">•</span>
                                                    <span>100% natural ingredients</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-energy mt-1">•</span>
                                                    <span>Enhanced focus and mental clarity</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h3 className="font-black text-xl mb-3 text-energy uppercase">Perfect For</h3>
                                            <ul className="space-y-2 text-foreground/70">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-energy mt-1">•</span>
                                                    <span>Pre-workout energy boost</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-energy mt-1">•</span>
                                                    <span>Long study sessions</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-energy mt-1">•</span>
                                                    <span>Gaming marathons</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-energy mt-1">•</span>
                                                    <span>Busy workdays</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-energy/10 border border-energy/20 rounded-2xl">
                                        <p className="text-sm text-foreground/60 italic">
                                            <strong className="text-energy font-black not-italic">Note:</strong> This product contains caffeine.
                                            Not recommended for children, pregnant or nursing women, or individuals sensitive to caffeine.
                                            Please consume responsibly.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
