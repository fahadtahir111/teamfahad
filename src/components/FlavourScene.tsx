"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

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
        if (groupRef.current && rotateY) {
            // Using try-catch or safe access if rotateY is a MotionValue
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

interface FlavourSceneProps {
    rotateY: any; // MotionValue<number>
}

const FlavourScene = ({ rotateY }: FlavourSceneProps) => {
    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 40 }}
            dpr={[1, 1.5]}
            gl={{
                antialias: false,
                powerPreference: "low-power",
                preserveDrawingBuffer: true,
                failIfMajorPerformanceCaveat: false
            }}
        >
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
    );
};

export default FlavourScene;
