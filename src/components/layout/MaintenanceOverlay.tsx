"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Instagram, Twitter, MessageCircle } from "lucide-react";

interface MaintenanceOverlayProps {
    message: string;
    socialLinks: {
        instagram?: string;
        twitter?: string;
        discord?: string;
    };
}

export const MaintenanceOverlay = ({ message, socialLinks }: MaintenanceOverlayProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center p-6"
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-energy/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-xl w-full text-center space-y-12 relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-24 h-24 bg-energy/10 border border-energy/20 rounded-[32px] flex items-center justify-center mx-auto text-energy shadow-[0_0_50px_rgba(255,215,0,0.1)]"
                >
                    <ShieldAlert size={48} strokeWidth={1.5} />
                </motion.div>

                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter italic">
                        SYSTEMS <span className="text-energy">UPGRADING</span>
                    </h1>
                    <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-sm">
                        {message || "WE ARE CURRENTLY UPGRADING OUR SYSTEMS. PLEASE CHECK BACK SOON!"}
                    </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />

                <div className="space-y-6">
                    <p className="text-xs font-black uppercase tracking-widest text-white/20">Follow our mission</p>
                    <div className="flex items-center justify-center gap-6">
                        {socialLinks.instagram && (
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-energy hover:bg-white/10 transition-all border border-white/5">
                                <Instagram size={24} />
                            </a>
                        )}
                        {socialLinks.twitter && (
                            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-energy hover:bg-white/10 transition-all border border-white/5">
                                <Twitter size={24} />
                            </a>
                        )}
                        {socialLinks.discord && (
                            <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-energy hover:bg-white/10 transition-all border border-white/5">
                                <MessageCircle size={24} />
                            </a>
                        )}
                    </div>
                </div>

                <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">© 2026 BUBBLOE ENERGY CORP</p>
            </div>
        </motion.div>
    );
};
