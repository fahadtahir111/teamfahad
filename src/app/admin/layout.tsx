"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Users,
    BarChart3,
    Image,
    FileText,
    Tag,
    Truck,
    CreditCard,
    Globe,
    Palette,
    Search,
    FolderOpen,
    TrendingUp,
    Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Categories", icon: FolderOpen, href: "/admin/categories" },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Customers", icon: Users, href: "/admin/customers" },
    { name: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { name: "Inventory", icon: Package, href: "/admin/inventory" },
    { name: "Coupons", icon: Tag, href: "/admin/coupons" },
    { name: "Content", icon: FileText, href: "/admin/content" },
    { name: "Payments", icon: CreditCard, href: "/admin/payments" },
    { name: "Theme", icon: Palette, href: "/admin/theme" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0a0a0a] sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/" className="text-2xl font-black tracking-tighter">
                        BUBBLOE<span className="text-energy italic">.DRNK</span>
                    </Link>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-2">Admin Dashboard</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-energy text-black font-bold shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? "text-black" : "group-hover:scale-110 transition-transform"} />
                                <span>{item.name}</span>
                                {isActive && <motion.div layoutId="active" className="ml-auto"><ChevronRight size={16} /></motion.div>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-3 px-4 py-3 w-full text-white/40 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/5 group"
                    >
                        <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
                <span className="font-black tracking-tighter">BUBBLOE<span className="text-energy italic">.D</span></span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="fixed inset-0 z-40 md:hidden bg-[#0a0a0a] pt-20 px-6"
                    >
                        <nav className="space-y-4">
                            {sidebarItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-4 text-2xl font-bold py-4 border-b border-white/5"
                                >
                                    <item.icon size={24} className="text-energy" />
                                    {item.name}
                                </Link>
                            ))}
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex items-center gap-4 text-2xl font-bold py-4 text-red-500 w-full text-left"
                            >
                                <LogOut size={24} />
                                Sign Out
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 w-full pt-16 md:pt-0">
                <div className="p-6 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
