"use client";

import React from "react";
import Link from "next/link";
import {
    Rocket,
    TrendingUp,
    ShieldCheck,
    Target,
    Layers,
    ArrowRight,
    CheckCircle2,
    BarChart3
} from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
                            <Rocket className="w-5 h-5" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-white">
                            Launch<span className="text-indigo-400">Pilot</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                        >
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />

                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold shadow-inner">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        Next-Gen GTM Strategy & Planning Platform
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                        Turn Product Ideas into <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                            Winning Product Launches
                        </span>
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        LaunchPilot gives startups and entrepreneurs the tools to validate target markets,
                        deconstruct competitors, design positioning, and execute flawless multi-phase product launches.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/register"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                        >
                            Start Launching Free
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/login"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-base border border-slate-700 transition-colors"
                        >
                            Sign In to Portal
                        </Link>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            Role-based Admin Controls
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            RESTful Architecture
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Pillars */}
            <section className="py-20 bg-slate-950 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">
                            Complete Launch Operating System
                        </h2>
                        <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Everything You Need to Take Your Product to Market
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Product Management</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Organize product stages from Idea to MVP, Beta, and Launched with clear problem definitions and USPs.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Market Research</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Document market trends, customer pain points, industry size, and validation insights structured by product.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Competitor Analysis</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Profile competitor pricing, strengths, weaknesses, and position your offering to capture market share.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Rocket className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">Launch Plans</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Orchestrate Pre-Launch, Launch Day, and Post-Launch action checklists with task owners and deadlines.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">
                        Ready to orchestrate your next market launch?
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto text-sm sm:text-base">
                        Get started with LaunchPilot today and experience clarity in product-market strategy.
                    </p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
                    >
                        Create Your Free Account
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-400">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-indigo-400" />
                        <span className="font-semibold text-slate-300">LaunchPilot GTM Platform</span>
                    </div>
                    <p>&copy; {new Date().getFullYear()} LaunchPilot. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

