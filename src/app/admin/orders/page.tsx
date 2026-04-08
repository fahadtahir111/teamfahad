"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Eye,
    CheckCircle2,
    Truck,
    XCircle,
    Clock,
    ChevronRight,
    Loader2,
    Radio,
    RefreshCw
} from "lucide-react";
import { formatPkr } from "@/lib/currency";
import { orderService } from "@/services/orderService";

interface OrderItem {
    id: string;
    product: { name: string; image: string };
    quantity: number;
    price: string;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    totalAmount: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isLive, setIsLive] = useState(true);
    const [activeTab, setActiveTab] = useState("All");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = async () => {
        try {
            const data = await orderService.getAll();
            if (Array.isArray(data)) {
                setOrders(data);
                setFilteredOrders(data);
                setLastUpdate(new Date());
            } else {
                setOrders([]);
                setFilteredOrders([]);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchData();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await orderService.updateStatus(id, newStatus);
            fetchData();
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "text-green-400 bg-green-500/10";
            case "SHIPPED": return "text-blue-400 bg-blue-500/10";
            case "PROCESSING": return "text-yellow-400 bg-yellow-500/10";
            case "PENDING": return "text-purple-400 bg-purple-500/10";
            default: return "text-white/40 bg-white/5";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DELIVERED": return CheckCircle2;
            case "SHIPPED": return Truck;
            case "PROCESSING": return Clock;
            case "PENDING": return Clock;
            case "CANCELLED": return XCircle;
            default: return Clock;
        }
    };

    return (
        <div className="space-y-12">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight">CUSTOMER <span className="text-energy italic">ORDERS</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Track and manage energy drink fulfillment and delivery status.</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate?.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setIsLive(!isLive);
                        fetchData();
                    }}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isLive
                        ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                        : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                >
                    {isLive ? <Radio size={16} /> : <RefreshCw size={16} />}
                    {isLive ? "Live" : "Manual"}
                </button>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer name..."
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-energy/50 transition-colors"
                        onChange={(e) => {
                            const q = e.target.value.toLowerCase();
                            setFilteredOrders(orders.filter(o =>
                                o.id.toLowerCase().includes(q) ||
                                o.customerName.toLowerCase().includes(q) ||
                                o.customerEmail.toLowerCase().includes(q)
                            ));
                        }}
                    />
                </div>
                <div className="flex gap-2">
                    {["All", "Pending", "Processing", "Shipped", "Delivered"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                if (tab === "All") setFilteredOrders(orders);
                                else setFilteredOrders(orders.filter(o => o.status === tab.toUpperCase()));
                            }}
                            className="bg-white/5 border border-white/5 px-6 rounded-2xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="text-energy animate-spin" size={48} />
                </div>
            ) : (
                <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Order Details</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Customer</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Address</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Total</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Payment</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Status</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-white/40">Date</th>
                                <th className="px-4 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-8 py-20 text-center text-white/20 font-bold italic">No orders found matching the criteria.</td>
                                </tr>
                            ) : filteredOrders.map((order) => {
                                const StatusIcon = getStatusIcon(order.status);
                                return (
                                    <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center p-2">
                                                    {order.items[0]?.product.image && (
                                                        <img src={order.items[0].product.image} alt="" className="w-full h-full object-contain" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-energy uppercase tracking-tighter">#{order.id.slice(-6)}</p>
                                                    <p className="text-[10px] text-white/40 font-bold uppercase">{order.items.length} items</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{order.customerName}</span>
                                                <span className="text-xs text-white/40">{order.customerEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-medium text-white/80 max-w-[200px] block truncate" title={order.shippingAddress || "N/A"}>
                                                {order.shippingAddress || "N/A"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-black text-xl">
                                            Rs {Number(order.totalAmount).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{order.paymentMethod}</span>
                                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block w-fit ${order.paymentStatus === "PAID" ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"
                                                    }`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer ${getStatusColor(order.status)} appearance-none`}
                                            >
                                                <option value="PENDING" className="bg-[#0a0a0a]">PENDING</option>
                                                <option value="PROCESSING" className="bg-[#0a0a0a]">PROCESSING</option>
                                                <option value="SHIPPED" className="bg-[#0a0a0a]">SHIPPED</option>
                                                <option value="DELIVERED" className="bg-[#0a0a0a]">DELIVERED</option>
                                                <option value="CANCELLED" className="bg-[#0a0a0a]">CANCELLED</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm text-white/60">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-4 py-6 text-right">
                                            <button className="p-3 hover:bg-energy hover:text-black rounded-2xl transition-all duration-300 group-hover:scale-110">
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
