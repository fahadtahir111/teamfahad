"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Palette, Save, Loader2, Eye, Type, Image as ImageIcon, Sparkles, Radio, RefreshCw } from "lucide-react";

interface ThemeSettings {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    logo: string;
    favicon: string;
}

export default function ThemePage() {
    const [theme, setTheme] = useState<ThemeSettings>({
        primaryColor: "#FF4500",
        secondaryColor: "#FFFDD0",
        backgroundColor: "#0a0a0a",
        textColor: "#ffffff",
        fontFamily: "Inter",
        logo: "",
        favicon: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchTheme();
        
        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchTheme();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const fetchTheme = async () => {
        try {
            const res = await fetch("/api/admin/theme");
            const data = await res.json();
            if (data) {
                setTheme(data);
                setLastUpdate(new Date());
            }
        } catch (error) {
            console.error("Error fetching theme:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch("/api/admin/theme", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(theme),
            });
            alert("Theme saved! Changes will be visible after refresh.");
        } catch (error) {
            alert("Error saving theme");
        } finally {
            setIsSaving(false);
        }
    };

    const updateTheme = (field: keyof ThemeSettings, value: string) => {
        setTheme(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-energy" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tight">THEME <span className="text-energy italic">CUSTOMIZATION</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Customize your website's appearance</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchTheme();
                        }}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                            isLive 
                                ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20" 
                                : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
                        }`}
                    >
                        {isLive ? <Radio size={16} /> : <RefreshCw size={16} />}
                        {isLive ? "Live" : "Manual"}
                    </button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-energy text-black font-black rounded-xl flex items-center gap-2 hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {isSaving ? "Saving..." : "Save Theme"}
                    </motion.button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Color Settings */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Palette size={24} className="text-energy" />
                        Colors
                    </h2>

                    <ColorPicker
                        label="Primary Color (Energy)"
                        value={theme.primaryColor}
                        onChange={(val) => updateTheme("primaryColor", val)}
                    />
                    <ColorPicker
                        label="Secondary Color"
                        value={theme.secondaryColor}
                        onChange={(val) => updateTheme("secondaryColor", val)}
                    />
                    <ColorPicker
                        label="Background Color"
                        value={theme.backgroundColor}
                        onChange={(val) => updateTheme("backgroundColor", val)}
                    />
                    <ColorPicker
                        label="Text Color"
                        value={theme.textColor}
                        onChange={(val) => updateTheme("textColor", val)}
                    />
                </div>

                {/* Typography & Branding */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Type size={24} className="text-energy" />
                        Typography & Branding
                    </h2>

                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                            Font Family
                        </label>
                        <select
                            value={theme.fontFamily}
                            onChange={(e) => updateTheme("fontFamily", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                        >
                            <option value="Inter">Inter</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Open Sans">Open Sans</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block flex items-center gap-2">
                            <ImageIcon size={16} />
                            Logo URL
                        </label>
                        <input
                            type="url"
                            value={theme.logo}
                            onChange={(e) => updateTheme("logo", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                            placeholder="https://yoursite.com/logo.png"
                        />
                        {theme.logo && (
                            <div className="mt-4 w-32 h-16 bg-white/5 rounded-xl overflow-hidden">
                                <img src={theme.logo} alt="Logo preview" className="w-full h-full object-contain" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block flex items-center gap-2">
                            <ImageIcon size={16} />
                            Favicon URL
                        </label>
                        <input
                            type="url"
                            value={theme.favicon}
                            onChange={(e) => updateTheme("favicon", e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none"
                            placeholder="https://yoursite.com/favicon.ico"
                        />
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Eye size={20} className="text-energy" />
                    Live Preview
                </h3>
                <div className="bg-white rounded-xl p-8" style={{ backgroundColor: theme.backgroundColor }}>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl"
                                style={{ backgroundColor: theme.primaryColor, color: theme.textColor }}
                            >
                                B
                            </div>
                            <span className="font-black text-2xl" style={{ color: theme.textColor }}>
                                BUBBLOE
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black" style={{ color: theme.textColor }}>
                                Sample Heading
                            </h2>
                            <p style={{ color: theme.textColor, opacity: 0.7 }}>
                                This is how your text will look with the selected colors and font.
                            </p>
                        </div>
                        <button
                            className="px-6 py-3 rounded-full font-black"
                            style={{ backgroundColor: theme.primaryColor, color: "#000" }}
                        >
                            Sample Button
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
    return (
        <div>
            <label className="text-xs font-black uppercase tracking-widest text-white/60 mb-2 block">
                {label}
            </label>
            <div className="flex gap-4">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-20 h-12 rounded-xl border border-white/10 cursor-pointer"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none font-mono text-sm"
                />
            </div>
        </div>
    );
}

