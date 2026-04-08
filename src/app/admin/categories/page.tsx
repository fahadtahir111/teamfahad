"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Loader2, FolderOpen, Radio, RefreshCw } from "lucide-react";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchCategories = () => {
        setIsLoading(true);
        fetch("/api/categories")
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLastUpdate(new Date());
                setIsLoading(false);
            });
    };

    useEffect(() => {
        setLastUpdate(new Date());
        fetchCategories();

        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchCategories();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
            if (res.ok) {
                setNewName("");
                setIsAddOpen(false);
                fetchCategories();
            }
        } catch (error) {
            console.error("Failed to add category:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will not delete products in this category.")) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            if (res.ok) fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight">STORE <span className="text-energy italic">CATEGORIES</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Organize your energy drink collection into series.</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate?.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchCategories();
                        }}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isLive
                            ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                            }`}
                    >
                        {isLive ? <Radio size={16} /> : <RefreshCw size={16} />}
                        {isLive ? "Live" : "Manual"}
                    </button>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-energy text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <Plus size={20} />
                        ADD CATEGORY
                    </button>
                </div>
            </header>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="text-energy animate-spin" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[32px] group hover:border-energy/20 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-white/5 rounded-2xl">
                                    <FolderOpen className="text-white/40 group-hover:text-energy transition-colors" />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">{cat.name}</h3>
                            <p className="text-white/40 font-bold mt-1 uppercase tracking-widest text-xs">
                                {cat._count?.product || 0} PRODUCTS
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isAddOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0a0a0a] border border-white/10 p-8 rounded-[32px] w-full max-w-md">
                            <h2 className="text-2xl font-black italic mb-6">NEW <span className="text-energy">CATEGORY</span></h2>
                            <form onSubmit={handleAdd} className="space-y-6">
                                <input
                                    autoFocus
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="e.g. LIMITED EDITION"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-energy"
                                />
                                <button type="submit" className="w-full bg-energy text-black font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                                    CREATE CATEGORY
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
