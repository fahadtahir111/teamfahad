"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    Package,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Order {
    id: string;
    totalAmount: string;
    status: string;
    createdAt: string;
    items: any[];
}

export default function UserOrdersPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/orders?email=${session.user.email}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setOrders(data);
                    } else {
                        setOrders([]);
                    }
                    setIsLoading(false);
                });
        }
    }, [session]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "text-green-400 bg-green-500/10";
            case "SHIPPED": return "text-blue-400 bg-blue-500/10";
            case "PROCESSING": return "text-yellow-400 bg-yellow-500/10";
            default: return "text-purple-400 bg-purple-500/10";
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white">
                <div className="text-center space-y-6">
                    <h1 className="text-4xl font-black italic">PLEASE <span className="text-energy">SIGN IN</span></h1>
                    <Link href="/login" className="inline-block bg-energy text-black font-black px-8 py-4 rounded-2xl">
                        LOGIN TO VIEW ORDERS
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 text-white">
            <div className="max-w-4xl mx-auto space-y-12">
                <header>
                    <h1 className="text-5xl font-black tracking-tight">MY <span className="text-energy italic">PURCHASES</span></h1>
                    <p className="text-white/40 mt-2 font-medium">History of your energy drink missions.</p>
                </header>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center p-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-energy/20 border-t-energy rounded-full"
                            />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[32px] text-center space-y-6">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                <Package size={40} className="text-white/20" />
                            </div>
                            <h3 className="text-2xl font-bold">No orders found</h3>
                            <Link href="/shop" className="text-energy font-black inline-flex items-center gap-2 hover:gap-4 transition-all">
                                START SHOPPING <ArrowRight size={20} />
                            </Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[32px] group hover:border-energy/20 transition-all"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-energy font-black uppercase tracking-tighter text-xl">
                                                #{order.id.slice(-6)}
                                            </span>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-white/40 text-sm">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Items</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-white/40 font-black uppercase tracking-widest mb-1">Total</p>
                                        <p className="text-3xl font-black">Rs {Number(order.totalAmount).toLocaleString()}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
