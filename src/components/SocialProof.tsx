"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

export const SocialProof = () => {
    const [notification, setNotification] = useState<any>(null);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                const res = await fetch("/api/admin/pulse"); // Reusing high-level activity feed
                // Note: Pulse is SSE, but we can just fetch once or use a simpler endpoint
                // For simplicity here, let's just fetch recent activities once and cycle them
                const activityRes = await fetch("/api/orders");
                const orders = await activityRes.json();

                if (orders.length > 0) {
                    const randomOrder = orders[Math.floor(Math.random() * orders.length)];
                    setNotification({
                        name: randomOrder.customerName,
                        product: randomOrder.items[0]?.product?.name || "Energy Drink",
                        time: "just now"
                    });

                    setTimeout(() => setNotification(null), 5000);
                }
            } catch (err) {
                console.error("Social proof error:", err);
            }
        };

        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 15s to show a notification
                fetchRecentActivity();
            }
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, x: -100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, x: -50 }}
                    className="fixed bottom-6 left-6 z-[100] max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 group hover:border-energy/50 transition-colors"
                >
                    <div className="w-12 h-12 bg-energy/10 rounded-xl flex items-center justify-center text-energy shrink-0 group-hover:bg-energy group-hover:text-black transition-all">
                        <ShoppingBag size={24} />
                    </div>
                    <div className="flex-1 pr-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Recent Purchase</p>
                        <p className="text-sm font-bold">
                            <span className="text-energy">{notification.name.split(' ')[0]}</span> just bought
                            <span className="italic"> {notification.product}</span>
                        </p>
                        <p className="text-[10px] text-white/20 font-medium mt-1 uppercase tracking-tighter">Verified Buyer • {notification.time}</p>
                    </div>
                    <button
                        onClick={() => setNotification(null)}
                        className="absolute top-2 right-2 text-white/10 hover:text-white transition-colors"
                    >
                        <X size={14} />
                    </button>
                    {/* Progress Bar */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-energy origin-left"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
