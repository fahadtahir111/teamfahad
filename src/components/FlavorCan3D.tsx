"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Cylinder, MeshTransmissionMaterial, Text3D, useTexture } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

interface FlavorCan3DProps {
    color: string;
    position?: [number, number, number];
    scale?: number;
    onClick?: () => void;
    isActive?: boolean;
    flavorName?: string;
}

export const FlavorCan3D: React.FC<FlavorCan3DProps> = ({
    color,
    position = [0, 0, 0],
    scale = 1,
    onClick,
    isActive = false,
    flavorName = "BUBBLOE"
}) => {
    const meshRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Spring animation for hover and active states
    const { springScale, springRotation } = useSpring({
        springScale: hovered ? scale * 1.15 : isActive ? scale * 1.1 : scale,
        springRotation: isActive ? Math.PI * 2 : 0,
        config: { tension: 300, friction: 20 }
    });

    // Gentle floating animation
    useFrame((state) => {
        if (meshRef.current && !hovered) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <animated.group
            ref={meshRef}
            position={position}
            scale={springScale}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Can Body */}
            <Cylinder args={[0.5, 0.5, 2, 32]} castShadow receiveShadow>
                <meshStandardMaterial
                    color={color}
                    metalness={0.9}
                    roughness={0.1}
                    envMapIntensity={1}
                />
            </Cylinder>

            {/* Can Top */}
            <Cylinder args={[0.5, 0.45, 0.1, 32]} position={[0, 1.05, 0]} castShadow>
                <meshStandardMaterial
                    color="#888888"
                    metalness={1}
                    roughness={0.2}
                />
            </Cylinder>

            {/* Can Bottom */}
            <Cylinder args={[0.5, 0.5, 0.1, 32]} position={[0, -1.05, 0]} castShadow>
                <meshStandardMaterial
                    color="#666666"
                    metalness={1}
                    roughness={0.3}
                />
            </Cylinder>

            {/* Pull Tab */}
            <group position={[0, 1.15, 0]}>
                <Cylinder args={[0.15, 0.15, 0.05, 16]} rotation={[0, 0, 0]}>
                    <meshStandardMaterial
                        color="#AAAAAA"
                        metalness={1}
                        roughness={0.1}
                    />
                </Cylinder>
            </group>

            {/* Glow effect when hovered or active */}
            {(hovered || isActive) && (
                <pointLight
                    position={[0, 0, 0]}
                    intensity={hovered ? 2 : 1}
                    distance={5}
                    color={color}
                />
            )}

            {/* Rim light for premium look */}
            <pointLight
                position={[2, 2, 2]}
                intensity={0.5}
                distance={10}
                color="#ffffff"
            />
        </animated.group>
    );
};
