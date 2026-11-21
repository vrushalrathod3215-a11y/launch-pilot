"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import {
    Package,
    Rocket,
    Shield,
    TrendingUp,
    Plus,
    ArrowRight,
    Clock,
    CheckCircle2
} from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [launchPlans, setLaunchPlans] = useState([]);
    const [competitors, setCompetitors] = useState([]);
    const [marketResearch, setMarketResearch] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [prodRes, planRes, compRes, resRes] = await Promise.all([
                    api.getProducts().catch(() => ({ products: [] })),
                    api.getLaunchPlans().catch(() => ({ launchPlans: [] })),
                    api.getCompetitors().catch(() => ({ competitors: [] })),
                    api.getMarketResearch().catch(() => ({ marketResearch: [] }))
                ]);

                setProducts(prodRes?.products || []);
                setLaunchPlans(planRes?.launchPlans || []);
                setCompetitors(compRes?.competitors || []);
                setMarketResearch(resRes?.marketResearch || []);
            } catch (error) {
                console.error("Dashboard data load error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stageColors = {
        Idea: "bg-blue-50 text-blue-700 border-blue-200",
        Prototype: "bg-purple-50 text-purple-700 border-purple-200",
        MVP: "bg-amber-50 text-amber-700 border-amber-200",
        Beta: "bg-orange-50 text-orange-700 border-orange-200",
        Launched: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Growth: "bg-indigo-50 text-indigo-700 border-indigo-200"
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
                            <Rocket className="w-3.5 h-3.5" />
                            Launch Command Center
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Welcome back, {user?.name || "Entrepreneur"}!
                        </h1>
                        <p className="mt-2 text-sm text-indigo-200 leading-relaxed">
                            Organize your target audience, benchmark competitor moves, refine unique selling points, and execute structured product launches.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Product
                            </Link>
                            <Link
                                href="/launch-plans"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors"
                            >
                                <Rocket className="w-4 h-4" />
                                New Launch Plan
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Products</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{products.length}</h3>
                            <Link href="/products" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
                                View all products &rarr;
                            </Link>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Launch Plans</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{launchPlans.length}</h3>
                            <Link href="/launch-plans" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
                                View launch roadmaps &rarr;
                            </Link>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Rocket className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Competitors Tracked</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{competitors.length}</h3>
                            <Link href="/competitors" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
                                Competitor analysis &rarr;
                            </Link>
                        </div>
                        <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                            <Shield className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Market Insights</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{marketResearch.length}</h3>
                            <Link href="/market-research" className="text-xs text-indigo-600 hover:underline mt-1 inline-block">
                                View research data &rarr;
                            </Link>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Main Content Two-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Products List */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-indigo-600" />
                                <h3 className="font-bold text-slate-900 text-sm">Products Portfolio</h3>
                            </div>
                            <Link href="/products" className="text-xs font-semibold text-indigo-600 hover:underline">
                                Manage
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {loading ? (
                                <div className="p-6 text-center text-xs text-slate-400">Loading products...</div>
                            ) : products.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-slate-700">No products yet</p>
                                    <p className="text-xs text-slate-400 mt-1 mb-4">Add your first product to start planning.</p>
                                    <Link
                                        href="/products"
                                        className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500"
                                    >
                                        Create Product
                                    </Link>
                                </div>
                            ) : (
                                products.slice(0, 5).map((p) => (
                                    <div key={p._id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{p.name}</h4>
                                            <p className="text-xs text-slate-500 truncate max-w-xs">{p.description}</p>
                                        </div>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stageColors[p.stage] || stageColors.Idea}`}>
                                            {p.stage}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Launch Plans List */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Rocket className="w-4 h-4 text-indigo-600" />
                                <h3 className="font-bold text-slate-900 text-sm">Launch Roadmaps</h3>
                            </div>
                            <Link href="/launch-plans" className="text-xs font-semibold text-indigo-600 hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {loading ? (
                                <div className="p-6 text-center text-xs text-slate-400">Loading launch plans...</div>
                            ) : launchPlans.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Rocket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm font-semibold text-slate-700">No launch plans yet</p>
                                    <p className="text-xs text-slate-400 mt-1 mb-4">Define launch milestones and task checklists.</p>
                                    <Link
                                        href="/launch-plans"
                                        className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-500"
                                    >
                                        Create Launch Plan
                                    </Link>
                                </div>
                            ) : (
                                launchPlans.slice(0, 5).map((plan) => {
                                    const totalTasks = plan.tasks?.length || 0;
                                    const completedTasks = plan.tasks?.filter((t) => t.status === "Completed").length || 0;
                                    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                                    return (
                                        <div key={plan._id} className="p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 text-sm">{plan.title}</h4>
                                                    <span className="text-[11px] text-slate-500">
                                                        Product: {plan.productId?.name || "Unassigned"}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                                    {plan.status}
                                                </span>
                                            </div>

                                            {totalTasks > 0 ? (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between text-[11px] text-slate-500">
                                                        <span>{completedTasks} of {totalTasks} tasks completed</span>
                                                        <span className="font-semibold">{percent}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                        <div
                                                            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-slate-400 italic">No tasks added yet.</p>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

