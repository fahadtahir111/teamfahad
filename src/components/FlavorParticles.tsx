"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FlavorParticlesProps {
    color: string;
    count?: number;
    flavorType: "vanilla" | "peach" | "mint" | "berry" | "chrome";
}

export const FlavorParticles: React.FC<FlavorParticlesProps> = ({
    color,
    count = 100,
    flavorType
}) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate particle positions based on flavor type
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Use index-based pseudo-randomness for purity
            const pseudoRand = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };

            const r1 = pseudoRand(i + 1);
            const r2 = pseudoRand(i + 2);
            const r3 = pseudoRand(i + 3);

            switch (flavorType) {
                case "vanilla":
                    positions[i3] = (r1 - 0.5) * 8;
                    positions[i3 + 1] = (r2 - 0.5) * 8;
                    positions[i3 + 2] = (r3 - 0.5) * 8;
                    velocities[i3] = (r1 - 0.5) * 0.02;
                    velocities[i3 + 1] = r2 * 0.01;
                    velocities[i3 + 2] = (r3 - 0.5) * 0.02;
                    sizes[i] = r1 * 0.05 + 0.02;
                    break;

                case "peach":
                    const angle = r1 * Math.PI * 2;
                    const radius = r2 * 5;
                    positions[i3] = Math.cos(angle) * radius;
                    positions[i3 + 1] = (r3 - 0.5) * 6;
                    positions[i3 + 2] = Math.sin(angle) * radius;
                    velocities[i3] = Math.cos(angle) * 0.03;
                    velocities[i3 + 1] = (r1 - 0.5) * 0.02;
                    velocities[i3 + 2] = Math.sin(angle) * 0.03;
                    sizes[i] = r2 * 0.08 + 0.03;
                    break;

                case "mint":
                    positions[i3] = (r1 - 0.5) * 10;
                    positions[i3 + 1] = r2 * 10 - 5;
                    positions[i3 + 2] = (r3 - 0.5) * 10;
                    velocities[i3] = (r1 - 0.5) * 0.01;
                    velocities[i3 + 1] = -r2 * 0.03;
                    velocities[i3 + 2] = (r3 - 0.5) * 0.01;
                    sizes[i] = r1 * 0.04 + 0.01;
                    break;

                case "berry":
                    const spiralAngle = (i / count) * Math.PI * 4;
                    const spiralRadius = (i / count) * 6;
                    positions[i3] = Math.cos(spiralAngle) * spiralRadius;
                    positions[i3 + 1] = (r1 - 0.5) * 8;
                    positions[i3 + 2] = Math.sin(spiralAngle) * spiralRadius;
                    velocities[i3] = -Math.sin(spiralAngle) * 0.02;
                    velocities[i3 + 1] = (r2 - 0.5) * 0.015;
                    velocities[i3 + 2] = Math.cos(spiralAngle) * 0.02;
                    sizes[i] = r3 * 0.06 + 0.02;
                    break;

                case "chrome":
                    const layer = Math.floor(i / (count / 3));
                    const layerAngle = (i % (count / 3)) / (count / 3) * Math.PI * 2;
                    const layerRadius = 3 + layer * 2;
                    positions[i3] = Math.cos(layerAngle) * layerRadius;
                    positions[i3 + 1] = (r1 - 0.5) * 6;
                    positions[i3 + 2] = Math.sin(layerAngle) * layerRadius;
                    velocities[i3] = Math.cos(layerAngle) * 0.025;
                    velocities[i3 + 1] = (r2 - 0.5) * 0.01;
                    velocities[i3 + 2] = Math.sin(layerAngle) * 0.025;
                    sizes[i] = r3 * 0.07 + 0.03;
                    break;
            }
        }

        return { positions, velocities, sizes };
    }, [count, flavorType]);

    // Animate particles
    useFrame((state) => {
        if (!pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const { velocities } = particles;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Update positions
            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];

            // Boundary checks - reset particles that go too far
            const boundary = 10;
            if (Math.abs(positions[i3]) > boundary ||
                Math.abs(positions[i3 + 1]) > boundary ||
                Math.abs(positions[i3 + 2]) > boundary) {
                positions[i3] = 0;
                positions[i3 + 1] = 0;
                positions[i3 + 2] = 0;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles.positions, 3]}
                    count={count}
                />
                <bufferAttribute
                    attach="attributes-size"
                    args={[particles.sizes, 1]}
                    count={count}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color={color}
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};
