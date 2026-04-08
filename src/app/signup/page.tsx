"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = "/login";
            } else {
                setError(data.error || "Something went wrong");
            }
        } catch (err) {
            setError("Failed to connect to the server");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-energy/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-energy/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <Link href="/" className="text-4xl font-black tracking-tighter inline-block mb-4">
                        BUBBLOE<span className="text-energy italic">.DRNK</span>
                    </Link>
                    <h1 className="text-2xl font-black italic">CREATE <span className="text-energy">ACCOUNT</span></h1>
                    <p className="text-white/40 mt-2">Join the elite energy revolution.</p>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[32px] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-energy transition-colors"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-energy transition-colors"
                                placeholder="user@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Password</label>
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
                                    GET STARTED <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/40 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-energy font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
