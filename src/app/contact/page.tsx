"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Send } from "lucide-react";

export default function ContactPage() {
    const [formState, setFormState] = useState("idle");

    // Mouse move effect for the form container
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x);
    const mouseY = useSpring(y);

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("submitting");
        setTimeout(() => setFormState("success"), 2000);
    };

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 flex items-center justify-center overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mint/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative z-10 w-full max-w-2xl glass p-6 md:p-8 lg:p-12 rounded-[32px] md:rounded-[40px] shadow-2xl"
            >
                <header className="mb-10 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter mb-3 md:mb-4 text-white">
                        GET IN <span className="text-energy uppercase">TOUCH</span>
                    </h1>
                    <p className="text-white/60 font-medium text-sm md:text-base">
                        Have questions about our energy drinks? We're here to help you power up your day.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/50 ml-2 md:ml-4 mb-1 md:mb-2 block">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 outline-none focus:border-energy/50 transition-colors text-white font-medium placeholder-white/30"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/50 ml-2 md:ml-4 mb-1 md:mb-2 block">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 outline-none focus:border-energy/50 transition-colors text-white font-medium placeholder-white/30"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/50 ml-2 md:ml-4 mb-1 md:mb-2 block">Message</label>
                        <textarea
                            rows={4}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 outline-none focus:border-energy/50 transition-colors text-white font-medium resize-none placeholder-white/30"
                            placeholder="What's on your mind?"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-xl flex items-center justify-center gap-3 transition-all ${formState === "success" ? "bg-green-500" : "bg-energy"
                            } text-white shadow-xl shadow-energy/20`}
                        disabled={formState === "submitting"}
                    >
                        {formState === "idle" && (
                            <>
                                SEND TRANSMISSION
                                <Send className="w-6 h-6" />
                            </>
                        )}
                        {formState === "submitting" && (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                            />
                        )}
                        {formState === "success" && "MESSAGE RECEIVED"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
