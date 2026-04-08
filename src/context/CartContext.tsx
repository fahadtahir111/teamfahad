"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

export interface CartItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    color: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string | number) => void;
    updateQuantity: (id: string | number, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const initialLoadDone = useRef(false);

    // 1. Initial Load (from LocalStorage first, then API if logged in)
    useEffect(() => {
        if (status === "loading") return;

        const loadCart = async () => {
            setIsSyncing(true);
            try {
                if (session?.user) {
                    // SaaS Feature: Load persistent cart from DB
                    const res = await fetch("/api/cart");
                    if (res.ok) {
                        const data = await res.json();
                        setCart(data.cart || []);
                    }
                } else {
                    // Guest User
                    const savedCart = localStorage.getItem("bubbloe-cart");
                    if (savedCart) setCart(JSON.parse(savedCart));
                }
            } catch (e) {
                console.error("Failed to load cart", e);
            } finally {
                initialLoadDone.current = true;
                setIsSyncing(false);
            }
        };

        loadCart();
    }, [session?.user, status]);

    // 2. Sync Logic (Save to LocalStorage AND Database)
    useEffect(() => {
        if (!initialLoadDone.current) return;

        localStorage.setItem("bubbloe-cart", JSON.stringify(cart));

        if (session?.user) {
            const syncDb = async () => {
                await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cartItems: cart })
                }).catch(console.error);
            };
            // Debounce for performance could go here, but pure save is fine for now
            syncDb();
        }
    }, [cart, session?.user]);

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string | number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id: string | number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalItems,
                getTotalPrice,
                isSyncing
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
