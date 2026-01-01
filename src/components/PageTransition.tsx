"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const reducedMotion = useReducedMotion();

    return (
        <>
            {/* SVG Filter for Gooey Effect - Only on high-end devices */}
            {!reducedMotion && (
                <svg className="hidden">
                    <defs>
                        <filter id="liquid-goo">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                            <feColorMatrix
                                in="blur"
                                mode="matrix"
                                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12"
                                result="goo"
                            />
                            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                        </filter>
                    </defs>
                </svg>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: reducedMotion ? 0.1 : 0.5,
                        ease: reducedMotion ? "linear" : [0.76, 0, 0.24, 1],
                    }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    className="min-h-screen"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </>
    );
};
