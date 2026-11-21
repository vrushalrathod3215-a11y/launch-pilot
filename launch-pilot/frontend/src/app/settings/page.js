"use client";

import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { User, Shield, Server, Key, CheckCircle } from "lucide-react";

export default function SettingsPage() {
    const { user, isAdmin } = useAuth();

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Platform Settings</h1>
                    <p className="text-xs text-slate-500 mt-1">
                        View profile details, security credentials, and API environment status.
                    </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-600" />
                            User Profile Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-slate-400 block mb-1">Full Name</span>
                                <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    {user?.name}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-1">Email Address</span>
                                <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    {user?.email}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-1">Account Role</span>
                                <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 uppercase">
                                    {user?.role}
                                </p>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-1">User ID</span>
                                <p className="font-mono text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    {user?.id || user?._id}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                            <Server className="w-4 h-4 text-indigo-600" />
                            Backend Environment & Security
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    <span className="font-medium text-emerald-900">API Connection</span>
                                </div>
                                <span className="font-mono text-[11px] text-emerald-700">http://localhost:5000/api</span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-slate-500" />
                                    <span>Authentication Mechanism</span>
                                </div>
                                <span className="font-semibold text-slate-900">JWT (HS256 Bearer Token)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

