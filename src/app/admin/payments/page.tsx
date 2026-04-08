"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CreditCard, Save, ToggleLeft, ToggleRight, Loader2, CheckCircle, XCircle, Radio, RefreshCw } from "lucide-react";

interface PaymentMethod {
    id: string;
    name: string;
    provider: string;
    isEnabled: boolean;
    settings: Record<string, any>;
}

export default function PaymentsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchPaymentMethods();
        
        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchPaymentMethods();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const fetchPaymentMethods = async () => {
        try {
            const res = await fetch("/api/admin/payments");
            const data = await res.json();
            setPaymentMethods(data);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Error fetching payment methods:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMethod = (id: string) => {
        setPaymentMethods(prev =>
            prev.map(method =>
                method.id === id ? { ...method, isEnabled: !method.isEnabled } : method
            )
        );
    };

    const updateSetting = (methodId: string, key: string, value: any) => {
        setPaymentMethods(prev =>
            prev.map(method =>
                method.id === methodId
                    ? {
                          ...method,
                          settings: { ...method.settings, [key]: value },
                      }
                    : method
            )
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch("/api/admin/payments", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ methods: paymentMethods }),
            });
            alert("Payment settings saved!");
        } catch (error) {
            alert("Error saving payment settings");
        } finally {
            setIsSaving(false);
        }
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
                        <h1 className="text-4xl font-black tracking-tight">PAYMENT <span className="text-energy italic">SETTINGS</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Configure payment gateways and methods</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchPaymentMethods();
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
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-energy text-black font-black rounded-xl flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isSaving ? "Saving..." : "Save Settings"}
                    </motion.button>
                </div>
            </header>

            <div className="space-y-6">
                {paymentMethods.map((method, idx) => (
                    <motion.div
                        key={method.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <CreditCard className="text-energy" size={24} />
                                <div>
                                    <h3 className="text-xl font-black">{method.name}</h3>
                                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{method.provider}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleMethod(method.id)}
                                className="flex items-center gap-2"
                            >
                                {method.isEnabled ? (
                                    <ToggleRight className="text-energy" size={32} />
                                ) : (
                                    <ToggleLeft className="text-white/20" size={32} />
                                )}
                                <span className={`text-xs font-black ${method.isEnabled ? "text-green-400" : "text-white/40"}`}>
                                    {method.isEnabled ? "ENABLED" : "DISABLED"}
                                </span>
                            </button>
                        </div>

                        {method.isEnabled && (
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                {method.provider === "stripe" && (
                                    <>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                                Publishable Key
                                            </label>
                                            <input
                                                type="text"
                                                value={method.settings.publishableKey || ""}
                                                onChange={(e) => updateSetting(method.id, "publishableKey", e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                                                placeholder="pk_test_..."
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                                Secret Key
                                            </label>
                                            <input
                                                type="password"
                                                value={method.settings.secretKey || ""}
                                                onChange={(e) => updateSetting(method.id, "secretKey", e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                                                placeholder="sk_test_..."
                                            />
                                        </div>
                                    </>
                                )}

                                {method.provider === "cod" && (
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="text-green-400" size={18} />
                                            <span className="font-bold text-green-400">Cash on Delivery</span>
                                        </div>
                                        <p className="text-xs text-white/60">
                                            No additional configuration needed. Customers can pay when they receive their order.
                                        </p>
                                    </div>
                                )}

                                {method.provider === "bank" && (
                                    <>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                                Bank Name
                                            </label>
                                            <input
                                                type="text"
                                                value={method.settings.bankName || ""}
                                                onChange={(e) => updateSetting(method.id, "bankName", e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                value={method.settings.accountNumber || ""}
                                                onChange={(e) => updateSetting(method.id, "accountNumber", e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

