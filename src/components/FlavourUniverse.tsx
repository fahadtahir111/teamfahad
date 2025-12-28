"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const flavours = [
    { name: "Wild Berry", color: "#A78BFA", position: [-4, 2, -2], speed: 2 },
    { name: "Peach Punch", color: "#FDBA74", position: [4, -2, -3], speed: 1.5 },
    { name: "Minty Fresh", color: "#98FFED", position: [-3, -2.5, 2], speed: 2.5 },
    { name: "Citrus Blast", color: "#FACC15", position: [3, 2.5, 1], speed: 1.8 },
];

const FlavourSphere = ({ color, position, speed }: any) => {
    return (
        <Float speed={speed} rotationIntensity={2} floatIntensity={1} floatingRange={[-0.5, 0.5]}>
            <Sphere position={position} args={[0.6, 64, 64]}>
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.4}
                    radius={1}
                    metalness={0.1}
                    roughness={0.2}
                    transparent
                    opacity={0.9}
                />
            </Sphere>
        </Float>
    );
};

const FlavourCore = ({ rotateY }: { rotateY: any }) => {
    const groupRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y = rotateY.get();
        }
    });

    return (
        <group ref={groupRef}>
            {flavours.map((f, i) => (
                <FlavourSphere key={i} {...f} />
            ))}

            {/* Central Core - Fixed Position */}
            <Sphere args={[2, 128, 128]}>
                <MeshDistortMaterial
                    color="#FF4500"
                    speed={3}
                    distort={0.3}
                    radius={1}
                    metalness={0.2}
                    roughness={0.1}
                    emissive="#FF4500"
                    emissiveIntensity={0.2}
                />
            </Sphere>
        </group>
    );
};

export const FlavourUniverse = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
    const rotateY = useTransform(smoothProgress, [0, 1], [0, Math.PI * 2]);

    return (
        <section ref={containerRef} className="relative h-[150vh] w-full bg-background overflow-hidden border-y border-white/5">
            <motion.div
                style={{ opacity, scale }}
                className="sticky top-0 h-screen w-full flex items-center justify-center pt-32"
            >
                <div className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 10], fov: 40 }} dpr={1} gl={{ powerPreference: "default" }}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                        <pointLight position={[-10, -10, -10]} color="#FF4500" intensity={0.5} />

                        <FlavourCore rotateY={rotateY} />

                        <ContactShadows
                            position={[0, -4.5, 0]}
                            opacity={0.4}
                            scale={20}
                            blur={2}
                            far={4.5}
                        />
                    </Canvas>
                </div>

                <div className="relative z-10 w-full max-w-7xl px-6 pointer-events-none text-center">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-white font-black text-[10px] md:text-sm uppercase tracking-[0.5em] mb-4 block animate-pulse drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">Molecular Essence</span>
                        <h2 className="text-3xl sm:text-4xl md:text-[8rem] font-black italic text-white uppercase leading-[0.8] tracking-tighter mb-8 md:mb-12 drop-shadow-[0_10px_50px_rgba(0,0,0,0.8)]">
                            BUBBLOE <br /> <span className="text-white">CORE</span>
                        </h2>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mt-12 md:mt-20">
                            {flavours.map((f, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: f.color }} />
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{f.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden lg:block">
                    <div className="flex flex-col gap-20 items-center">
                        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-energy to-transparent" />
                        <span className="vertical-text text-[10px] font-black uppercase text-energy tracking-[1em] opacity-80">SCROLL TO ORBIT</span>
                        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-energy to-transparent" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
