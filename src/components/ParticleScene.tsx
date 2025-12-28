"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ count = 5000, color = "#FF4500" }) => {
    const points = useRef<THREE.Points>(null!);

    // Reduced count to prevent WebGL context loss
    const optimizedCount = 500;

    const particles = useMemo(() => {
        const positions = new Float32Array(optimizedCount * 3);
        const colors = new Float32Array(optimizedCount * 3);
        const themeColor = new THREE.Color(color);
        const colorChoices = [
            themeColor,
            new THREE.Color("#FFFDD0"), // Vanilla
            new THREE.Color(color).clone().multiplyScalar(0.8), // Darker variant
        ];

        for (let i = 0; i < optimizedCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        return { positions, colors };
    }, [optimizedCount, color]);

    useFrame((state) => {
        // Subtle, lag-free rotation
        if (points.current) {
            points.current.rotation.y += 0.0008;
            points.current.rotation.x += 0.0004;
        }
    });

    return (
        <points ref={points} frustumCulled={true}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[particles.colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.025}
                vertexColors
                transparent
                opacity={0.3}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

const ParticleScene = ({ color }: { color?: string }) => {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            dpr={[1, 1.5]}
            gl={{
                antialias: false,
                powerPreference: "low-power",
                preserveDrawingBuffer: true,
                failIfMajorPerformanceCaveat: false
            }}
        >
            <Particles color={color} />
        </Canvas>
    );
};

export default ParticleScene;
