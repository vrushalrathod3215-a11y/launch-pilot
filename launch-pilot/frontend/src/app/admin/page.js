"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { api } from "../../services/api";
import {
    ShieldCheck,
    Users,
    UserCheck,
    ShieldAlert,
    ArrowRight,
    Search
} from "lucide-react";

export default function AdminDashboardPage() {
    const [userStats, setUserStats] = useState({
        totalUsers: 0,
        admins: 0,
        regularUsers: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const res = await api.getUsers({ page: 1, limit: 10 });
                if (res?.users) {
                    setRecentUsers(res.users);
                    const total = res.totalUsers || res.users.length;
                    const admins = res.users.filter((u) => u.role === "admin").length;
                    setUserStats({
                        totalUsers: total,
                        admins: admins,
                        regularUsers: total - admins
                    });
                }
            } catch (err) {
                console.error("Failed to load admin stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    return (
        <DashboardLayout requireAdmin={true}>
            <div className="space-y-8">
                {/* Admin Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold mb-2">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Admin Control Portal
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Platform Administration
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Monitor registered users, manage permissions, and enforce platform governance.
                        </p>
                    </div>

                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                        <Users className="w-4 h-4" />
                        Manage All Users
                    </Link>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Total Accounts
                            </p>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mt-3">{userStats.totalUsers}</h3>
                        <p className="text-xs text-slate-400 mt-1">Registered LaunchPilot accounts</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Administrators
                            </p>
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mt-3">{userStats.admins}</h3>
                        <p className="text-xs text-slate-400 mt-1">Full system privilege accounts</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Standard Users
                            </p>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <UserCheck className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mt-3">{userStats.regularUsers}</h3>
                        <p className="text-xs text-slate-400 mt-1">Active entrepreneurs & builders</p>
                    </div>
                </div>

                {/* Recent Registrations Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm">Recent Registered Users</h3>
                        <Link href="/admin/users" className="text-xs font-semibold text-indigo-600 hover:underline">
                            View All Users &rarr;
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Registered At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : recentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-400">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    recentUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3.5 font-semibold text-slate-900">{u.name}</td>
                                            <td className="px-6 py-3.5 text-slate-600">{u.email}</td>
                                            <td className="px-6 py-3.5">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase border ${
                                                        u.role === "admin"
                                                            ? "bg-amber-50 text-amber-700 border-amber-200"
                                                            : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                    }`}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-slate-500">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

