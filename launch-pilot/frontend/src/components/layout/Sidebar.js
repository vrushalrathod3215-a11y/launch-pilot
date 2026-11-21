"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
    Rocket,
    LayoutDashboard,
    Package,
    TrendingUp,
    Shield,
    Users,
    ShieldCheck,
    LogOut,
    UserCheck
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();
    const { user, logout, isAdmin } = useAuth();

    const mainNav = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Products", href: "/products", icon: Package },
        { name: "Market Research", href: "/market-research", icon: TrendingUp },
        { name: "Competitor Analysis", href: "/competitors", icon: Shield },
        { name: "Launch Plans", href: "/launch-plans", icon: Rocket }
    ];

    const adminNav = [
        { name: "Admin Dashboard", href: "/admin", icon: ShieldCheck },
        { name: "User Management", href: "/admin/users", icon: Users }
    ];

    const isActive = (href) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Brand Logo */}
                <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
                    <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30 text-white">
                        <Rocket className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="font-bold text-lg text-white tracking-tight">LaunchPilot</span>
                        <span className="block text-[10px] text-indigo-400 font-medium uppercase tracking-wider">GTM Strategy OS</span>
                    </div>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                    <div>
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Strategy & Execution
                        </p>
                        <nav className="space-y-1">
                            {mainNav.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                            active
                                                ? "bg-indigo-600 text-white shadow-sm"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {isAdmin && (
                        <div>
                            <p className="px-3 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                                Administration
                            </p>
                            <nav className="space-y-1">
                                {adminNav.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                active
                                                    ? "bg-amber-600 text-white shadow-sm"
                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${active ? "text-white" : "text-amber-400"}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    )}
                </div>

                {/* User Session Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
                                {user?.name ? user.name[0] : "U"}
                            </div>
                            <div className="truncate">
                                <p className="text-xs font-semibold text-white truncate">{user?.name || "User"}</p>
                                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <span
                            className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                                isAdmin
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            }`}
                        >
                            {user?.role || "user"}
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}

