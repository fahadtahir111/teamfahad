"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const Preloader = () => {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsVisible(false), 500);
                    return 100;
                }
                return prev + 1;
            });
        }, 20);
        return () => clearInterval(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
                >
                    <div className="relative flex flex-col items-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black italic tracking-tighter mb-12"
                        >
                            BUBBLOE <span className="text-energy">CHARGING...</span>
                        </motion.h1>

                        <div className="w-64 h-2 bg-foreground/10 rounded-full overflow-hidden relative">
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-energy shadow-[0_0_20px_#FF4500]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="mt-4 text-center font-bold text-energy">
                            {progress}%
                        </div>
                    </div>

                    <div className="absolute inset-0 z-[-1] opacity-20">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-energy/30 rounded-full blur-[120px] animate-pulse" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
