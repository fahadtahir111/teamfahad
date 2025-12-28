import { Hero } from "@/components/Hero";
import { FlavourUniverse } from "@/components/FlavourUniverse";
import { CanMorph } from "@/components/CanMorph";
import { EnergyGrid } from "@/components/EnergyGrid";
import { Preloader } from "@/components/Preloader";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col bg-background">
      <Preloader />
      <Hero />
      <EnergyGrid />
      <FlavourUniverse />
      <CanMorph />

      {/* Final Call to Action */}
      <section className="py-40 bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-energy/50 to-transparent" />

        {/* Glow Background */}
        <div className="absolute inset-0 bg-energy/5 blur-[120px] rounded-full scale-150 pointer-events-none" />

        <div className="relative z-10 glass-dark p-12 md:p-24 rounded-[80px] border-energy/20 max-w-6xl w-full">
          <h2 className="text-5xl md:text-[10rem] font-black italic tracking-tighter mb-8 uppercase leading-[0.85] text-white">
            READY TO <span className="text-energy block md:inline">ASCEND?</span>
          </h2>
          <p className="text-lg md:text-2xl font-medium text-white/50 max-w-2xl mb-12 mx-auto leading-relaxed">
            Join the Bubbloe elite and redefine your energy limits. The future is liquid, and it's waiting for you.
          </p>
          <button className="px-14 py-7 bg-energy text-white text-xl md:text-2xl font-black rounded-3xl shadow-[0_20px_60px_rgba(255,69,0,0.3)] hover:scale-105 transition-all active:scale-95 group flex items-center gap-3 mx-auto">
            SHOP THE COLLECTION
            <Zap className="fill-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </section>


    </div>
  );
}
