"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { Magnetic } from "@/components/Magnetic";
import { ArrowLeft, Check, CreditCard, Truck, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPkr } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { orderService } from "@/services/orderService";
import { couponService } from "@/services/couponService";
import { Tag } from "lucide-react";

export default function CheckoutPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const { cart, getTotalPrice, clearCart, removeFromCart } = useCart();
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: "",
        country: "United States",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
        paymentMethod: "COD", // Default to COD
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [couponError, setCouponError] = useState("");

    useEffect(() => {
        if (session?.user?.email) {
            setFormData(prev => ({ ...prev, email: session.user?.email || "" }));
        }
    }, [session]);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const total = getTotalPrice();
    const discount = appliedCoupon?.discountAmount || 0;
    const finalTotal = Math.max(0, total - discount);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsApplyingCoupon(true);
        setCouponError("");
        try {
            const result = await couponService.validate(couponCode, total);
            setAppliedCoupon(result);
            setCouponError("");
        } catch (error: any) {
            setAppliedCoupon(null);
            setCouponError(error.response?.data?.error || "Invalid coupon code");
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const orderData = {
                customerName: `${formData.firstName} ${formData.lastName}`,
                customerEmail: formData.email,
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}, ${formData.country}`,
                paymentMethod: formData.paymentMethod,
                couponCode: appliedCoupon?.code,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            const result = await orderService.create(orderData);

            if (result) {
                setIsProcessing(false);
                setIsComplete(true);
                clearCart();
                setTimeout(() => {
                    router.push("/");
                }, 3000);
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            setIsProcessing(false);

            // Auto-fix for stale cart items
            const errorMessage = error.response?.data?.error || error.message || "Failed to place order.";

            if (errorMessage.includes("not found")) {
                const match = errorMessage.match(/Product (.*) not found/);
                if (match && match[1]) {
                    const invalidId = match[1];
                    // Find the item name for better UX
                    const invalidItemName = cart.find(item => String(item.id) === invalidId)?.name || "Unknown Item";

                    // Remove the invalid item
                    removeFromCart(invalidId);

                    alert(`The item "${invalidItemName}" is no longer available and has been removed from your cart. Please try placing your order again.`);
                    return;
                }
            }

            alert(errorMessage);
        }
    };

    if (cart.length === 0 && !isComplete) {
        return (
            <div className="min-h-screen bg-background pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
                        >
                            <div className="flex flex-col items-center gap-6">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-energy/30 border-t-energy rounded-full"
                                />
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-white/60 font-bold text-lg"
                                >
                                    Loading Checkout...
                                </motion.p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isLoading ? 0 : 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl w-full text-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-dark p-8 md:p-12 rounded-[40px] md:rounded-[60px]"
                        >
                            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4 text-white uppercase">
                                No Items in Cart
                            </h1>
                            <p className="text-white/50 mb-8 text-sm md:text-base">
                                Add some energy drinks to your cart first!
                            </p>
                            <Magnetic>
                                <Link
                                    href="/shop"
                                    className="inline-block px-8 py-4 md:px-12 md:py-5 bg-energy text-white rounded-full font-black text-base md:text-lg flex items-center justify-center gap-2 mx-auto hover:scale-105 transition-transform"
                                >
                                    <Zap className="w-5 h-5" />
                                    SHOP NOW
                                </Link>
                            </Magnetic>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="min-h-screen bg-background pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full text-center"
                >
                    <div className="glass-dark p-8 md:p-12 rounded-[40px] md:rounded-[60px]">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-20 h-20 md:w-24 md:h-24 bg-energy rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <Check className="w-12 h-12 md:w-16 md:h-16 text-white" />
                        </motion.div>
                        <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4 text-white uppercase">
                            Order <span className="text-energy">Complete!</span>
                        </h1>
                        <p className="text-white/50 mb-8 text-sm md:text-base">
                            Thank you for your purchase! Your energy drinks are on the way.
                        </p>
                        <p className="text-white/30 text-xs md:text-sm">
                            Redirecting to home...
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 border-4 border-energy/30 border-t-energy rounded-full"
                            />
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white/60 font-bold text-lg"
                            >
                                Loading Checkout...
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-white/50 hover:text-energy mb-6 md:mb-8 transition-colors text-sm md:text-base"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Cart
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Checkout Form */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-dark p-6 md:p-8 rounded-[32px] md:rounded-[40px] mb-6"
                            >
                                <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-6 text-white uppercase">
                                    Shipping Information
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            required
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                            placeholder="123 Energy Street"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                required
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                            Country
                                        </label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white"
                                        >
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Australia">Australia</option>
                                        </select>
                                    </div>

                                    <div className="pt-6 border-t border-white/10">
                                        <h3 className="text-xl md:text-2xl font-black italic tracking-tighter mb-6 text-white uppercase flex items-center gap-2">
                                            <Shield className="w-5 h-5 md:w-6 md:h-6 text-energy" />
                                            Payment Method
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, paymentMethod: "COD" })}
                                                className={`p-6 rounded-2xl border-2 transition-all flex flex-col gap-3 text-left ${formData.paymentMethod === "COD"
                                                    ? "bg-energy/10 border-energy shadow-[0_0_20px_rgba(152,255,152,0.1)]"
                                                    : "bg-white/5 border-white/10 hover:border-white/20"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <Truck className={`w-6 h-6 ${formData.paymentMethod === "COD" ? "text-energy" : "text-white/40"}`} />
                                                    {formData.paymentMethod === "COD" && <Check className="w-5 h-5 text-energy" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">Cash on Delivery</p>
                                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Pay when you receive</p>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, paymentMethod: "CARD" })}
                                                className={`p-6 rounded-2xl border-2 transition-all flex flex-col gap-3 text-left ${formData.paymentMethod === "CARD"
                                                    ? "bg-energy/10 border-energy shadow-[0_0_20px_rgba(152,255,152,0.1)]"
                                                    : "bg-white/5 border-white/10 hover:border-white/20"
                                                    }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <CreditCard className={`w-6 h-6 ${formData.paymentMethod === "CARD" ? "text-energy" : "text-white/40"}`} />
                                                    {formData.paymentMethod === "CARD" && <Check className="w-5 h-5 text-energy" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">Credit / Debit Card</p>
                                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Secure online payment</p>
                                                </div>
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {formData.paymentMethod === "CARD" && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-4 overflow-hidden"
                                                >
                                                    <div>
                                                        <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                                            Card Number
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="cardNumber"
                                                            required={formData.paymentMethod === "CARD"}
                                                            value={formData.cardNumber}
                                                            onChange={handleChange}
                                                            maxLength={19}
                                                            placeholder="1234 5678 9012 3456"
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                                                        <div>
                                                            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                                                Expiry Date
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="expiryDate"
                                                                required={formData.paymentMethod === "CARD"}
                                                                value={formData.expiryDate}
                                                                onChange={handleChange}
                                                                placeholder="MM/YY"
                                                                maxLength={5}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                                                CVV
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="cvv"
                                                                required={formData.paymentMethod === "CARD"}
                                                                value={formData.cvv}
                                                                onChange={handleChange}
                                                                maxLength={4}
                                                                placeholder="123"
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-2">
                                                            Cardholder Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="cardName"
                                                            required={formData.paymentMethod === "CARD"}
                                                            value={formData.cardName}
                                                            onChange={handleChange}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-energy transition-colors text-white placeholder-white/30"
                                                            placeholder="John Doe"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {formData.paymentMethod === "COD" && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="p-4 bg-energy/5 border border-energy/20 rounded-xl"
                                            >
                                                <p className="text-xs text-energy font-medium flex items-center gap-2">
                                                    <Truck className="w-4 h-4" />
                                                    You will pay Rs {finalTotal.toLocaleString()} Cash when your order is delivered.
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    <Magnetic>
                                        <motion.button
                                            type="submit"
                                            disabled={isProcessing}
                                            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                                            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                                            className="w-full py-4 md:py-5 bg-energy text-white rounded-full font-black text-base md:text-lg flex items-center justify-center gap-2 shadow-xl shadow-energy/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-5 h-5" />
                                                    Complete Order
                                                </>
                                            )}
                                        </motion.button>
                                    </Magnetic>
                                </form>
                            </motion.div>

                            <div className="glass-dark p-4 md:p-6 rounded-[24px] md:rounded-[32px] flex items-center gap-4 text-sm md:text-base">
                                <Truck className="w-5 h-5 md:w-6 md:h-6 text-energy flex-shrink-0" />
                                <div>
                                    <p className="text-white font-bold">Free Shipping</p>
                                    <p className="text-white/50 text-xs md:text-sm">On all orders over $20</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-dark p-6 md:p-8 rounded-[32px] md:rounded-[40px] sticky top-24"
                            >
                                <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-6 text-white uppercase">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm md:text-base">
                                            <span className="text-white/70">
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="text-white font-bold">
                                                {formatPkr(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px bg-white/10 my-4" />

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-white/70 text-sm md:text-base">
                                        <span>Subtotal</span>
                                        <span>{formatPkr(total)}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-energy text-sm md:text-base">
                                            <span>Discount ({appliedCoupon.code})</span>
                                            <span>-{formatPkr(discount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-white/70 text-sm md:text-base">
                                        <span>Shipping</span>
                                        <span className="text-energy">FREE</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-2" />
                                    <div className="flex justify-between text-white text-lg md:text-xl font-black">
                                        <span>Total</span>
                                        <span className="text-energy">{formatPkr(finalTotal)}</span>
                                    </div>
                                </div>

                                {/* Coupon Input */}
                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <label className="block text-xs font-black uppercase tracking-widest text-white/50 mb-3">
                                        Have a Coupon?
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="ENTER CODE"
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-energy transition-colors text-white placeholder-white/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon || !couponCode}
                                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black transition-colors disabled:opacity-50"
                                        >
                                            {isApplyingCoupon ? "..." : "APPLY"}
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-tight">
                                            {couponError}
                                        </p>
                                    )}
                                    {appliedCoupon && (
                                        <p className="text-energy text-[10px] mt-2 font-bold uppercase tracking-tight flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            Coupon Applied!
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}



