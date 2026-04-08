"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                window.location.href = "/admin"; // Or redirect based on role
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden text-white">
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-energy/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="text-4xl font-black tracking-tighter inline-block mb-4">
                        BUBBLOE<span className="text-energy italic">.DRNK</span>
                    </Link>
                    <h1 className="text-2xl font-black italic">WELCOME <span className="text-energy">BACK</span></h1>
                    <p className="text-white/40 mt-2">Access the energy control center.</p>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[32px] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-energy transition-colors"
                                placeholder="admin@bubbloe.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black uppercase tracking-widest text-white/40">Password</label>
                                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-energy/60 hover:text-energy">Forgot?</Link>
                            </div>
                            <input
                                required
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-energy transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-energy text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_10px_30px_rgba(255,215,0,0.15)]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    SECURE LOGIN <Lock size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/40 text-sm">
                            New to the revolution?{" "}
                            <Link href="/signup" className="text-energy font-bold hover:underline">
                                Join Now
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
