"use client";

import React from "react";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Header({ onMenuClick }) {
    const { user, isAdmin } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-500 rounded-lg hover:bg-slate-100 lg:hidden"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="hidden sm:block">
                    <span className="text-sm font-medium text-slate-500">Workspace / </span>
                    <span className="text-sm font-semibold text-slate-800">
                        {isAdmin ? "Admin Portal" : "GTM Command Center"}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                        {user?.name ? user.name[0] : "U"}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-xs font-semibold text-slate-700 leading-none">{user?.name}</p>
                        <span className="text-[10px] text-slate-500 capitalize">{user?.role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

