"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Loader2,
    Package,
    Radio,
    RefreshCw
} from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";

interface Product {
    id: string;
    name: string;
    price: string;
    image: string;
    category?: { id: string; name: string };
    categoryId: string;
    inventory: number;
    description: string;
    color: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [prodData, catData] = await Promise.all([
                productService.getAll(),
                categoryService.getAll()
            ]);

            if (Array.isArray(prodData)) {
                setProducts(prodData);
            } else {
                setProducts([]);
            }

            if (Array.isArray(catData)) {
                setCategories(catData);
            } else {
                setCategories([]);
            }

            setLastUpdate(new Date());
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setProducts([]);
            setCategories([]);
        } finally {
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error("Failed to delete product:", error);
        }
    };

    const openEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const openAdd = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight">STORE <span className="text-energy italic">PRODUCTS</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Manage your energy drink collection and inventory heights.</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate?.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
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
                    <button
                        onClick={openAdd}
                        className="bg-energy text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                    >
                        <Plus size={20} />
                        ADD PRODUCT
                    </button>
                </div>
            </header>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-white/20 focus:outline-none focus:border-energy/50 transition-colors"
                    />
                </div>
                <button className="bg-white/5 border border-white/5 px-6 rounded-2xl flex items-center gap-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    <Filter size={18} />
                    Filters
                </button>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <Loader2 className="text-energy animate-spin" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {products.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden group hover:border-energy/20 transition-all duration-500"
                            >
                                <div className="aspect-square relative flex items-center justify-center p-8 bg-gradient-to-br from-white/[0.02] to-transparent">
                                    <div className="absolute inset-0 bg-energy/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500" />
                                    <motion.div
                                        whileHover={{ y: -10, rotate: 5 }}
                                        className="relative z-10 w-full h-full flex items-center justify-center"
                                    >
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
                                        ) : (
                                            <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center">
                                                <Package size={48} className="text-white/20" />
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-black text-xl tracking-tight leading-none">{product.name}</h3>
                                            <p className="text-xs text-white/40 mt-1 uppercase font-bold tracking-widest">{product.category?.name || "Uncategorized"}</p>
                                        </div>
                                        <div className="text-energy font-black text-xl">
                                            Rs {Number(product.price).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${product.inventory > 10 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                            <span className="text-xs font-bold text-white/40">{product.inventory} in stock</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(product)}
                                                className="p-2 hover:bg-white/10 rounded-xl text-white/60 hover:text-white transition-all"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-500 transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <ProductForm
                        product={editingProduct}
                        categories={categories}
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={fetchData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
