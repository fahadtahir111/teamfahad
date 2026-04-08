"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle, Plus, Edit, Search, Loader2, TrendingDown, TrendingUp, Radio, RefreshCw, Check, X } from "lucide-react";
import Image from "next/image";

interface InventoryItem {
    id: string;
    name: string;
    image: string;
    currentStock: number;
    lowStockThreshold: number;
    price: number;
    category: string;
}

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isLive, setIsLive] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStock, setEditStock] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchInventory = async () => {
        try {
            const res = await fetch("/api/admin/inventory");

            // Check if response is ok
            if (!res.ok) {
                console.error("API error:", res.status, res.statusText);
                setInventory([]);
                setIsLoading(false);
                return;
            }

            const data = await res.json();

            // Ensure data is always an array
            if (Array.isArray(data)) {
                setInventory(data);
                setLastUpdate(new Date());
            } else if (data && typeof data === 'object') {
                // If we get an object, try to extract an array or default to empty
                console.warn("Received object instead of array:", data);
                setInventory([]);
            } else {
                console.error("Invalid data format:", data);
                setInventory([]);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
            setInventory([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();

        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchInventory();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const handleEdit = (item: InventoryItem) => {
        setEditingId(item.id);
        setEditStock(item.currentStock);
    };

    const handleSave = async (id: string) => {
        try {
            const res = await fetch("/api/admin/inventory", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, currentStock: editStock }),
            });

            if (res.ok) {
                setEditingId(null);
                fetchInventory();
            }
        } catch (error) {
            console.error("Failed to update inventory:", error);
        }
    };

    const filteredInventory = Array.isArray(inventory)
        ? inventory.filter(item =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const lowStockItems = Array.isArray(filteredInventory)
        ? filteredInventory.filter(item => item.currentStock <= item.lowStockThreshold)
        : [];
    const outOfStockItems = Array.isArray(filteredInventory)
        ? filteredInventory.filter(item => item.currentStock === 0)
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
                        <h1 className="text-4xl font-black tracking-tight">INVENTORY <span className="text-energy italic">MANAGEMENT</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Track and manage product stock levels</p>
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
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-white placeholder-white/40"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchInventory();
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

            {/* Alerts */}
            {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
                <div className="space-y-4">
                    {outOfStockItems.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="text-red-500" size={24} />
                                <h3 className="text-xl font-black text-red-500">OUT OF STOCK</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {outOfStockItems.map(item => (
                                    <div key={item.id} className="bg-black/20 p-4 rounded-xl">
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-xs text-red-400 mt-1">0 units available</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {lowStockItems.length > 0 && (
                        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <TrendingDown className="text-yellow-500" size={24} />
                                <h3 className="text-xl font-black text-yellow-500">LOW STOCK</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {lowStockItems.map(item => (
                                    <div key={item.id} className="bg-black/20 p-4 rounded-xl">
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-xs text-yellow-400 mt-1">
                                            {item.currentStock} units left (threshold: {item.lowStockThreshold})
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Inventory Table */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Product</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Current Stock</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Low Stock Alert</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-white/40">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredInventory.map((item, idx) => {
                            const isLowStock = item.currentStock <= item.lowStockThreshold;
                            const isOutOfStock = item.currentStock === 0;

                            return (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-white/5 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <span className="font-bold">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white/60 text-sm">{item.category}</td>
                                    <td className="px-6 py-4">
                                        {editingId === item.id ? (
                                            <input
                                                type="number"
                                                value={editStock}
                                                onChange={(e) => setEditStock(parseInt(e.target.value))}
                                                className="w-20 bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-center font-bold focus:outline-none focus:border-energy"
                                            />
                                        ) : (
                                            <span className="font-black text-xl">{item.currentStock}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-white/60 text-sm">{item.lowStockThreshold}</td>
                                    <td className="px-6 py-4">
                                        {isOutOfStock ? (
                                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-black uppercase">
                                                Out of Stock
                                            </span>
                                        ) : isLowStock ? (
                                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-black uppercase">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-black uppercase">
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === item.id ? (
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleSave(item.id)} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors">
                                                    <Check size={16} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleEdit(item)} className="p-2 hover:bg-energy/10 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

