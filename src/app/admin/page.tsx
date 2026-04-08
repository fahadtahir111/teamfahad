"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    Users,
    Package,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    ShoppingBag,
    Box,
    AlertCircle,
    Loader2,
    Activity as ActivityIcon,
    Zap,
    History,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        customers: 0
    });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const pulseEventSource = useRef<EventSource | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, productsRes, inventoryRes] = await Promise.all([
                fetch("/api/orders"),
                fetch("/api/products"),
                fetch("/api/admin/inventory")
            ]);

            if (!ordersRes.ok || !productsRes.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const orders = await ordersRes.json();
            const products = await productsRes.json();
            const inventory = inventoryRes.ok ? await inventoryRes.json() : [];

            // Calculate business stats
            const totalRevenue = Array.isArray(orders) ? orders.reduce((sum: number, o: any) => sum + Number(o.totalAmount || 0), 0) : 0;
            const activeOrders = Array.isArray(orders) ? orders.filter((o: any) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length : 0;
            const uniqueCustomers = Array.isArray(orders) ? new Set(orders.map((o: any) => o.customerEmail)).size : 0;

            setStats({
                revenue: totalRevenue,
                orders: activeOrders,
                products: Array.isArray(products) ? products.length : 0,
                customers: uniqueCustomers
            });

            setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);

            // Filter products for low inventory alert (threshold = 10)
            if (Array.isArray(inventory)) {
                setLowStockProducts(inventory.filter((p: any) => p.currentStock <= p.lowStockThreshold).slice(0, 3));
            }

            setLastUpdate(new Date());
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setLastUpdate(new Date());
        fetchDashboardData();

        // Set up real-time polling every 5 seconds
        intervalRef.current = setInterval(() => {
            fetchDashboardData();
        }, 5000);

        // Initialize SSE Pulse
        pulseEventSource.current = new EventSource("/api/admin/pulse");
        pulseEventSource.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setActivities(Array.isArray(data) ? data : []);
        };

        return () => {
            if (pulseEventSource.current) {
                pulseEventSource.current.close();
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const dashboardStats = [
        { label: "Total Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: DollarSign, trend: "REVENUE", color: "text-green-400" },
        { label: "Active Orders", value: stats.orders.toString(), icon: ShoppingBag, trend: "PENDING", color: "text-blue-400" },
        { label: "Total Products", value: stats.products.toString(), icon: Box, trend: "CATALOG", color: "text-energy" },
        { label: "Total Customers", value: stats.customers.toString(), icon: Users, trend: "CLIENTS", color: "text-purple-400" },
    ];

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-energy" size={48} /></div>;

    return (
        <div className="space-y-12">
            <header>
                <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black tracking-tight">DASHBOARD <span className="text-energy italic">OVERVIEW</span></h1>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                    <p className="text-white/40 font-medium tracking-tight">Welcome to Bubbloe Command Center. Business is booming.</p>
                    <span className="text-xs text-white/30 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                        Updated: {lastUpdate?.toLocaleTimeString()}
                    </span>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-energy/20 transition-all hover:scale-[1.02]"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-energy/10 transition-colors">
                                <stat.icon size={24} className="text-energy" />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black italic bg-energy/10 text-energy px-2 py-1 rounded-full uppercase">
                                {stat.trend}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-3xl font-black mt-1 italic">{stat.value}</h3>
                        </div>
                        {/* Subtle Gradient Glow */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-energy/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            RECENT <span className="text-energy italic">ORDERS</span>
                        </h2>
                        <Link href="/admin/orders" className="text-sm font-black text-energy hover:underline uppercase tracking-widest">View All</Link>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Customer</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Status</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Amount</th>
                                    <th className="px-4 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-white/20 font-bold italic">No recent orders yet.</td>
                                    </tr>
                                ) : recentOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-bold text-energy uppercase tracking-tighter">#{order.id.slice(-6)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold tracking-tight">{order.customerName}</span>
                                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{order.customerEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                                order.status === 'DELIVERED' ? "bg-green-500/10 text-green-400" :
                                                    order.status === 'CANCELLED' ? "bg-red-500/10 text-red-400" :
                                                        "bg-energy/10 text-energy"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black">Rs {Number(order.totalAmount).toLocaleString()}</td>
                                        <td className="px-4 py-4 text-right">
                                            <Link href="/admin/orders" className="p-2 inline-block hover:bg-energy hover:text-black rounded-lg transition-all duration-300">
                                                <ArrowUpRight size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Inventory Alert & Real-time Pulse */}
                <div className="space-y-8">
                    {/* Live Pulse Feed */}
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 relative overflow-hidden group border-r-energy/10">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                                LIVE <span className="text-energy italic">PULSE</span>
                                <span className="flex h-2 w-2 rounded-full bg-energy animate-ping opacity-75 ml-1" title="Real-time Active"></span>
                            </h2>
                            <ActivityIcon size={18} className="text-white/20" />
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                            <AnimatePresence mode="popLayout">
                                {activities.length === 0 ? (
                                    <p className="text-xs text-white/20 italic p-4 text-center border border-dashed border-white/5 rounded-xl">Pulse history loading or empty...</p>
                                ) : activities.map((activity, idx) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        layout
                                        className="flex gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                            activity.type === "ORDER_PLACED" ? "bg-green-500/20 text-green-400" :
                                                activity.type === "SETTINGS_UPDATE" ? "bg-blue-500/20 text-blue-400" :
                                                    "bg-energy/20 text-energy"
                                        )}>
                                            {activity.type === "ORDER_PLACED" ? <ShoppingBag size={18} /> :
                                                activity.type === "SETTINGS_UPDATE" ? <History size={18} /> :
                                                    <Zap size={18} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold leading-snug">{activity.message}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">
                                                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="text-[9px] font-black tracking-[0.2em] text-energy/60">
                                                    {activity.type.replace("_", " ")}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-5 group-hover:opacity-10 transition-opacity">
                            <ActivityIcon size={80} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            LOW <span className="text-red-500 italic">INVENTORY</span>
                        </h2>
                        <div className="space-y-4">
                            {lowStockProducts.length === 0 ? (
                                <div className="p-8 text-center bg-green-500/5 border border-dashed border-green-500/20 rounded-2xl">
                                    <CheckCircle2 size={32} className="mx-auto text-green-500/20 mb-2" />
                                    <p className="text-[10px] font-black text-green-500/40 uppercase tracking-widest">All stock levels healthy</p>
                                </div>
                            ) : lowStockProducts.map((p) => (
                                <div key={p.id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl flex items-center gap-4 group hover:border-red-500/20 transition-all hover:translate-x-1">
                                    <div className="w-16 h-16 bg-white/5 rounded-xl p-2 group-hover:bg-white/10 transition-colors">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-sm uppercase tracking-tight">{p.name}</h4>
                                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Only {p.currentStock} items left</p>
                                    </div>
                                    <Link href="/admin/inventory" className="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] font-black rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest">
                                        RESTOCK
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


