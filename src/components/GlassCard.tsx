"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

// ... imports
interface Product {
    id: string | number;
    name: string;
    price: string | number;
    priceNum?: number;
    image: string;
    color: string;
    inventory: number;
}

export const GlassCard = ({ product }: { product: Product }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useCart();
    const router = useRouter();

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleCardClick = () => {
        router.push(`/shop/${product.id}`);
    };

    const displayPrice = typeof product.price === "number"
        ? `Rs ${product.price.toLocaleString()}`
        : product.price;

    const isOutOfStock = product.inventory === 0;
    const isLowStock = product.inventory > 0 && product.inventory < 10;

    return (
        <motion.div
            ref={ref}
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative h-[450px] w-full rounded-3xl glass p-6 cursor-pointer group"
        >
            <div
                style={{ transform: "translateZ(75px)" }}
                className="flex flex-col h-full items-center justify-between"
            >
                <div className="w-full flex justify-between items-start">
                    <span className="text-xs font-black uppercase tracking-widest text-foreground/50">
                        Premium Energy
                    </span>
                    <div className="flex flex-col items-end gap-2">
                        <div className={cn("w-3 h-3 rounded-full",
                            product.color?.startsWith('bg-') ? product.color : `bg-[${product.color}]`
                        )} />
                        {isOutOfStock ? (
                            <span className="text-[10px] bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                                OUT OF STOCK
                            </span>
                        ) : isLowStock ? (
                            <span className="text-[10px] bg-yellow-500 text-black px-2 py-1 rounded-full font-bold">
                                LOW STOCK: {product.inventory}
                            </span>
                        ) : (
                            <span className="text-[10px] bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                                IN STOCK: {product.inventory}
                            </span>
                        )}
                    </div>
                </div>

                {/* Product Image */}
                <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-500">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className={cn("object-contain", isOutOfStock && "grayscale opacity-50")}
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Flavor Explosion Dots */}
                    {isHovered && !isOutOfStock && [1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: [0, 1.5, 0],
                                x: (Math.random() - 0.5) * 200,
                                y: (Math.random() - 0.5) * 200,
                            }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                            className={cn("absolute w-4 h-4 rounded-full blur-sm",
                                product.color?.startsWith('bg-') ? product.color : `bg-[${product.color}]`
                            )}
                        />
                    ))}
                </div>

                <div className="text-center">
                    <h3 className="text-2xl font-black italic mb-2 tracking-tight">
                        {product.name}
                    </h3>
                    <p className="text-energy font-bold text-xl">{displayPrice}</p>
                </div>

                <motion.button
                    whileHover={!isOutOfStock ? { scale: 1.1 } : {}}
                    whileTap={!isOutOfStock ? { scale: 0.9 } : {}}
                    disabled={isOutOfStock}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isOutOfStock) return;
                        const priceNum = typeof product.price === 'number' ? product.price : parseFloat(String(product.price)) || 0;
                        addToCart({
                            id: String(product.id),
                            name: product.name,
                            price: priceNum,
                            image: product.image,
                            color: product.color,
                        });
                    }}
                    className={cn(
                        "w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors",
                        isOutOfStock
                            ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                            : "bg-foreground text-background group-hover:bg-energy"
                    )}
                >
                    {isOutOfStock ? (
                        "OUT OF STOCK"
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            ADD TO CART
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};
