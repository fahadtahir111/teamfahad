"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "flex items-center gap-4 md:gap-8 min-w-max pl-6 pr-8 md:pl-8 md:pr-10 py-3 rounded-[32px] transition-all duration-700 ease-out glass-dark shadow-2xl liquid-nav",
                    isScrolled ? "scale-90 md:scale-95 pl-6 pr-8 md:pl-8 md:pr-10" : "scale-100"
                )}
            >
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        className="w-10 h-10 bg-energy rounded-[14px] flex items-center justify-center text-white font-black text-xl overflow-hidden shadow-[0_0_20px_rgba(255,69,0,0.4)]"
                        whileHover={{ rotate: 90, scale: 1.1 }}
                    >
                        B
                    </motion.div>
                    <span className="hidden md:block text-lg font-black italic tracking-tighter text-white uppercase ml-1">
                        BUBBLOE
                    </span>
                </Link>

                <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Magnetic key={link.name}>
                            <Link
                                href={link.href}
                                className="relative text-[12px] font-black uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
                            >
                                {link.name}
                            </Link>
                        </Magnetic>
                    ))}
                </div>

                <div className="h-6 w-[1px] bg-white/10" />

                <div className="flex items-center gap-2">
                    <Magnetic>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative w-10 h-10 md:w-12 md:h-12 rounded-[14px] md:rounded-[10px] glass flex items-center justify-center group"
                        >
                            <ShoppingCart className="w-5 h-5 text-white group-hover:text-energy transition-colors" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-energy text-white text-[9px] md:text-[10px] flex items-center justify-center rounded-full font-black">
                                0
                            </span>
                        </motion.button>
                    </Magnetic>

                    <button
                        className="md:hidden w-10 h-10 rounded-[14px] glass flex items-center justify-center text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="absolute top-24 left-6 right-6 glass-dark rounded-[40px] p-10 flex flex-col items-center gap-8 md:hidden border border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-[60]"
                    >
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="w-full text-center"
                            >
                                <Link
                                    href={link.href}
                                    className="text-2xl font-black uppercase tracking-[0.3em] text-white hover:text-energy transition-colors block py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

