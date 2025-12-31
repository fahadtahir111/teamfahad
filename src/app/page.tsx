"use client";

import { Hero } from "@/components/Hero";
import { FeaturesShowcase } from "@/components/FeaturesShowcase";
import { CanMorph } from "@/components/CanMorph";
import { EnergyGrid } from "@/components/EnergyGrid";
import { Preloader } from "@/components/Preloader";
import { Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      <Preloader />
      <Hero />
      <EnergyGrid />
      <FeaturesShowcase />
      <CanMorph />

      {/* Final Call to Action */}
      <section className="py-16 md:py-20 lg:py-24 bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-energy/50 to-transparent" />

        {/* Animated Glow Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-energy/5 blur-[120px] rounded-full scale-150 pointer-events-none"
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-energy rounded-full blur-sm"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 5) * 10}%`
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 glass-dark p-6 md:p-12 lg:p-20 rounded-[40px] md:rounded-[60px] lg:rounded-[80px] border-energy/20 max-w-6xl w-full overflow-hidden"
        >
          {/* Animated Border Glow */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-[80px] border-2 border-energy/20"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(255,69,0,0.1), transparent)"
            }}
          />

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-7xl lg:text-[10rem] font-black italic tracking-tighter mb-4 md:mb-6 lg:mb-8 uppercase leading-[0.85] text-white relative z-10"
          >
            READY TO <span className="text-energy block md:inline">POWER UP?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-lg lg:text-2xl font-medium text-white/50 max-w-2xl mb-6 md:mb-8 lg:mb-12 mx-auto leading-relaxed relative z-10"
          >
            Experience maximum energy boost with premium energy drinks. Engineered for peak performance and explosive flavors.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative z-10"
          >
            <Link href="/shop" className="inline-block px-8 py-4 md:px-12 md:py-6 lg:px-14 lg:py-7 bg-energy text-white text-base md:text-xl lg:text-2xl font-black rounded-2xl md:rounded-3xl shadow-[0_20px_60px_rgba(255,69,0,0.3)] hover:scale-105 transition-all active:scale-95 group flex items-center gap-3 mx-auto relative overflow-hidden">
              {/* Button Glow Effect */}
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <span className="relative z-10">SHOP ENERGY DRINKS</span>
              <Zap className="fill-white group-hover:scale-110 transition-transform w-5 h-5 md:w-6 md:h-6 relative z-10" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
