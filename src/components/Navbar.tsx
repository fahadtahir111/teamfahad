"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, History, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Flavours", href: "/flavours" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export const Navbar = ({ settings = [] }: { settings?: any[] }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { status, data: session } = useSession();
    const { getTotalItems } = useCart();
    const cartCount = getTotalItems();

    // Add mounted state to fix hydration mismatch
    const [mounted, setMounted] = useState(false);

    const getSetting = (key: string) => settings.find(s => s.key === key)?.value;

    const isAdmin = (session?.user as any)?.role === "ADMIN";

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="fixed top-4 md:top-8 left-0 right-0 z-50 flex justify-center px-3 md:px-6">
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "flex items-center gap-2 md:gap-4 lg:gap-8 min-w-max pl-3 pr-4 md:pl-6 md:pr-8 lg:pl-8 lg:pr-10 py-2 md:py-3 rounded-[24px] md:rounded-[32px] transition-all duration-700 ease-out shadow-2xl relative",
                    isScrolled ? "scale-90 md:scale-95" : "scale-100"
                )}
            >
                {/* Background Layer with Liquid Effect */}
                <div className="absolute inset-0 rounded-[inherit] glass-dark liquid-nav overflow-hidden -z-10" />
                <Link href="/" className="flex items-center gap-1.5 md:gap-2">
                    <motion.div
                        className="w-8 h-8 md:w-10 md:h-10 bg-energy rounded-[12px] md:rounded-[14px] flex items-center justify-center text-white font-black text-lg md:text-xl overflow-hidden shadow-[0_0_20px_rgba(255,69,0,0.4)]"
                        whileHover={{ rotate: 90, scale: 1.1 }}
                    >
                        {getSetting("LOGO_CHAR") || "B"}
                    </motion.div>
                    <span className="hidden sm:block text-sm md:text-lg font-black italic tracking-tighter text-white uppercase ml-0.5 md:ml-1">
                        {getSetting("BRAND_NAME") || "BUBBLOE"}
                    </span>
                </Link>

                <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-10">
                    {navLinks.map((link) => (
                        <Magnetic key={link.name}>
                            <Link
                                href={link.href}
                                className="relative text-[10px] md:text-[11px] lg:text-[12px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
                            >
                                {link.name}
                            </Link>
                        </Magnetic>
                    ))}
                </div>

                <div className="h-6 w-[1px] bg-white/10" />

                <div className="flex items-center gap-2">
                    <Magnetic>
                        <Link href="/cart">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative w-10 h-10 md:w-12 md:h-12 rounded-[14px] md:rounded-[10px] glass flex items-center justify-center group"
                            >
                                <ShoppingCart className="w-5 h-5 text-white group-hover:text-energy transition-colors" />
                                {mounted && cartCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-energy text-white text-[9px] md:text-[10px] flex items-center justify-center rounded-full font-black"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </motion.button>
                        </Link>
                    </Magnetic>

                    <div className="h-6 w-[1px] bg-white/10 mx-1 md:mx-2" />

                    {status === "authenticated" ? (
                        <div className="relative">
                            <Magnetic>
                                <motion.button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 pl-2 pr-4 py-2 glass rounded-full border border-white/10 hover:border-energy/50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-energy flex items-center justify-center text-white font-black text-xs">
                                        {session.user?.name?.[0].toUpperCase() || "U"}
                                    </div>
                                    <ChevronDown size={14} className={cn("text-white/40 transition-transform", isProfileOpen && "rotate-180")} />
                                </motion.button>
                            </Magnetic>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full mt-4 right-0 w-64 glass-dark border border-white/10 rounded-[24px] p-4 shadow-2xl z-[100]"
                                    >
                                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                                            <p className="text-xs font-black uppercase tracking-widest text-white/40 mb-1">Signed in as</p>
                                            <p className="font-bold text-white truncate">{session.user?.email}</p>
                                        </div>

                                        <div className="space-y-1">
                                            {isAdmin && (
                                                <Link href="/admin">
                                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-energy hover:text-black transition-all text-white font-bold text-xs uppercase tracking-widest group">
                                                        <LayoutDashboard size={16} className="text-energy group-hover:text-black" />
                                                        Dashboard
                                                    </button>
                                                </Link>
                                            )}
                                            <Link href="/account/orders">
                                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-white font-bold text-xs uppercase tracking-widest">
                                                    <History size={16} className="text-white/40" />
                                                    Orders
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-white font-bold text-xs uppercase tracking-widest"
                                            >
                                                <LogOut size={16} className="text-white/40 group-hover:text-red-500" />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="hidden sm:block">
                                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white px-4 py-2">
                                    Login
                                </button>
                            </Link>
                            <Link href="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-energy text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(255,69,0,0.2)]"
                                >
                                    Join
                                </motion.button>
                            </Link>
                        </div>
                    )}

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
