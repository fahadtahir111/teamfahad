"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, Layout, Info, Phone, Image as ImageIcon, Upload, Globe, Shield, Instagram, Twitter, MessageCircle, Radio } from "lucide-react";

export default function SettingsPage() {
    const [settings, setSettings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("hero");
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchSettings();
        
        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchSettings();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings");
            const data = await res.json();
            setSettings(Array.isArray(data) ? data : []);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Failed to fetch settings");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (key: string, value: string) => {
        setSettings(prev => {
            const index = prev.findIndex(s => s.key === key);
            if (index > -1) {
                const newSettings = [...prev];
                newSettings[index] = { ...newSettings[index], value };
                return newSettings;
            } else {
                return [...prev, { key, value, category: activeTab }];
            }
        });
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings: settings }),
            });
            if (res.ok) {
                alert("Settings saved successfully!");
            }
        } catch (error) {
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const getSettingValue = (key: string, defaultValue = "") => {
        return settings.find(s => s.key === key)?.value || defaultValue;
    };

    const tabs = [
        { id: "hero", name: "Hero Section", icon: Layout },
        { id: "about", name: "About Content", icon: Info },
        { id: "contact", name: "Contact Info", icon: Phone },
        { id: "social", name: "Social Links", icon: Globe },
        { id: "branding", name: "Branding", icon: RefreshCw },
        { id: "images", name: "Site Images", icon: ImageIcon },
        { id: "advanced", name: "Advanced", icon: Shield },
    ];

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-black tracking-tighter">SITE SETTINGS</h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                        <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Manage dynamic content and configurations</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchSettings();
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
                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className="bg-energy text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {saving ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                </div>
            </header>

            <div className="flex gap-4 border-b border-white/5 pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? "bg-white/10 text-white" : "text-white/40 hover:text-white"
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.name}
                    </button>
                ))}
            </div>

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {activeTab === "hero" && (
                    <>
                        <SettingField
                            label="Hero Title"
                            description="The main heading on the home page hero section"
                            value={getSettingValue("HERO_TITLE", "UNLEASH THE POWER WITHIN")}
                            onChange={(val: string) => handleUpdate("HERO_TITLE", val)}
                        />
                        <SettingField
                            label="Hero Subtitle"
                            description="The smaller text below the hero title"
                            value={getSettingValue("HERO_SUBTITLE", "Premium Energy Drinks for those who never stop.")}
                            onChange={(val: string) => handleUpdate("HERO_SUBTITLE", val)}
                        />
                        <SettingField
                            label="Hero Button Text"
                            description="Text on the main CTA button"
                            value={getSettingValue("HERO_CTA_TEXT", "SHOP COLLECTIONS")}
                            onChange={(val: string) => handleUpdate("HERO_CTA_TEXT", val)}
                        />
                    </>
                )}

                {activeTab === "about" && (
                    <>
                        <SettingField
                            label="About Title"
                            description="Main heading for the about section"
                            value={getSettingValue("ABOUT_TITLE", "FUELING HUMAN POTENTIAL")}
                            onChange={(val: string) => handleUpdate("ABOUT_TITLE", val)}
                            textarea
                        />
                        <SettingField
                            label="Brand Manifesto"
                            description="Detailed brand story and manifesto text"
                            value={getSettingValue("BRAND_MANIFESTO", "We believe energy is more than just a drink...")}
                            onChange={(val: string) => handleUpdate("BRAND_MANIFESTO", val)}
                            textarea
                        />
                    </>
                )}

                {activeTab === "contact" && (
                    <>
                        <SettingField
                            label="Contact Email"
                            description="Primary support and contact email"
                            value={getSettingValue("CONTACT_EMAIL", "support@bubbloe.com")}
                            onChange={(val: string) => handleUpdate("CONTACT_EMAIL", val)}
                        />
                        <SettingField
                            label="Location"
                            description="Physical office or store location"
                            value={getSettingValue("LOCATION", "ENERGY DISTRICT, NY 10001")}
                            onChange={(val: string) => handleUpdate("LOCATION", val)}
                        />
                    </>
                )}

                {activeTab === "images" && (
                    <>
                        <SettingField
                            label="Hero Background Image"
                            description="The main image/video shown in the hero section"
                            value={getSettingValue("HERO_IMAGE", "/images/hero-female.jpg")}
                            onChange={(val: string) => handleUpdate("HERO_IMAGE", val)}
                            image
                        />
                        <SettingField
                            label="About Mission Image"
                            description="Image shown in the mission/vision section of the about page"
                            value={getSettingValue("ABOUT_IMAGE_1", "/images/hero-female.jpg")}
                            onChange={(val: string) => handleUpdate("ABOUT_IMAGE_1", val)}
                            image
                        />
                        <SettingField
                            label="Contact Page Banner"
                            description="The banner image for the contact page"
                            value={getSettingValue("CONTACT_BANNER", "/images/hero-female.jpg")}
                            onChange={(val: string) => handleUpdate("CONTACT_BANNER", val)}
                            image
                        />
                    </>
                )}

                {activeTab === "branding" && (
                    <>
                        <SettingField
                            label="Brand Name"
                            description="The name of your brand shown in the header and footer"
                            value={getSettingValue("BRAND_NAME", "BUBBLOE")}
                            onChange={(val: string) => handleUpdate("BRAND_NAME", val)}
                        />
                        <SettingField
                            label="Logo Character"
                            description="The single character used in the logo icon (e.g. 'B')"
                            value={getSettingValue("LOGO_CHAR", "B")}
                            onChange={(val: string) => handleUpdate("LOGO_CHAR", val)}
                        />
                    </>
                )}

                {activeTab === "social" && (
                    <>
                        <SettingField
                            label="Instagram URL"
                            description="Link to your brand's Instagram profile"
                            value={getSettingValue("SOCIAL_INSTAGRAM", "https://instagram.com/bubbloe")}
                            onChange={(val: string) => handleUpdate("SOCIAL_INSTAGRAM", val)}
                            icon={Instagram}
                        />
                        <SettingField
                            label="X (Twitter) URL"
                            description="Link to your brand's X profile"
                            value={getSettingValue("SOCIAL_X", "https://x.com/bubbloe")}
                            onChange={(val: string) => handleUpdate("SOCIAL_X", val)}
                            icon={Twitter}
                        />
                        <SettingField
                            label="Discord Invite"
                            description="Link to your community Discord server"
                            value={getSettingValue("SOCIAL_DISCORD", "https://discord.gg/bubbloe")}
                            onChange={(val: string) => handleUpdate("SOCIAL_DISCORD", val)}
                            icon={MessageCircle}
                        />
                    </>
                )}

                {activeTab === "advanced" && (
                    <>
                        <div className="col-span-2 space-y-4">
                            <div className="p-6 rounded-2xl bg-energy/5 border border-energy/20 flex items-center justify-between">
                                <div>
                                    <h3 className="font-black uppercase tracking-widest text-energy">Store Status</h3>
                                    <p className="text-white/40 text-xs">Switch your store between Open and Maintenance Mode</p>
                                </div>
                                <div className="flex bg-black/40 p-1 rounded-xl">
                                    <button
                                        onClick={() => handleUpdate("STORE_STATUS", "OPEN")}
                                        className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${getSettingValue("STORE_STATUS", "OPEN") === "OPEN" ? "bg-energy text-black" : "text-white/40 hover:text-white"}`}
                                    >
                                        OPEN
                                    </button>
                                    <button
                                        onClick={() => handleUpdate("STORE_STATUS", "MAINTENANCE")}
                                        className={`px-6 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${getSettingValue("STORE_STATUS", "OPEN") === "MAINTENANCE" ? "bg-red-500 text-white" : "text-white/40 hover:text-white"}`}
                                    >
                                        MAINTENANCE
                                    </button>
                                </div>
                            </div>
                        </div>
                        <SettingField
                            label="Maintenance Message"
                            description="Message shown to customers when the store is in maintenance mode"
                            value={getSettingValue("MAINTENANCE_MESSAGE", "WE ARE CURRENTLY UPGRADING OUR SYSTEMS. PLEASE CHECK BACK SOON!")}
                            onChange={(val: string) => handleUpdate("MAINTENANCE_MESSAGE", val)}
                            textarea
                        />
                        <SettingField
                            label="Global Site Title"
                            description="The title tag shown in browser tabs"
                            value={getSettingValue("SITE_TITLE", "BUBBLOE | ENERGY REDEFINED")}
                            onChange={(val: string) => handleUpdate("SITE_TITLE", val)}
                        />
                    </>
                )}
            </motion.div>
        </div>
    );
}

function SettingField({ label, description, value, onChange, textarea = false, image = false, icon: Icon }: any) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2 p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-2">
                {Icon && <Icon size={18} className="text-energy" />}
                <label className="text-sm font-black uppercase tracking-widest">{label}</label>
            </div>
            <p className="text-white/20 text-xs mb-4">{description}</p>

            {image ? (
                <div className="flex flex-col gap-4">
                    <div className="w-full h-40 bg-black/50 border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center">
                        {value ? (
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="text-white/10" size={40} />
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <RefreshCw className="text-energy animate-spin" />
                            </div>
                        )}
                    </div>
                    <div className="relative group cursor-pointer">
                        <input
                            type="file"
                            onChange={handleUpload}
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl py-4 flex items-center justify-center gap-2 group-hover:border-energy/50 transition-all">
                            <Upload size={18} className="text-white/20 group-hover:text-energy" />
                            <span className="text-[10px] font-bold text-white/40">UPLOAD IMAGE</span>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/60 focus:border-energy outline-none transition-colors"
                        placeholder="Or enter image URL"
                    />
                </div>
            ) : textarea ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none transition-colors"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy outline-none transition-colors"
                />
            )}
        </div>
    );
}
