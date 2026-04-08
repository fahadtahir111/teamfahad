"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Plus, Edit, Trash2, Copy, Check, X, Calendar, Percent, DollarSign, Loader2, Radio, RefreshCw } from "lucide-react";
import { formatPkr } from "@/lib/currency";
import { couponService } from "@/services/couponService";

interface Coupon {
    id: string;
    code: string;
    type: "percentage" | "fixed" | "free_shipping";
    value: number;
    minPurchase?: number;
    maxDiscount?: number;
    usageLimit?: number;
    usedCount: number;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchCoupons();

        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchCoupons();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const fetchCoupons = async () => {
        try {
            const data = await couponService.getAll();
            if (Array.isArray(data)) {
                setCoupons(data);
                setLastUpdate(new Date());
            } else {
                setCoupons([]);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            setCoupons([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this coupon?")) return;
        try {
            await couponService.delete(id);
            setCoupons(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            alert("Error deleting coupon");
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert("Coupon code copied!");
    };

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
                        <h1 className="text-4xl font-black tracking-tight">COUPONS <span className="text-energy italic">& DISCOUNTS</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Manage discount codes and promotions</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchCoupons();
                        }}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${isLive
                            ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20"
                            : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                            }`}
                    >
                        {isLive ? <Radio size={16} /> : <RefreshCw size={16} />}
                        {isLive ? "Live" : "Manual"}
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setEditingCoupon(null);
                            setIsModalOpen(true);
                        }}
                        className="px-6 py-3 bg-energy text-black font-black rounded-xl flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all"
                    >
                        <Plus size={20} />
                        Create Coupon
                    </motion.button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <Tag className="text-energy mb-4" size={24} />
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Total Coupons</p>
                    <h3 className="text-3xl font-black">{coupons.length}</h3>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <Check className="text-green-400 mb-4" size={24} />
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Active</p>
                    <h3 className="text-3xl font-black">{Array.isArray(coupons) ? coupons.filter(c => c.isActive).length : 0}</h3>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <X className="text-red-400 mb-4" size={24} />
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Expired</p>
                    <h3 className="text-3xl font-black">
                        {Array.isArray(coupons) ? coupons.filter(c => new Date(c.validUntil) < new Date()).length : 0}
                    </h3>
                </div>
                <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl">
                    <Percent className="text-blue-400 mb-4" size={24} />
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Total Used</p>
                    <h3 className="text-3xl font-black">
                        {Array.isArray(coupons) ? coupons.reduce((sum, c) => sum + c.usedCount, 0) : 0}
                    </h3>
                </div>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(coupons) && coupons.map((coupon, idx) => (
                    <motion.div
                        key={coupon.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-[#0a0a0a] border rounded-2xl p-6 relative overflow-hidden ${coupon.isActive && new Date(coupon.validUntil) > new Date()
                            ? "border-energy/50"
                            : "border-white/5"
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-2xl font-black tracking-tighter">{coupon.code}</h3>
                                    {coupon.isActive && new Date(coupon.validUntil) > new Date() && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] font-black rounded-full uppercase">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {coupon.type === "percentage" ? (
                                        <span className="text-3xl font-black text-energy">{coupon.value}%</span>
                                    ) : coupon.type === "free_shipping" ? (
                                        <span className="text-3xl font-black text-energy">FREE</span>
                                    ) : (
                                        <span className="text-3xl font-black text-energy">{formatPkr(coupon.value)}</span>
                                    )}
                                    <span className="text-white/40 text-xs font-bold uppercase">
                                        {coupon.type === "free_shipping" ? "SHIPPING" : "OFF"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyCode(coupon.code)}
                                    className="p-2 hover:bg-energy/10 rounded-lg transition-colors"
                                    title="Copy code"
                                >
                                    <Copy size={16} />
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingCoupon(coupon);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 hover:bg-energy/10 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 text-xs">
                            {coupon.minPurchase && (
                                <div className="flex justify-between text-white/60">
                                    <span>Min. Purchase:</span>
                                    <span className="font-bold">{formatPkr(coupon.minPurchase)}</span>
                                </div>
                            )}
                            {coupon.maxDiscount && (
                                <div className="flex justify-between text-white/60">
                                    <span>Max. Discount:</span>
                                    <span className="font-bold">{formatPkr(coupon.maxDiscount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-white/60">
                                <span>Used:</span>
                                <span className="font-bold">
                                    {coupon.usedCount} / {coupon.usageLimit || "∞"}
                                </span>
                            </div>
                            <div className="flex justify-between text-white/60">
                                <span>Valid Until:</span>
                                <span className="font-bold">{new Date(coupon.validUntil).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {coupons.length === 0 && (
                <div className="text-center py-20">
                    <Tag size={64} className="mx-auto text-white/20 mb-4" />
                    <p className="text-white/40 font-bold">No coupons yet</p>
                    <p className="text-white/20 text-sm mt-2">Create your first discount code</p>
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <CouponModal
                        coupon={editingCoupon}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingCoupon(null);
                        }}
                        onSave={() => {
                            fetchCoupons();
                            setIsModalOpen(false);
                            setEditingCoupon(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function CouponModal({ coupon, onClose, onSave }: { coupon: Coupon | null; onClose: () => void; onSave: () => void }) {
    const [formData, setFormData] = useState({
        code: coupon?.code || "",
        type: coupon?.type || "percentage",
        value: coupon?.value || 0,
        minPurchase: coupon?.minPurchase || 0,
        maxDiscount: coupon?.maxDiscount || 0,
        usageLimit: coupon?.usageLimit || 0,
        validFrom: coupon?.validFrom ? new Date(coupon.validFrom).toISOString().split("T")[0] : "",
        validUntil: coupon?.validUntil ? new Date(coupon.validUntil).toISOString().split("T")[0] : "",
        isActive: coupon?.isActive ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (coupon) {
                await couponService.update(coupon.id, formData);
            } else {
                await couponService.create(formData);
            }
            onSave();
        } catch (error) {
            alert("Error saving coupon");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-black">
                        {coupon ? "EDIT" : "CREATE"} <span className="text-energy italic">COUPON</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                            Coupon Code
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                Discount Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as "percentage" | "fixed" })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                Discount Value
                            </label>
                            <input
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                Min. Purchase
                            </label>
                            <input
                                type="number"
                                value={formData.minPurchase}
                                onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                Usage Limit
                            </label>
                            <input
                                type="number"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                Valid From
                            </label>
                            <input
                                type="date"
                                value={formData.validFrom}
                                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                Valid Until
                            </label>
                            <input
                                type="date"
                                value={formData.validUntil}
                                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-5 h-5 rounded bg-white/5 border-white/10 text-energy focus:ring-energy"
                        />
                        <label htmlFor="isActive" className="text-sm font-bold">
                            Active
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-energy text-black font-black rounded-xl hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all"
                        >
                            {coupon ? "UPDATE" : "CREATE"} COUPON
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/5 text-white font-black rounded-xl hover:bg-white/10 transition-all"
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

