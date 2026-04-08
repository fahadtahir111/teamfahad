"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package, Loader2, Radio, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatPkr } from "@/lib/currency";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`/api/admin/analytics?range=${timeRange}`);
            const data = await res.json();
            setAnalytics(data);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Initial set on client side to avoid hydration mismatch if not null
        setLastUpdate(new Date());
        fetchAnalytics();

        // Set up real-time polling every 10 seconds (analytics can be less frequent)
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchAnalytics();
            }, 10000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timeRange, isLive]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-energy" size={48} />
            </div>
        );
    }

    const stats = analytics?.stats || {
        revenue: 0,
        orders: 0,
        customers: 0,
        products: 0,
        revenueChange: 0,
        ordersChange: 0,
        customersChange: 0,
    };

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight">ANALYTICS <span className="text-energy italic">& INSIGHTS</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Track your business performance</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate?.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                        {(["7d", "30d", "90d", "1y"] as const).map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${timeRange === range
                                        ? "bg-energy text-black"
                                        : "text-white/40 hover:text-white"
                                    }`}
                            >
                                {range.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchAnalytics();
                        }}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isLive
                                ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                                : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                            }`}
                    >
                        {isLive ? <Radio size={16} /> : <RefreshCw size={16} />}
                        {isLive ? "Live" : "Manual"}
                    </button>
                </div>
            </header>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    label="Total Revenue"
                    value={formatPkr(stats.revenue)}
                    change={stats.revenueChange}
                    icon={DollarSign}
                    color="text-green-400"
                />
                <MetricCard
                    label="Total Orders"
                    value={stats.orders.toString()}
                    change={stats.ordersChange}
                    icon={ShoppingBag}
                    color="text-blue-400"
                />
                <MetricCard
                    label="New Customers"
                    value={stats.customers.toString()}
                    change={stats.customersChange}
                    icon={Users}
                    color="text-purple-400"
                />
                <MetricCard
                    label="Products Sold"
                    value={stats.products.toString()}
                    change={0}
                    icon={Package}
                    color="text-energy"
                />
            </div>

            {/* Real-time Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend Chart */}
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-xl font-black mb-6">Revenue Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.revenueTrend || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#D4FF00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#666"
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#666"
                                    tick={{ fill: '#666', fontSize: 10 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `Rs${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    formatter={(value: any) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#D4FF00"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Distribution Chart */}
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-xl font-black mb-6">Order Status Distribution</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics?.orderStatusDistribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(analytics?.orderStatusDistribution || []).map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value, entry: any) => <span className="text-white/60 text-xs ml-2 font-bold uppercase">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-black mb-6">Top Selling Products</h3>
                <div className="space-y-4">
                    {analytics?.topProducts?.map((product: any, idx: number) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-black text-energy w-8">#{idx + 1}</span>
                                <div>
                                    <p className="font-bold">{product.name}</p>
                                    <p className="text-xs text-white/40">{product.quantity} sold</p>
                                </div>
                            </div>
                            <span className="font-black">{formatPkr(product.revenue)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, change, icon: Icon, color }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl"
        >
            <div className="flex items-center justify-between mb-4">
                <Icon className={color} size={24} />
                {change !== 0 && (
                    <div className={`flex items-center gap-1 text-xs font-black ${change > 0 ? "text-green-400" : "text-red-400"}`}>
                        {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-black">{value}</h3>
        </motion.div>
    );
}
