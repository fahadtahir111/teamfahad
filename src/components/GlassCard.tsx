"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    color: string;
}

export const GlassCard = ({ product }: { product: Product }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useCart();

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

    return (
        <motion.div
            ref={ref}
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
                    <div className={cn("w-3 h-3 rounded-full", product.color)} />
                </div>

                {/* Product Image */}
                <div className="relative w-48 h-48 group-hover:scale-110 transition-transform duration-500">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Flavor Explosion Dots */}
                    {isHovered && [1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: [0, 1.5, 0],
                                x: (Math.random() - 0.5) * 200,
                                y: (Math.random() - 0.5) * 200,
                            }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                            className={cn("absolute w-4 h-4 rounded-full blur-sm", product.color)}
                        />
                    ))}
                </div>

                <div className="text-center">
                    <h3 className="text-2xl font-black italic mb-2 tracking-tight">
                        {product.name}
                    </h3>
                    <p className="text-energy font-bold text-xl">{product.price}</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        const priceNum = parseFloat(product.price.replace("$", ""));
                        addToCart({
                            id: product.id,
                            name: product.name,
                            price: priceNum,
                            image: product.image,
                            color: product.color,
                        });
                    }}
                    className="w-full py-3 rounded-2xl bg-foreground text-background font-bold flex items-center justify-center gap-2 group-hover:bg-energy transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    ADD TO CART
                </motion.button>
            </div>
        </motion.div>
    );
};
