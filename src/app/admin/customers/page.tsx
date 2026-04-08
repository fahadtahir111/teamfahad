"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Search, Mail, Phone, Calendar, ShoppingBag, Loader2, Eye, Radio, RefreshCw } from "lucide-react";
import { formatPkr } from "@/lib/currency";

interface Customer {
    id: string;
    email: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/admin/customers");
            
            // Check if response is ok
            if (!res.ok) {
                console.error("API error:", res.status, res.statusText);
                setCustomers([]);
                setIsLoading(false);
                return;
            }
            
            const data = await res.json();
            
            // Ensure data is always an array
            if (Array.isArray(data)) {
                setCustomers(data);
                setLastUpdate(new Date());
            } else if (data && typeof data === 'object') {
                // If we get an object, try to extract an array or default to empty
                console.warn("Received object instead of array:", data);
                setCustomers([]);
            } else {
                console.error("Invalid data format:", data);
                setCustomers([]);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            setCustomers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
        
        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchCustomers();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const filteredCustomers = Array.isArray(customers) 
        ? customers.filter(c =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-energy" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight">CUSTOMERS <span className="text-energy italic">MANAGEMENT</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">View and manage all your customers</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                        <Search size={18} className="text-white/40" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-white placeholder-white/40"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchCustomers();
                        }}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                            isLive 
                                ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20" 
                                : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                    >
                        {isLive ? <Radio size={16} /> : <RefreshCw size={16} />}
                        {isLive ? "Live" : "Manual"}
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="text-energy" size={24} />
                        <span className="text-xs font-black text-energy bg-energy/10 px-2 py-1 rounded-full">TOTAL</span>
                    </div>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Total Customers</p>
                    <h3 className="text-3xl font-black">{Array.isArray(customers) ? customers.length : 0}</h3>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <ShoppingBag className="text-blue-400" size={24} />
                        <span className="text-xs font-black text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full">ACTIVE</span>
                    </div>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Active Buyers</p>
                    <h3 className="text-3xl font-black">{Array.isArray(customers) ? customers.filter(c => c.totalOrders > 0).length : 0}</h3>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <Mail className="text-green-400" size={24} />
                        <span className="text-xs font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-full">NEW</span>
                    </div>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">This Month</p>
                    <h3 className="text-3xl font-black">
                        {Array.isArray(customers) 
                            ? customers.filter(c => {
                                if (!c.lastOrderDate) return false;
                                const date = new Date(c.lastOrderDate);
                                const now = new Date();
                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                            }).length
                            : 0}
                    </h3>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <ShoppingBag className="text-purple-400" size={24} />
                        <span className="text-xs font-black text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">AVG</span>
                    </div>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Avg. Order Value</p>
                    <h3 className="text-3xl font-black">
                        {formatPkr(
                            Array.isArray(customers) && customers.length > 0
                                ? customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length
                                : 0
                        )}
                    </h3>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Orders</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Total Spent</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Last Order</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredCustomers.map((customer, idx) => (
                            <motion.tr
                                key={customer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-white/5 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold">{customer.name || "Guest"}</span>
                                        <span className="text-xs text-white/40 font-bold uppercase tracking-widest">{customer.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 bg-energy/10 text-energy rounded-full text-xs font-black">
                                        {customer.totalOrders}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-black">{formatPkr(customer.totalSpent)}</td>
                                <td className="px-6 py-4 text-white/60 text-sm">
                                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : "Never"}
                                </td>
                                <td className="px-6 py-4">
                                    <button className="p-2 hover:bg-energy/10 rounded-lg transition-colors">
                                        <Eye size={16} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredCustomers.length === 0 && (
                <div className="text-center py-20">
                    <Users size={64} className="mx-auto text-white/20 mb-4" />
                    <p className="text-white/40 font-bold">No customers found</p>
                </div>
            )}
        </div>
    );
}

