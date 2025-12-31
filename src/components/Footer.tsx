"use client";

import React from "react";
import Link from "next/link";
import { Zap, Github, Twitter, Instagram } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="bg-background border-t border-white/5 py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-energy rounded-xl flex items-center justify-center text-white font-black italic text-xl">B</div>
                        <span className="text-2xl font-black italic tracking-tighter uppercase text-white">BUBBLOE</span>
                    </div>
                    <p className="text-white/40 font-medium text-sm leading-relaxed">
                        Premium energy drinks engineered for maximum performance. Experience explosive flavors with natural ingredients.
                    </p>
                    <div className="flex flex-col gap-2">
                        <p className="text-white/50 font-bold text-xs uppercase tracking-wider">
                            CEO: <span className="text-energy">Muhammad Fahad</span>
                        </p>
                        <p className="text-white/40 font-medium text-xs">
                            Made in <span className="text-energy font-bold">Pakistan</span>
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Twitter className="w-5 h-5 text-white/40 hover:text-energy cursor-pointer transition-colors" />
                        <Instagram className="w-5 h-5 text-white/40 hover:text-energy cursor-pointer transition-colors" />
                        <Github className="w-5 h-5 text-white/40 hover:text-energy cursor-pointer transition-colors" />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white/60">Product</h4>
                    <div className="flex flex-col gap-3">
                        <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">The Original</Link>
                        <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Flavour Universe</Link>
                        <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Tech Specs</Link>
                        <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Bundles</Link>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white/60">Company</h4>
                    <div className="flex flex-col gap-3">
                        <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Philosophy</Link>
                        <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Mission</Link>
                        <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Careers</Link>
                        <Link href="#" className="text-sm font-medium text-white/40 hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>

                <div className="flex flex-col gap-6 text-right items-end justify-end">
                    <div className="bg-energy/10 p-6 rounded-[32px] border border-energy/20">
                        <Zap className="text-energy w-8 h-8 mb-2 ml-auto" />
                        <p className="text-xs font-black uppercase tracking-widest text-energy">Subscribe for drops</p>
                        <div className="mt-4 flex gap-2">
                            <input type="email" placeholder="NEURAL LINK EMAIL" className="bg-transparent border-b border-energy/40 text-[10px] py-1 font-black focus:outline-none focus:border-energy w-32" />
                            <button className="text-energy text-xs font-black">GO</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">© 2024 BUBBLOE. ALL RIGHTS RESERVED.</p>
                    <p className="text-[10px] font-medium text-white/30">
                        Made in <span className="text-energy font-bold">Pakistan</span> | CEO: <span className="text-energy font-bold">Muhammad Fahad</span>
                    </p>
                </div>
                <div className="flex gap-8">
                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-energy transition-colors italic">Privacy Policy</Link>
                    <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-energy transition-colors italic">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
};
