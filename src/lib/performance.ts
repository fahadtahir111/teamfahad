"use client";

/**
 * Performance detection utilities for low-end device optimization
 */

export const isLowEndDevice = (): boolean => {
    if (typeof window === 'undefined') return false;

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 2;

    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory || 4;

    // Check connection speed (if available)
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType || '4g';

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Low-end device criteria
    return (
        cores <= 2 ||
        memory <= 2 ||
        effectiveType === 'slow-2g' ||
        effectiveType === '2g' ||
        prefersReducedMotion
    );
};

export const shouldReduceAnimations = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches || isLowEndDevice();
};

export const getOptimalParticleCount = (): number => {
    if (typeof window === 'undefined') return 100;

    if (isLowEndDevice()) {
        return 50; // Minimal particles for low-end
    }

    const cores = navigator.hardwareConcurrency || 2;
    if (cores <= 2) {
        return 100; // Reduced for 2-core devices
    }

    return 200; // Standard for better devices
};

export const getOptimalDPR = (): [number, number] => {
    if (typeof window === 'undefined') return [1, 1];

    if (isLowEndDevice()) {
        return [0.5, 1]; // Lower DPR for low-end
    }

    return [1, 1.5]; // Standard DPR
};

