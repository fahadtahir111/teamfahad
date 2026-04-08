"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Image as ImageIcon, FileText, Type, Globe, Loader2, Radio, RefreshCw } from "lucide-react";
import { formatPkr } from "@/lib/currency";

interface ContentSection {
    id: string;
    key: string;
    title: string;
    type: "text" | "textarea" | "image" | "number" | "url";
    value: string;
    description?: string;
}

export default function ContentManagementPage() {
    const [sections, setSections] = useState<ContentSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isLive, setIsLive] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchContent();
        
        // Set up real-time polling every 5 seconds
        if (isLive) {
            intervalRef.current = setInterval(() => {
                fetchContent();
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLive]);

    const fetchContent = async () => {
        try {
            const res = await fetch("/api/admin/settings");
            
            // Check if response is ok
            if (!res.ok) {
                console.error("API error:", res.status, res.statusText);
                // Set default sections if API fails
                setSections(getDefaultSections());
                setIsLoading(false);
                return;
            }
            
            const data = await res.json();
            
            // Ensure data is always an array
            const settingsArray = Array.isArray(data) ? data : [];
            
            const contentSections: ContentSection[] = [
                // General
                { id: "1", key: "site_title", title: "Site Title", type: "text", value: settingsArray.find((s: any) => s.key === "site_title")?.value || "BUBBLOE", description: "Your website's main title" },
                { id: "2", key: "site_tagline", title: "Site Tagline", type: "textarea", value: settingsArray.find((s: any) => s.key === "site_tagline")?.value || "Premium Energy Drinks", description: "Short description of your brand" },
                { id: "3", key: "hero_title", title: "Hero Title", type: "text", value: settingsArray.find((s: any) => s.key === "hero_title")?.value || "MAXIMUM ENERGY", description: "Main headline on homepage" },
                { id: "4", key: "hero_subtitle", title: "Hero Subtitle", type: "textarea", value: settingsArray.find((s: any) => s.key === "hero_subtitle")?.value || "Premium energy drinks with explosive flavors", description: "Subtitle on homepage" },
                
                // About
                { id: "5", key: "about_title", title: "About Page Title", type: "text", value: settingsArray.find((s: any) => s.key === "about_title")?.value || "PREMIUM ENERGY", description: "Title for about page" },
                { id: "6", key: "about_description", title: "About Description", type: "textarea", value: settingsArray.find((s: any) => s.key === "about_description")?.value || "We craft premium beverages engineered for maximum performance", description: "Main about page content" },
                
                // Contact
                { id: "7", key: "contact_email", title: "Contact Email", type: "text", value: settingsArray.find((s: any) => s.key === "contact_email")?.value || "info@bubbloe.com", description: "Contact email address" },
                { id: "8", key: "contact_phone", title: "Contact Phone", type: "text", value: settingsArray.find((s: any) => s.key === "contact_phone")?.value || "+92 300 1234567", description: "Contact phone number" },
                { id: "9", key: "contact_address", title: "Address", type: "textarea", value: settingsArray.find((s: any) => s.key === "contact_address")?.value || "Karachi, Pakistan", description: "Business address" },
                
                // Footer
                { id: "10", key: "footer_text", title: "Footer Text", type: "textarea", value: settingsArray.find((s: any) => s.key === "footer_text")?.value || "© 2025 BUBBLOE. All rights reserved.", description: "Footer copyright text" },
            ];
            
            setSections(contentSections);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Error fetching content:", error);
            // Set default sections on error
            setSections(getDefaultSections());
        } finally {
            setIsLoading(false);
        }
    };

    const getDefaultSections = (): ContentSection[] => [
        { id: "1", key: "site_title", title: "Site Title", type: "text", value: "BUBBLOE", description: "Your website's main title" },
        { id: "2", key: "site_tagline", title: "Site Tagline", type: "textarea", value: "Premium Energy Drinks", description: "Short description of your brand" },
        { id: "3", key: "hero_title", title: "Hero Title", type: "text", value: "MAXIMUM ENERGY", description: "Main headline on homepage" },
        { id: "4", key: "hero_subtitle", title: "Hero Subtitle", type: "textarea", value: "Premium energy drinks with explosive flavors", description: "Subtitle on homepage" },
        { id: "5", key: "about_title", title: "About Page Title", type: "text", value: "PREMIUM ENERGY", description: "Title for about page" },
        { id: "6", key: "about_description", title: "About Description", type: "textarea", value: "We craft premium beverages engineered for maximum performance", description: "Main about page content" },
        { id: "7", key: "contact_email", title: "Contact Email", type: "text", value: "info@bubbloe.com", description: "Contact email address" },
        { id: "8", key: "contact_phone", title: "Contact Phone", type: "text", value: "+92 300 1234567", description: "Contact phone number" },
        { id: "9", key: "contact_address", title: "Address", type: "textarea", value: "Karachi, Pakistan", description: "Business address" },
        { id: "10", key: "footer_text", title: "Footer Text", type: "textarea", value: "© 2025 BUBBLOE. All rights reserved.", description: "Footer copyright text" },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await Promise.all(
                sections.map(section =>
                    fetch("/api/admin/settings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            key: section.key,
                            value: section.value,
                            category: "content"
                        })
                    })
                )
            );
            alert("Content saved successfully!");
        } catch (error) {
            alert("Error saving content");
        } finally {
            setIsSaving(false);
        }
    };

    const updateSection = (id: string, value: string) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, value } : s));
    };

    const tabs = [
        { id: "general", label: "General", icon: Globe },
        { id: "about", label: "About", icon: FileText },
        { id: "contact", label: "Contact", icon: Type },
        { id: "footer", label: "Footer", icon: FileText },
    ];

    const filteredSections = sections.filter(s => {
        if (activeTab === "general") return ["site_title", "site_tagline", "hero_title", "hero_subtitle"].includes(s.key);
        if (activeTab === "about") return ["about_title", "about_description"].includes(s.key);
        if (activeTab === "contact") return ["contact_email", "contact_phone", "contact_address"].includes(s.key);
        if (activeTab === "footer") return ["footer_text"].includes(s.key);
        return false;
    });

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
                        <h1 className="text-4xl font-black tracking-tight">CONTENT <span className="text-energy italic">MANAGEMENT</span></h1>
                        {isLive && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs font-black text-green-400 uppercase tracking-widest">LIVE</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-white/40 font-medium">Manage all website content like WordPress</p>
                        <span className="text-xs text-white/30 font-bold">
                            Updated: {lastUpdate.toLocaleTimeString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setIsLive(!isLive);
                            fetchContent();
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
                        {isSaving ? "Saving..." : "Save All Changes"}
                    </motion.button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/5">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 font-bold flex items-center gap-2 border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? "border-energy text-energy"
                                : "border-transparent text-white/40 hover:text-white/60"
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSections.map((section, idx) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl space-y-4"
                    >
                        <div>
                            <label className="text-sm font-black uppercase tracking-widest text-white/60 mb-2 block">
                                {section.title}
                            </label>
                            {section.description && (
                                <p className="text-xs text-white/40 mt-1">{section.description}</p>
                            )}
                        </div>

                        {section.type === "text" && (
                            <input
                                type="text"
                                value={section.value}
                                onChange={(e) => updateSection(section.id, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy focus:outline-none transition-colors"
                            />
                        )}

                        {section.type === "textarea" && (
                            <textarea
                                value={section.value}
                                onChange={(e) => updateSection(section.id, e.target.value)}
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy focus:outline-none transition-colors resize-none"
                            />
                        )}

                        {section.type === "url" && (
                            <input
                                type="url"
                                value={section.value}
                                onChange={(e) => updateSection(section.id, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-energy focus:outline-none transition-colors"
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

