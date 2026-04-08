"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { productService } from "@/services/productService";

interface ProductFormProps {
    product?: any;
    categories: any[];
    onClose: () => void;
    onSuccess: () => void;
}

export const ProductForm = ({ product, categories, onClose, onSuccess }: ProductFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 0,
        image: product?.image || "",
        color: product?.color || "",
        categoryId: product?.categoryId || (categories[0]?.id || ""),
        inventory: product?.inventory || 0,
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadData,
            });
            const data = await res.json();
            if (data.url) {
                setFormData({ ...formData, image: data.url });
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Image upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (product) {
                await productService.update(product.id, formData);
            } else {
                await productService.create(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-2xl font-black italic tracking-tight">
                        {product ? "EDIT" : "ADD NEW"} <span className="text-energy">PRODUCT</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Product Name</label>
                            <input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-energy transition-colors"
                                placeholder="e.g. BERRY BLAST"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Price (PKR)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-energy transition-colors"
                                placeholder="450"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Description</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-energy transition-colors resize-none"
                            placeholder="Describe the energy boost and flavor notes..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-energy transition-colors appearance-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="bg-[#0a0a0a]">
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40">Inventory Count</label>
                            <input
                                type="number"
                                value={formData.inventory}
                                onChange={(e) => setFormData({ ...formData, inventory: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-energy transition-colors"
                                placeholder="100"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 col-span-1 md:col-span-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Product Image</label>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative flex items-center justify-center">
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <ImageIcon className="text-white/10" size={40} />
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="text-energy animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="relative group cursor-pointer">
                                    <input
                                        type="file"
                                        name="image"
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl py-6 flex flex-col items-center justify-center gap-2 group-hover:border-energy/50 group-hover:bg-energy/5 transition-all">
                                        <Upload className="text-white/20 group-hover:text-energy transition-colors" size={24} />
                                        <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">
                                            CLICK TO UPLOAD IMAGE
                                        </span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <p className="text-[10px] text-white/20 uppercase font-bold mb-2">Or paste Image URL</p>
                                    <input
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-energy transition-colors"
                                        placeholder="/images/flavor.png"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/40">Theme Color (CSS/Hex)</label>
                        <input
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-energy transition-colors"
                            placeholder="#FFD700 or bg-yellow-400"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-energy text-black font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : product ? "UPDATE PRODUCT" : "CREATE PRODUCT"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};
