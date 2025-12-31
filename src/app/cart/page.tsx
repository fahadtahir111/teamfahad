"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Magnetic } from "@/components/Magnetic";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
    const total = getTotalPrice();
    const itemCount = getTotalItems();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 flex items-center justify-center">
                <div className="max-w-2xl w-full text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-dark p-8 md:p-12 rounded-[40px] md:rounded-[60px]"
                    >
                        <ShoppingBag className="w-16 h-16 md:w-24 md:h-24 text-white/20 mx-auto mb-6" />
                        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4 text-white uppercase">
                            Your Cart is <span className="text-energy">Empty</span>
                        </h1>
                        <p className="text-white/50 mb-8 text-sm md:text-base">
                            Add some energy drinks to power up your day!
                        </p>
                        <Magnetic>
                            <Link
                                href="/shop"
                                className="inline-block px-8 py-4 md:px-12 md:py-5 bg-energy text-white rounded-full font-black text-base md:text-lg flex items-center justify-center gap-2 mx-auto hover:scale-105 transition-transform"
                            >
                                <Zap className="w-5 h-5" />
                                SHOP NOW
                            </Link>
                        </Magnetic>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 md:mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black italic tracking-tighter mb-2 text-white uppercase">
                        Your <span className="text-energy">Cart</span>
                    </h1>
                    <p className="text-white/50 text-sm md:text-base">
                        {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence>
                            {cart.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-dark p-4 md:p-6 rounded-[24px] md:rounded-[32px] flex flex-col sm:flex-row gap-4 md:gap-6"
                                >
                                    {/* Product Image */}
                                    <div className="relative w-full sm:w-32 md:w-40 h-48 sm:h-32 md:h-40 flex-shrink-0 rounded-2xl overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-contain"
                                            sizes="(max-width: 640px) 100vw, 160px"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-black italic text-white mb-2 uppercase tracking-tight">
                                                {item.name}
                                            </h3>
                                            <p className="text-energy font-bold text-lg md:text-xl">
                                                ${item.price.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg glass flex items-center justify-center text-white hover:bg-energy transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-white font-black text-lg md:text-xl w-12 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg glass flex items-center justify-center text-white hover:bg-energy transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-2 md:p-3 rounded-lg glass text-white/70 hover:text-energy hover:bg-energy/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                            </button>
                                        </div>

                                        <div className="mt-2 text-right">
                                            <p className="text-white/50 text-sm">
                                                Subtotal: <span className="text-energy font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-dark p-6 md:p-8 rounded-[32px] md:rounded-[40px] sticky top-24"
                        >
                            <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-6 text-white uppercase">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-white/70 text-sm md:text-base">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-white/70 text-sm md:text-base">
                                    <span>Shipping</span>
                                    <span className="text-energy">FREE</span>
                                </div>
                                <div className="h-px bg-white/10 my-4" />
                                <div className="flex justify-between text-white text-lg md:text-xl font-black">
                                    <span>Total</span>
                                    <span className="text-energy">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Magnetic>
                                <Link
                                    href="/checkout"
                                    className="w-full py-4 md:py-5 bg-energy text-white rounded-full font-black text-base md:text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-energy/20"
                                >
                                    PROCEED TO CHECKOUT
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Magnetic>

                            <Link
                                href="/shop"
                                className="block text-center mt-4 text-white/50 hover:text-energy text-sm md:text-base transition-colors"
                            >
                                Continue Shopping
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}


